import { cn } from "@/lib/cn";

interface DividerProps {
  variant?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ variant = "horizontal", className }: DividerProps) {
  if (variant === "vertical") {
    return <span aria-hidden="true" className={cn("inline-block h-full w-px bg-border", className)} />;
  }
  return <hr aria-hidden="true" className={cn("h-px w-full border-0 bg-border", className)} />;
}
