import { hela, eric, type WordmarkData, type WordmarkLetter } from "./wordmarks";

/** SVG units per em for each traced wordmark (cap height of the source artwork). */
const UNIT_H = { hela: 215.5, eric: 646 } as const;
const DATA: Record<WordName, WordmarkData> = { hela, eric };

export type WordName = "hela" | "eric";

/** Ratio width/height of the whole word (height = 1em). */
export const wordmarkAspect = (word: WordName) => DATA[word].width;
export const wordmarkLetters = (word: WordName) => DATA[word].letters;

/**
 * One letter of the title lettering (Arial Black, traced from the cover art so it is identical on
 * every device — phones don't ship Arial Black). Sized by `font-size`: the glyph is 1em tall.
 */
export function WordmarkGlyph({ word, letter, className }: { word: WordName; letter: WordmarkLetter; className?: string }) {
  const h = UNIT_H[word];
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox={`0 0 ${(letter.w * h).toFixed(2)} ${h}`}
      className={className}
      style={{ height: "1em", width: `${letter.w}em`, display: "block", flex: "none" }}
      fill="currentColor"
      fillRule="evenodd"
    >
      <path d={letter.d} />
    </svg>
  );
}

/** Static wordmark. Size it with `font-size` (text-[..]) and colour it with `text-*`. */
export function Wordmark({ word, className, label }: { word: WordName; className?: string; label?: string }) {
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
      style={{ display: "inline-flex", height: "1em", lineHeight: 1, verticalAlign: "top" }}
    >
      {DATA[word].letters.map((l, i) => (
        <span key={l.ch + i} style={{ marginLeft: `${l.ml}em`, display: "block" }}>
          <WordmarkGlyph word={word} letter={l} />
        </span>
      ))}
    </span>
  );
}
