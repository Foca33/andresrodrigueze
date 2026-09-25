/** Section label like "03 — Ediciones": the dash is the red mark that recurs down the page. */
export function Dashed({ text, paper = false }: { text: string; paper?: boolean }) {
  const parts = text.split(" — ");
  if (parts.length < 2) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <span aria-hidden className={`mx-[0.55em] inline-block h-px w-[1.6em] -translate-y-[0.28em] ${paper ? "bg-blood-deep" : "bg-ember"}`} />
      <span className="sr-only"> — </span>
      {parts.slice(1).join(" — ")}
    </>
  );
}
