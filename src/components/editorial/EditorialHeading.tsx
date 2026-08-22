import { cn } from "@/lib/cn";

interface EditorialHeadingProps {
  as?: "h1" | "h2" | "h3" | "p";
  /** Hand-composed lines — each is rendered on its own line so breaks are
   *  deliberate, never left to automatic wrapping. */
  lines: readonly string[];
  /** One line to set in italic serif — the editorial voice in the sentence. */
  italicLine?: number;
  size?: "display" | "hero" | "h1" | "h2";
  tone?: "foreground" | "ivory";
  id?: string;
  className?: string;
}

const SIZE_CLASSES = {
  display: "type-display",
  hero: "type-hero",
  h1: "type-h1",
  h2: "type-h2",
} as const;

const TONE_CLASSES = {
  foreground: "text-foreground",
  ivory: "text-ivory",
} as const;

/**
 * EditorialHeading — display type composed by hand.
 *
 * Display headings are not allowed to wrap themselves. The art direction
 * supplies the breaks (`lines`), one line per block, so the reader receives
 * exactly the phrasing the layout intended. An optional italic line gives
 * the sentence its editorial voice without decoration.
 */
export function EditorialHeading({
  as: Tag = "h2",
  lines,
  italicLine = -1,
  size = "h1",
  tone = "foreground",
  id,
  className,
}: EditorialHeadingProps) {
  return (
    <Tag id={id} className={cn(SIZE_CLASSES[size], TONE_CLASSES[tone], className)}>
      {lines.map((line, index) => (
        <span
          key={`${line}-${index}`}
          className={cn("block", index === italicLine && "italic")}
        >
          {line}
        </span>
      ))}
    </Tag>
  );
}