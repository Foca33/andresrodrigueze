import { NextResponse } from "next/server";
import { integritySignature } from "@/lib/bold";
import { printOrder } from "@/config/retailers";
import { siteConfig } from "@/config/site";

/**
 * Pedidos del libro impreso (solo Colombia).
 * 1) Valida los datos. 2) Los guarda en una hoja de Google vía Apps Script (ORDERS_WEBHOOK_URL).
 * 3) Solo si quedó guardado, firma el pago y devuelve los datos del Botón de pagos de Bold.
 *    El monto sale de la configuración del servidor (config/retailers.ts), nunca del navegador, y
 *    la llave secreta solo se usa aquí para calcular el hash de integridad.
 *
 * Variables de entorno en Netlify (sin prefijo NEXT_PUBLIC_, solo servidor):
 *   ORDERS_WEBHOOK_URL     — URL de la aplicación web de Apps Script (termina en /exec)
 *   ORDERS_WEBHOOK_SECRET  — la misma clave que pusiste en las propiedades del script
 *   BOLD_API_KEY           — llave de identidad del Botón de pagos (pública, pero la guardamos aquí)
 *   BOLD_WEBHOOK_SECRET    — llave secreta de Bold (pruebas o producción, según el modo)
 *   BOLD_TEST_MODE         — "true" mientras pruebas; vacío o "false" en producción
 *   PAYMENT_LINK_URL       — (opcional) link fijo de Bold; respaldo si faltan las llaves de Bold
 */

export const runtime = "nodejs";

interface Body {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  dept?: string;
  address?: string;
  notes?: string;
  hp?: string;
  attribution?: Record<string, unknown>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^3\d{9}$/;
const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

/** HELA-YYMMDD-XXXX en hora de Bogotá; el sufijo evita choques entre pedidos del mismo día. */
function newOrderId() {
  const d = new Date(Date.now() - 5 * 3600 * 1000); // UTC-5, Colombia no tiene horario de verano
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, "");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `HELA-${ymd}-${suffix}`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot: a un bot le fingimos éxito sin hacer nada y sin darle el link de pago.
  if (body.hp) return NextResponse.json({ ok: true, orderId: "HELA-000000-XXXX", payUrl: "https://example.com/" });

  const order = {
    name: clean(body.name, 80),
    email: clean(body.email, 120),
    phone: clean(body.phone, 10),
    city: clean(body.city, 60),
    dept: clean(body.dept, 60),
    address: clean(body.address, 140),
    notes: clean(body.notes, 160),
  };
  if (
    order.name.length < 5 ||
    !EMAIL_RE.test(order.email) ||
    !PHONE_RE.test(order.phone) ||
    order.city.length < 2 ||
    order.dept.length < 3 ||
    order.address.length < 6
  ) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const webhook = process.env.ORDERS_WEBHOOK_URL;
  const secret = process.env.ORDERS_WEBHOOK_SECRET;
  const boldKey = process.env.BOLD_API_KEY;
  const boldSecret = process.env.BOLD_WEBHOOK_SECRET;
  const fixedUrl = process.env.PAYMENT_LINK_URL;
  const hasBold = !!boldKey && !!boldSecret;
  const hasFixed = !!fixedUrl && /^https:\/\//.test(fixedUrl);
  if (!webhook || !secret || (!hasBold && !hasFixed)) {
    console.error("[order] Falta ORDERS_WEBHOOK_URL, ORDERS_WEBHOOK_SECRET o las llaves de Bold (BOLD_API_KEY y BOLD_WEBHOOK_SECRET).");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  const orderId = newOrderId();
  const origin = body.attribution && typeof body.attribution === "object" ? body.attribution : {};
  const source = ["utm_source", "utm_campaign", "in_app", "referrer"]
    .map((k) => clean((origin as Record<string, unknown>)[k], 40))
    .filter(Boolean)
    .join(" / ");

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" }, // Apps Script lee el cuerpo crudo
      body: JSON.stringify({ secret, orderId, source, ...order }),
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
    if (!res.ok || !json?.ok) {
      console.error("[order] El webhook respondió", res.status, json?.error ?? "sin detalle");
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
  } catch (err) {
    console.error("[order] No se pudo contactar el webhook:", err);
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }

  // El pedido ya está guardado: ahora sí se firma el pago.
  if (hasBold) {
    const amount = printOrder.priceCop; // entero, sin decimales; viene del servidor
    const redirectionUrl = siteConfig.url.startsWith("https://") ? `${siteConfig.url.replace(/\/$/, "")}/gracias` : undefined;
    return NextResponse.json({
      ok: true,
      orderId,
      testMode: process.env.BOLD_TEST_MODE === "true",
      bold: {
        apiKey: boldKey,
        orderId,
        amount,
        currency: "COP",
        integritySignature: integritySignature(orderId, amount, "COP", boldSecret!),
        description: `HELA edición impresa ${orderId}`.slice(0, 100),
        redirectionUrl,
      },
    });
  }
  return NextResponse.json({ ok: true, orderId, payUrl: fixedUrl });
}
