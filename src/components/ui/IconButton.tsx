"use client";

import { forwardRef } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

export type IconButtonVariant = "outline" | "ghost";
export type IconButtonSize = "md" | "lg";

export interface IconButtonProps {
  label: string;
  children: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  href?: string;
  className?: string;
  disabled?: boolean;
  title?: string;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

const BASE_CLASSES =
  "inline-flex shrink-0 select-none items-center justify-center transition-[color,background-color,border-color] duration-standard ease-standard disabled:pointer-events-none disabled:opacity-50";

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  outline:
    "border border-border-strong bg-transparent text-foreground hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-foreground hover:text-accent",
};

const SIZE_CLASSES: Record<IconButtonSize, string> = {
  md: "h-11 w-11",
  lg: "h-12 w-12",
};

export const IconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  function IconButton(
    {
      label,
      children,
      variant = "outline",
      size = "md",
      href,
      className,
      disabled,
      title,
      onClick,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
    },
    ref,
  ) {
    const classes = cn(
      BASE_CLASSES,
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      className,
    );

    if (href) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          aria-label={label}
          title={title}
          aria-disabled={disabled || undefined}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          onClick={onClick}
          className={classes}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        disabled={disabled}
        aria-label={label}
        title={title}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        onClick={onClick}
        className={classes}
      >
        {children}
      </button>
    );
  },
);
