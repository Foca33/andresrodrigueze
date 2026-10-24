"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCopy } from "@/components/Providers";
import { ActionButton, LinkButton, SubmitButton } from "@/components/ui/Button";
import { ORDER_EVENT } from "@/lib/order";
import { getAttribution, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type FieldKey = "name" | "email" | "phone" | "city" | "dept" | "address";
type Errors = Partial<Record<FieldKey | "consent" | "server", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Celular colombiano: 10 dígitos que empiezan por 3 (acepta +57 / 57 delante). */
export const normalizePhone = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.length === 12 && d.startsWith("57") ? d.slice(2) : d;
};
const PHONE_RE = /^3\d{9}$/;

/** Datos firmados por el servidor para el Botón de pagos de Bold (/api/order). */
interface BoldData {
  apiKey: string;
  orderId: string;
  amount: number;
  currency: string;
  integritySignature: string;
  description: string;
  redirectionUrl?: string;
}

interface Done {
  orderId: string;
  testMode: boolean;
  bold?: BoldData;
  /** respaldo: link fijo de Bold cuando no hay llaves configuradas */
  payUrl?: string;
}

declare global {
  interface Window {
    BoldCheckout?: new (config: Record<string, unknown>) => { open: () => void };
  }
}

const BOLD_SCRIPT = "https://checkout.bold.co/library/boldPaymentButton.js";

/** Carga el script de Bold una sola vez, bajo demanda (API JS de Bold: BoldCheckout). */
function loadBold(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.BoldCheckout) return resolve();
    const done = () => (window.BoldCheckout ? resolve() : reject(new Error("bold")));
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${BOLD_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", done, { once: true });
      existing.addEventListener("error", () => reject(new Error("bold")), { once: true });
      return;
    }
    const js = document.createElement("script");
    js.src = BOLD_SCRIPT;
    js.async = true;
    js.onload = done;
    js.onerror = () => reject(new Error("bold"));
    document.head.appendChild(js);
  });
}

/**
 * Formulario de pedido del libro impreso (solo Colombia).
 * Registra el pedido en /api/order y, solo si quedó guardado, muestra el botón de pago de Bold.
 * Native <dialog>, mismo patrón que PrivacyDialog.
 */
