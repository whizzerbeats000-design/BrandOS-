import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ContainerWidth = "content" | "text" | "full";

interface ContainerProps {
  children: ReactNode;
  as?: ElementType;
  /** content = wide editorial max (default), text = narrow reading, full = full-bleed. */
  width?: ContainerWidth;
  className?: string;
}

const WIDTH_CLASSES: Record<ContainerWidth, string> = {
  content: "max-w-[var(--max-width-content)]",
  text: "max-w-[var(--max-width-text)]",
  full: "max-w-none",
};

export function Container({ children, as: Tag = "div", width = "content", className }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full px-gutter", WIDTH_CLASSES[width], className)}>
      {children}
    </Tag>
  );
}
