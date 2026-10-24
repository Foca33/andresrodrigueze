import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { getCopy } from "@/content";
import { siteConfig } from "@/config/site";

/** Página de retorno del pago (Bold redirige aquí). No debe indexarse. */
export const metadata: Metadata = {
  title: "Gracias · HELA",
  robots: { index: false, follow: false },
};

/**
 * Bold agrega ?bold-order-id=...&bold-tx-status=... a la URL. El estado que ve el cliente puede no ser el
 * definitivo, así que aquí NO se muestra como confirmación: el pedido se confirma con el aviso del webhook
 * (correo "Pago recibido"). Del parámetro solo se usa el número de pedido, y solo si tiene el formato propio.
 */
export default async function Gracias({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const c = getCopy(siteConfig.locale).thanks;
  const q = await searchParams;
  const raw = q["bold-order-id"];
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  const orderId = candidate && /^HELA-\d{6}-[A-Z0-9]{4}$/.test(candidate) ? candidate : null;
  const email = siteConfig.author.email;
  const hasEmail = !email.startsWith("[");

  return (
    <main className="flex min-h-svh flex-col justify-between bg-ink px-gutter py-10 text-bone">
      <Link href="/" aria-label="HELA — inicio" className="text-[1.1rem]">
        <Wordmark word="hela" />
      </Link>
      <div className="max-w-2xl">
        <h1 className="display text-[clamp(3rem,11vw,9rem)] !leading-[0.9]">{c.title}</h1>
        {orderId && (
          <p className="mono mt-8 text-smoke">
            {c.order}: <span className="text-bone">{orderId}</span>
          </p>
        )}
        <p className="mt-6 text-[1.15rem] leading-[1.55] text-smoke">{c.body}</p>
        {hasEmail && (
          <p className="mt-4 text-[1rem] leading-[1.55] text-smoke">
            {c.problem}{" "}
            <a className="underline underline-offset-4 hover:text-bone" href={`mailto:${email}`}>
              {email}
            </a>
          </p>
        )}
      </div>
      <Link href="/" className="cta mono inline-flex w-full items-center justify-between bg-bone px-6 py-4 text-ink hover:bg-ember hover:text-bone sm:w-auto sm:min-w-[16rem]">
        {c.cta}
      </Link>
    </main>
  );
}
