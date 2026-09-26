"use client";

import { useId, useState } from "react";
import { SubmitButton } from "@/components/ui/Button";
import { isValidEmail, subscribe } from "@/lib/newsletter";
import { track, type AnalyticsEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

type Status = "idle" | "sending" | "ok" | "error" | "invalid";

interface Strings {
  email: string;
  firstName?: string;
  cta: string;
  sending: string;
  success: string;
  successSimulated: string;
  error: string;
  invalid: string;
}

/**
 * One form, three uses (first chapter · newsletter · ERIC alert).
 * Posts through lib/newsletter.ts → [NEWSLETTER_ENDPOINT]. With no endpoint it simulates success.
 */
export function LeadForm({
  source,
  event,
  strings,
  tone = "ink",
  className,
  layout = "stack",
  after,
}: {
  source: string;
  event: AnalyticsEvent;
  strings: Strings;
  tone?: "ink" | "paper";
  className?: string;
  layout?: "stack" | "inline";
  /** rendered under the success message: the next step (buy, share) */
  after?: React.ReactNode;
}) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [simulated, setSimulated] = useState(false);
  const paper = tone === "paper";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const firstName = String(fd.get("firstName") ?? "").trim() || undefined;
    const hp = String(fd.get("company") ?? "").trim() || undefined;
    if (!isValidEmail(email)) return setStatus("invalid");
    setStatus("sending");
    const res = await subscribe({ email, firstName, source, hp });
    setSimulated(res.simulated);
    setStatus(res.ok ? "ok" : "error");
    if (res.ok) track(event, { source, simulated: res.simulated });
    if (res.ok && source === "first-chapter") track("newsletter_signup", { source });
  }

  const field = cn(
    "w-full border-b bg-transparent py-3 text-[1.2rem] outline-none transition-colors placeholder:opacity-40",
    paper ? "border-ink/40 focus:border-ink placeholder:text-ink" : "border-bone/40 focus:border-bone placeholder:text-bone",
  );
  const label = cn("mono mb-1 block", paper ? "text-ink/60" : "text-smoke");

  if (status === "ok") {
    return (
      <div role="status" className={cn("py-6", className)}>
        <p className="display-italic text-[clamp(1.6rem,3vw,2.4rem)]">{strings.success}</p>
        {simulated && <p className="mono mt-3 !text-[0.72rem] text-ember">{strings.successSimulated}</p>}
        {after && <div className="mt-8">{after}</div>}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={className} aria-busy={status === "sending"}>
        {/* honeypot: hidden from sighted users and screen readers, invisible to a real visitor's tab order.
            Most form-spam bots fill every field they find, including this one. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          style={{ left: "-9999px" }}
        />
      <div className={cn("grid gap-6", layout === "inline" ? "md:grid-cols-[1fr_auto] md:items-end" : "")}>
        <div className="grid gap-6">
          {strings.firstName && (
            <div>
              <label htmlFor={`${id}-n`} className={label}>
                {strings.firstName}
              </label>
              <input id={`${id}-n`} name="firstName" type="text" autoComplete="given-name" className={field} />
            </div>
          )}
          <div>
            <label htmlFor={`${id}-e`} className={label}>
              {strings.email}
            </label>
            <input
              id={`${id}-e`}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              aria-invalid={status === "invalid"}
              aria-describedby={`${id}-msg`}
              className={field}
            />
          </div>
        </div>
        <SubmitButton disabled={status === "sending"} variant={paper ? "paper" : "primary"} className="w-full md:w-auto md:min-w-[14rem]">
          {status === "sending" ? strings.sending : strings.cta}
        </SubmitButton>
      </div>
      <p id={`${id}-msg`} role="alert" className="mono mt-4 min-h-[1.2em] !text-[0.72rem] text-ember">
        {status === "invalid" ? strings.invalid : status === "error" ? strings.error : ""}
      </p>
    </form>
  );
}
