import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { hogql, posthogConfigured, type Row } from "@/lib/posthog-query";

/**
 * Datos del panel privado /panel. Protegido con contraseña (PANEL_PASSWORD en Netlify).
 * Cada bloque se consulta por separado: si uno falla, los demás se muestran igual.
 * Las consultas a PostHog se recuerdan 20 s en el servidor para no gastar el límite de la API.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DIAS = 14;
const WINDOW = `timestamp >= now() - INTERVAL ${DIAS} DAY`;
const HOY = `toDate(toTimeZone(timestamp, 'America/Bogota')) = toDate(toTimeZone(now(), 'America/Bogota'))`;

const QUERIES = {
  resumen: `
    SELECT
      uniqIf(distinct_id, event = '$pageview' AND timestamp >= now() - INTERVAL 30 MINUTE),
      uniqIf(distinct_id, event = '$pageview' AND ${HOY}),
      uniqIf(distinct_id, event = '$pageview'),
      countIf(event = '$pageview')
    FROM events WHERE ${WINDOW}`,
  tiempo: `
    SELECT
      avgIf(toFloat(properties.$prev_pageview_duration), event = '$pageleave'
        AND toFloat(properties.$prev_pageview_duration) >= 1 AND toFloat(properties.$prev_pageview_duration) <= 1800),
      uniqIf(distinct_id, event = 'engaged_30s'),
      uniqIf(distinct_id, event = 'engaged_60s')
    FROM events WHERE ${WINDOW}`,
  embudo: `
    SELECT event, uniq(distinct_id) FROM events
    WHERE ${WINDOW} AND event IN ('$pageview','order_open','order_submit','order_pay_click','order_paid')
    GROUP BY event`,
  clics: `
    SELECT event, coalesce(nullIf(toString(properties.location), ''), 'otro'), count()
    FROM events
    WHERE ${WINDOW} AND event IN ('purchase_click_kindle','purchase_click_paperback')
    GROUP BY event, 2 ORDER BY 3 DESC`,
  interes: `
    SELECT event, count(), uniq(distinct_id) FROM events
    WHERE ${WINDOW} AND event IN ('first_chapter_click','hero_chapter_click','newsletter_signup','hero_cta_click')
    GROUP BY event`,
  scroll: `
    SELECT toString(properties.percent), uniq(distinct_id) FROM events
    WHERE ${WINDOW} AND event = 'scroll_depth' GROUP BY 1 ORDER BY 1`,
  fuentes: `
    SELECT
      coalesce(nullIf(nullIf(toString(properties.utm_source), ''), 'null'),
               nullIf(nullIf(nullIf(toString(properties.$referring_domain), ''), '$direct'), 'null'), 'directo') AS fuente,
      uniq(distinct_id)
    FROM events WHERE ${WINDOW} AND event = '$pageview'
    GROUP BY fuente ORDER BY 2 DESC LIMIT 8`,
  dias: `
    SELECT toString(toDate(toTimeZone(timestamp, 'America/Bogota'))) AS d, uniq(distinct_id)
    FROM events WHERE ${WINDOW} AND event = '$pageview'
    GROUP BY d ORDER BY d`,
} as const;

type Block<T> = { ok: true; data: T } | { ok: false; error: string };

const cache = new Map<string, { at: number; rows: Row[] }>();
async function cached(name: keyof typeof QUERIES): Promise<Row[]> {
  const hit = cache.get(name);
  if (hit && Date.now() - hit.at < 20000) return hit.rows;
  const rows = await hogql(QUERIES[name]);
  cache.set(name, { at: Date.now(), rows });
  return rows;
}

async function block<T>(fn: () => Promise<T>): Promise<Block<T>> {
  try {
    return { ok: true, data: await fn() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message.slice(0, 220) : "Error" };
  }
}

/** Copias vendidas: se lo pedimos al script de Google (solo el número, sin datos de compradores). */
async function copias(): Promise<{ sold: number; pending: number; total: number }> {
  const url = process.env.ORDERS_WEBHOOK_URL;
  const secret = process.env.ORDERS_WEBHOOK_SECRET;
  if (!url || !secret) throw new Error("Falta ORDERS_WEBHOOK_URL u ORDERS_WEBHOOK_SECRET");
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ secret, action: "count" }),
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as { ok?: boolean; sold?: number; pending?: number; total?: number } | null;
  if (!json?.ok || typeof json.sold !== "number") throw new Error("El script de Google no respondió el conteo (¿falta actualizarlo?)");
  return { sold: json.sold, pending: json.pending ?? 0, total: json.total ?? 100 };
}

const sha = (s: string) => createHash("sha256").update(s).digest();
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

export async function POST(req: Request) {
  const expected = process.env.PANEL_PASSWORD;
  if (!expected) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const given = req.headers.get("x-panel-key") ?? "";
  if (!timingSafeEqual(sha(given), sha(expected))) {
    await new Promise((r) => setTimeout(r, 700)); // frena los intentos al azar
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const configured = posthogConfigured();
  const off = async (): Promise<never> => {
    throw new Error("Falta POSTHOG_PERSONAL_API_KEY o POSTHOG_PROJECT_ID en Netlify");
  };
  const q = (name: keyof typeof QUERIES) => (configured ? cached(name) : off());

  const [resumen, tiempo, embudo, clics, interes, scroll, fuentes, dias, ventas] = await Promise.all([
    block(async () => {
      const r = (await q("resumen"))[0] ?? [];
      return { ahora: num(r[0]), hoy: num(r[1]), visitantes: num(r[2]), paginas: num(r[3]) };
    }),
    block(async () => {
      const r = (await q("tiempo"))[0] ?? [];
      return { promedioSeg: num(r[0]), l30: num(r[1]), l60: num(r[2]) };
    }),
    block(async () => Object.fromEntries((await q("embudo")).map((r) => [String(r[0]), num(r[1])]))),
    block(async () => (await q("clics")).map((r) => ({ evento: String(r[0]), lugar: String(r[1]), n: num(r[2]) }))),
    block(async () => (await q("interes")).map((r) => ({ evento: String(r[0]), total: num(r[1]), personas: num(r[2]) }))),
    block(async () => (await q("scroll")).map((r) => ({ percent: String(r[0]), personas: num(r[1]) }))),
    block(async () => (await q("fuentes")).map((r) => ({ fuente: String(r[0]), personas: num(r[1]) }))),
    block(async () => (await q("dias")).map((r) => ({ dia: String(r[0]), personas: num(r[1]) }))),
    block(copias),
  ]);

  return NextResponse.json(
    { generado: new Date().toISOString(), dias: DIAS, resumen, tiempo, embudo, clics, interes, scroll, fuentes, serie: dias, ventas },
    { headers: { "cache-control": "no-store" } },
  );
}
