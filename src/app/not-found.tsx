import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { getCopy } from "@/content";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  const c = getCopy(siteConfig.locale).notFound;
  return (
    <main className="flex min-h-svh flex-col justify-between bg-ink px-gutter py-10 text-bone">
      <Link href="/" aria-label="HELA — inicio" className="text-[1.1rem]">
        <Wordmark word="hela" />
      </Link>
      <div>
        <h1 className="display text-[clamp(3rem,11vw,10rem)] !leading-[0.9]">{c.title}</h1>
        <p className="display text-[clamp(3rem,11vw,10rem)] !leading-[0.9] text-ember">{c.line}</p>
      </div>
      <Link href="/" className="cta mono inline-flex w-full items-center justify-between bg-bone px-6 py-4 text-ink hover:bg-ember hover:text-bone sm:w-auto sm:min-w-[16rem]">
        {c.cta}
      </Link>
    </main>
  );
}
