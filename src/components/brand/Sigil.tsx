/**
 * Vegvísir (the Icelandic "way-finder" stave) — the symbol on the HELA cover.
 * Redrawn as clean vector strokes from the cover's tattoo; it is an approximation, not a tracing.
 * Used sparingly: it appears, then disappears. Never as wallpaper.
 */
const ARM_ENDS: string[] = [
  // each string is drawn for an arm pointing "up" (0,-100 = tip) and rotated 45° * i
  "M0 -62 L-9 -76 M0 -62 L9 -76 M0 -62 L0 -92 M-8 -84 L8 -84",
  "M-8 -68 L8 -68 M-6 -78 L6 -78 M0 -78 L0 -92 M-9 -92 L9 -92",
  "M0 -66 L-10 -66 L-10 -80 M0 -66 L10 -66 L10 -80 M0 -66 L0 -92",
  "M-9 -64 L0 -74 L9 -64 M-9 -78 L0 -88 L9 -78 M0 -74 L0 -92",
  "M0 -64 L0 -92 M-10 -72 L0 -82 M10 -72 L0 -82 M-10 -82 L0 -92 M10 -82 L0 -92",
  "M-9 -70 L9 -70 M-9 -70 L-9 -80 M9 -70 L9 -80 M0 -70 L0 -92 M-5 -88 L5 -88",
  "M0 -64 L0 -92 M-9 -76 L9 -76 M-9 -76 L-9 -86 M9 -76 L9 -66",
  "M-8 -66 L0 -74 L8 -66 M0 -74 L0 -92 M-8 -84 L8 -84 M-8 -84 L-8 -92 M8 -84 L8 -92",
];

export function Sigil({
  className,
  title,
  strokeWidth = 2,
}: {
  className?: string;
  title?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="-100 -100 200 200"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="0" cy="0" r="9" vectorEffect="non-scaling-stroke" />
      {ARM_ENDS.map((d, i) => (
        <g key={i} transform={`rotate(${i * 45})`}>
          <path d="M0 -9 L0 -62" vectorEffect="non-scaling-stroke" />
          <path d={d} vectorEffect="non-scaling-stroke" />
        </g>
      ))}
    </svg>
  );
}
