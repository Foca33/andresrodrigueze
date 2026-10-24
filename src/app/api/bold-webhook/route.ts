import { NextResponse } from "next/server";
import { verifyBoldSignature } from "@/lib/bold";

/**
 * Aviso automático de Bold: cuando un pago se aprueba, marca el pedido como "Pagado" en la hoja
 * (vía Apps Script) y te avisa por correo con el asunto "PAGADO".
 *
 * Se registra en Bold: panel → Integraciones → Webhooks → URL
 *   https://andresrodrigueze.com/api/bold-webhook   (eventos: venta aprobada y anulación aprobada)
 *
 * Variables de entorno (solo servidor):
 *   BOLD_WEBHOOK_SECRET  — llave secreta de Bold (producción)
 *   BOLD_TEST_MODE       — "true" mientras pruebas: Bold firma los avisos de prueba con llave VACÍA
 *   ORDERS_WEBHOOK_URL / ORDERS_WEBHOOK_SECRET — los mismos del pedido (Apps Script)
 *
 * Reglas de Bold: hay que responder 200 en menos de 2 s; si no, reintenta (15 min, 1 h, 4 h, 8 h, 24 h)
 * y puede enviar el mismo evento más de una vez. El script de Apps Script es idempotente (guarda el
 * id del pago), así que un reintento o un duplicado no repite correos ni cambia el estado.
 *
 * OJO: en modo pruebas la firma no protege nada (llave vacía). Quita BOLD_TEST_MODE en producción.
 */

export const runtime = "nodejs";

interface BoldEvent {
  type?: string;
  subject?: string;
  data?: {
    payment_id?: string;
    amount?: { total?: number };
    payment_method?: string;
    metadata?: { reference?: string };
  };
}

export async function POST(req: Request) {
  const raw = await req.text();
  const testMode = process.env.BOLD_TEST_MODE === "true";
  // Pruebas: llave vacía. Producción: la llave secreta (sin alternativas, para no debilitar la firma).
  const key = testMode ? "" : (process.env.BOLD_WEBHOOK_SECRET ?? "");
  if (!testMode && !key) {
    console.error("[bold-webhook] Falta BOLD_WEBHOOK_SECRET.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (!verifyBoldSignature(raw, req.headers.get("x-bold-signature"), key)) {
    return NextResponse.json({ ok: false, error: "bad_signature" }, { status: 401 });
  }

  let ev: BoldEvent;
  try {
    ev = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type = ev.type ?? "";
  // El número de pedido llega en data.metadata.reference. Bold solo documenta ese campo para pagos por API;
  // para el Botón de pagos, si viniera en otro campo, se busca en el cuerpo (ya firmado) con el formato propio.
  const ORDER_RE = /HELA-\d{6}-[A-Z0-9]{4}/;
  const reference = (ev.data?.metadata?.reference ?? "").match(ORDER_RE)?.[0] ?? raw.match(ORDER_RE)?.[0] ?? "";
  if (testMode) {
    // Solo nombres de campos (nunca valores, llaves ni firmas): sirve para confirmar el formato real del evento.
    console.info("[bold-webhook] prueba:", type, "campos:", Object.keys(ev.data ?? {}).join(","), "| pedido encontrado:", !!reference);
  }
  // Pagos que no son de pedidos de la web (datáfono, otros links) o eventos que no importan: se aceptan y se ignoran.
  if (!ORDER_RE.test(reference) || !["SALE_APPROVED", "VOID_APPROVED"].includes(type)) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const webhook = process.env.ORDERS_WEBHOOK_URL;
  const secret = process.env.ORDERS_WEBHOOK_SECRET;
  if (!webhook || !secret) {
    console.error("[bold-webhook] Falta ORDERS_WEBHOOK_URL o ORDERS_WEBHOOK_SECRET.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret,
        action: type === "SALE_APPROVED" ? "paid" : "void",
        orderId: reference,
        paymentId: ev.data?.payment_id ?? ev.subject ?? "",
        amount: ev.data?.amount?.total ?? 0,
        method: ev.data?.payment_method ?? "",
      }),
      signal: AbortSignal.timeout(1800),
    });
    const json = (await res.json().catch(() => null)) as { ok?: boolean } | null;
    if (!res.ok || !json?.ok) throw new Error(`apps script ${res.status}`);
  } catch (err) {
    // 500 → Bold reintenta (a los 15 min, 1 h, 4 h…). El script no duplica avisos.
    console.error("[bold-webhook] No se pudo registrar el pago de", reference, err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
