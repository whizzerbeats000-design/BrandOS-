import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TypeLevel =
  | "display"
  | "hero"
  | "h1"
  | "h2"
  | "h3"
  | "editorial"
  | "body"
  | "body-small"
  | "nav"
  | "metadata"
  | "price"
  | "button"
  | "label"
  | "quote"
  | "title"
  | "manifesto"
  | "small"
  | "caption";

const LEVEL_TAGS: Record<TypeLevel, ElementType> = {
  display: "h1",
  hero: "h1",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  editorial: "p",
  body: "p",
  "body-small": "p",
  nav: "span",
  metadata: "span",
  price: "span",
  button: "span",
  label: "span",
  quote: "blockquote",
  title: "h2",
  manifesto: "h2",
  small: "span",
  caption: "span",
};

interface TypographyProps {
  children: ReactNode;
  level?: TypeLevel;
  as?: ElementType;
  className?: string;
}

export function Typography({ children, level = "body", as, className }: TypographyProps) {
  const Tag = as ?? LEVEL_TAGS[level];
  return <Tag className={cn(`type-${level}`, className)}>{children}</Tag>;
}