export function OrderDialog() {
  const c = useCopy().order;
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<Done | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(false);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    const open = () => {
      if (!dlg.open) dlg.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    const onClose = () => {
      document.documentElement.style.overflow = "";
    };
    window.addEventListener(ORDER_EVENT, open);
    dlg.addEventListener("close", onClose);
    return () => {
      window.removeEventListener(ORDER_EVENT, open);
      dlg.removeEventListener("close", onClose);
      document.documentElement.style.overflow = "";
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    const v = (k: string) => String(fd.get(k) ?? "").trim();
    const data = {
      name: v("name"),
      email: v("email"),
      phone: normalizePhone(v("phone")),
      city: v("city"),
      dept: v("dept"),
      address: v("address"),
      notes: v("notes"),
    };
    const next: Errors = {};
    if (data.name.length < 5 || !data.name.includes(" ")) next.name = c.errors.name;
    if (!EMAIL_RE.test(data.email)) next.email = c.errors.email;
    if (!PHONE_RE.test(data.phone)) next.phone = c.errors.phone;
    if (data.city.length < 2) next.city = c.errors.city;
    if (data.dept.length < 3) next.dept = c.errors.dept;
    if (data.address.length < 6) next.address = c.errors.address;
    if (fd.get("consent") !== "on") next.consent = c.errors.consent;
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, hp: v("company"), attribution: getAttribution() }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        orderId?: string;
        testMode?: boolean;
        bold?: BoldData;
        payUrl?: string;
      };
      if (res.ok && json.ok && json.orderId && (json.bold || json.payUrl)) {
        track("order_submit", { city: data.city });
        setDone({ orderId: json.orderId, testMode: !!json.testMode, bold: json.bold, payUrl: json.payUrl });
      } else {
        setErrors({ server: c.errors.server });
      }
    } catch {
      setErrors({ server: c.errors.server });
    } finally {
      setSending(false);
    }
  }

  /** Abre el pago de Bold: redirige a su pasarela y al terminar vuelve a /gracias. */
  async function pay() {
    if (!done?.bold || paying) return;
    setPaying(true);
    setPayError(false);
    track("order_pay_click", { orderId: done.orderId });
    try {
      await loadBold();
      new window.BoldCheckout!({
        orderId: done.bold.orderId,
        currency: done.bold.currency,
        amount: String(done.bold.amount),
        apiKey: done.bold.apiKey,
        integritySignature: done.bold.integritySignature,
        description: done.bold.description,
        ...(done.bold.redirectionUrl ? { redirectionUrl: done.bold.redirectionUrl } : {}),
      }).open();
    } catch {
      setPayError(true);
    } finally {
      setPaying(false);
    }
  }

  const input =
    "w-full border-b border-bone/40 bg-transparent py-2.5 text-[1.1rem] text-bone outline-none transition-colors placeholder:opacity-40 focus:border-bone";
  const label = "mono mb-1 block text-smoke";
  const err = "mono mt-1 min-h-[1.1em] !text-[0.72rem] text-ember";

  const field = (key: FieldKey, props: React.InputHTMLAttributes<HTMLInputElement>, wide = false) => (
    <div className={cn(wide && "md:col-span-2")}>
      <label htmlFor={`${id}-${key}`} className={label}>
        {c.fields[key]}
      </label>
      <input
        id={`${id}-${key}`}
        name={key}
        required
        aria-invalid={!!errors[key]}
        aria-describedby={`${id}-${key}-e`}
        className={input}
        {...props}
      />
      <p id={`${id}-${key}-e`} role="alert" className={err}>
        {errors[key] ?? ""}
      </p>
    </div>
  );

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-titulo`}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      className="m-auto max-h-[92svh] w-[min(40rem,calc(100vw-1.5rem))] overflow-y-auto border border-bone/15 bg-coal p-0 text-bone backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-bone/10 bg-coal px-6 py-4 md:px-9">
        <h2 id={`${id}-titulo`} className="mono text-bone">
          {done ? c.done.title : c.title}
        </h2>
        <button type="button" className="mono -mr-3 px-3 py-3 text-smoke hover:text-bone" onClick={() => ref.current?.close()}>
          {c.close}
        </button>
      </div>

      {done ? (
        <div role="status" className="space-y-6 px-6 py-8 md:px-9">
          <div>
            <p className="mono text-smoke">{c.done.id}</p>
            <p className="display text-[clamp(2rem,6vw,3rem)] !leading-none">{done.orderId}</p>
          </div>
          <p className="text-[1.05rem] leading-[1.55] text-smoke">{c.done.body}</p>
          {done.bold ? (
            <ActionButton className="w-full" onClick={pay}>
              {paying ? c.done.opening : c.done.pay}
            </ActionButton>
          ) : (
            <LinkButton
              href={done.payUrl!}
              external
              className="w-full"
              onClick={() => track("order_pay_click", { orderId: done.orderId })}
            >
              {c.done.pay}
            </LinkButton>
          )}
          {done.testMode && (
            <p className="mono !text-[0.72rem] text-ember">{c.done.testMode}</p>
          )}
          {payError && (
            <p role="alert" className="mono !text-[0.72rem] text-ember">
              {c.done.payError}
            </p>
          )}
          <p className="mono !text-[0.72rem] text-smoke">{c.done.keep}</p>
          <p className="mono !text-[0.72rem] text-fog">{c.done.after}</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate aria-busy={sending} className="px-6 py-7 md:px-9">
          <p className="mb-6 text-[1.05rem] leading-[1.5] text-bone">{c.lead}</p>
          {/* honeypot */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="pointer-events-none absolute h-0 w-0 opacity-0"
            style={{ left: "-9999px" }}
          />
          <fieldset className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
            <legend className="sr-only">{c.legend}</legend>
            {field("name", { type: "text", autoComplete: "name", maxLength: 80 }, true)}
            {field("email", { type: "email", inputMode: "email", autoComplete: "email", maxLength: 120 })}
            {field("phone", { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 16 })}
            {field("city", { type: "text", autoComplete: "address-level2", maxLength: 60 })}
            {field("dept", { type: "text", autoComplete: "address-level1", maxLength: 60 })}
            {field("address", { type: "text", autoComplete: "street-address", maxLength: 140 }, true)}
            <div className="md:col-span-2">
              <label htmlFor={`${id}-notes`} className={label}>
                {c.fields.notes}
              </label>
              <input id={`${id}-notes`} name="notes" type="text" maxLength={160} className={input} />
            </div>
          </fieldset>

          <label className="mt-7 flex cursor-pointer items-start gap-3 text-[0.95rem] leading-[1.45] text-smoke">
            <input type="checkbox" name="consent" className="mt-1 h-4 w-4 shrink-0 accent-[#ece6da]" />
            <span>{c.consent}</span>
          </label>
          <p role="alert" className={err}>
            {errors.consent ?? ""}
          </p>

          <SubmitButton disabled={sending} className="mt-4 w-full">
            {sending ? c.sending : c.submit}
          </SubmitButton>
          <p role="alert" className="mono mt-4 min-h-[1.2em] !text-[0.72rem] text-ember">
            {errors.server ?? ""}
          </p>
        </form>
      )}
    </dialog>
  );
}
