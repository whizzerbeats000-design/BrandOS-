import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "id" | "className"> {
  label: string;
  id: string;
  className?: string;
}

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="type-metadata text-foreground-secondary">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "h-12 w-full border border-border bg-background-secondary px-4 text-foreground placeholder:text-foreground-muted transition-colors duration-standard ease-standard focus:border-accent",
          className,
        )}
        {...props}
      />
    </div>
  );
}
