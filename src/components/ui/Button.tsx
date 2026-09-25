import type { AnchorHTMLAttributes } from "react";
import { Arrow } from "./Arrow";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "paper";

interface Props extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  variant?: Variant;
  external?: boolean;
  className?: string;
  arrow?: boolean;
}

const base =
  "cta mono group relative inline-flex items-center justify-between gap-6 whitespace-nowrap px-6 py-4 text-[0.74rem] font-medium tracking-[0.18em] transition-colors duration-500";

const variants: Record<Variant, string> = {
  primary:
    "bg-bone text-ink hover:bg-ember hover:text-bone outline outline-1 -outline-offset-1 outline-bone hover:outline-ember",
  paper:
    "bg-ink text-bone hover:bg-transparent hover:text-ink outline outline-1 -outline-offset-1 outline-ink",
  ghost:
    "px-0! py-2 text-bone/80 hover:text-bone border-b border-bone/30 hover:border-bone",
};

/** Anchor-based button: purchase / social links must be real links that open in a new tab. */
export function LinkButton({ variant = "primary", external, className, arrow = true, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(base, variants[variant], className)}
    >
      <span>{children}</span>
      {arrow && <Arrow />}
    </a>
  );
}

/** Real <button> version (forms). */
export function SubmitButton({
  children,
  disabled,
  variant = "primary",
  className,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={cn(base, variants[variant], "disabled:cursor-wait disabled:opacity-60", className)}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  );
}
