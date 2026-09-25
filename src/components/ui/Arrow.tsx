export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 12" className={`cta-arrow h-3 w-6 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}
