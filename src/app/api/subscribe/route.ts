import { NextResponse } from "next/server";

/**
 * Server-side proxy to Brevo: keeps BREVO_API_KEY out of the browser bundle.
 * The client (lib/newsletter.ts) POSTs { email, firstName?, source, hp?, attribution?, consent, consentAt }
 * here; this route only cares about email / firstName / source / hp and forwards the rest as attributes.
 *
 * Requires two env vars in Netlify (Site settings → Environment variables), NOT prefixed NEXT_PUBLIC_
 * so they stay server-only:
 *   BREVO_API_KEY  — Brevo → gear icon → SMTP & API → API Keys → Generate a new API key
 *   BREVO_LIST_ID  — Brevo → Contacts → Lists → open your list → the numeric id in the URL
 */

export const runtime = "nodejs";

interface Body {
  email?: string;
  firstName?: string;
  source?: string;
  /** honeypot field: real visitors never fill it, bots that fill every field do */
  hp?: string;
  attribution?: Record<string, unknown>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot tripped: pretend success, do nothing else. Never tell a bot it was caught.
  if (body.hp) return NextResponse.json({ ok: true });

  const email = (body.email ?? "").trim();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) {
    console.error("[subscribe] Falta BREVO_API_KEY o BREVO_LIST_ID en las variables de entorno.");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  const attributes: Record<string, string> = {};
  if (body.firstName) attributes.FIRSTNAME = body.firstName.slice(0, 80);
  if (body.source) attributes.SOURCE = body.source.slice(0, 40);
  if (body.attribution && typeof body.attribution === "object") {
    for (const [k, v] of Object.entries(body.attribution)) {
      if (typeof v === "string" && v) attributes[k.toUpperCase().slice(0, 50)] = v.slice(0, 100);
    }
  }

  let res: Response;
  try {
    res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json", "api-key": apiKey },
      body: JSON.stringify({ email, attributes, listIds: [listId], updateEnabled: true }),
    });
  } catch (err) {
    console.error("[subscribe] No se pudo contactar a Brevo:", err);
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }

  // 201/204 = contacto creado o actualizado. Un 400 "duplicate_parameter" no debería ocurrir con
  // updateEnabled:true, pero si Brevo lo devuelve igual, lo tratamos como éxito, no como error.
  if (res.ok || res.status === 204) return NextResponse.json({ ok: true });

  const errText = await res.text().catch(() => "");
  if (res.status === 400 && errText.includes("duplicate_parameter")) {
    return NextResponse.json({ ok: true });
  }

  console.error("[subscribe] Brevo respondió", res.status, errText.slice(0, 300));
  return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
}
