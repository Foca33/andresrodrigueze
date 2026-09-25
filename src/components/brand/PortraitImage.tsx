"use client";

import Image from "next/image";
import { useAssets, useCopy } from "@/components/Providers";
import { cn } from "@/lib/cn";

/**
 * Author portrait, treated as an editorial black-and-white photograph
 * (CSS: grayscale + contrast + grain + vignette). Human character preserved.
 */
export function PortraitImage({ className, sizes = "(min-width: 1024px) 46vw, 92vw" }: { className?: string; sizes?: string }) {
  const { portrait } = useAssets();
  const copy = useCopy();

  return (
    <div className={cn("grain relative isolate overflow-hidden bg-coal", className)}>
      {portrait ? (
        <Image
          src={portrait.src}
          alt={copy.author.portraitAlt}
          fill
          sizes={sizes}
          placeholder={portrait.blur ? "blur" : "empty"}
          blurDataURL={portrait.blur}
          className="object-cover [filter:grayscale(1)]"
        />
      ) : (
        <div
          data-placeholder="portrait"
          role="img"
          aria-label={copy.author.portraitAlt}
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(28% 22% at 50% 34%, rgba(236,230,218,0.30), transparent 70%), radial-gradient(60% 46% at 50% 92%, rgba(236,230,218,0.16), transparent 70%), linear-gradient(180deg,#171716,#080808)",
          }}
        >
          <span className="mono absolute bottom-4 left-4 text-ember">Retrato provisional</span>
        </div>
      )}
      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.35) 100%)" }}
      />
    </div>
  );
}
