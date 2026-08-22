"use client";

import { forwardRef } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  id?: string;
  title?: string;
  name?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?: boolean;
}

const BASE_CLASSES =
  "type-button inline-flex select-none items-center justify-center gap-[var(--space-3)] whitespace-nowrap uppercase transition-[color,background-color,border-color,transform,box-shadow] duration-fast ease-standard disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-contrast hover:bg-accent-hover",
  outline:
    "border border-border-strong bg-transparent text-foreground hover:border-accent hover:text-accent",
  ghost: "bg-transparent text-foreground hover:text-accent",
  text: "bg-transparent p-0 text-foreground underline decoration-accent/50 underline-offset-8 hover:text-accent hover:decoration-accent",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-10 px-[var(--space-5)]",
  md: "h-11 px-7",
  lg: "h-14 px-[var(--space-10)]",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      children,
      variant = "primary",
      size = "md",
      href,
      target,
      rel,
      className,
      id,
      title,
      name,
      type = "button",
      disabled,
      onClick,
      "aria-label": ariaLabel,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      "aria-haspopup": ariaHasPopup,
    },
    ref,
  ) {
    const classes = cn(
      BASE_CLASSES,
      variant !== "text" && SIZE_CLASSES[size],
      VARIANT_CLASSES[variant],
      className,
    );

    if (href) {
      return (
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          id={id}
          title={title}
          aria-disabled={disabled || undefined}
          aria-label={ariaLabel}
          aria-expanded={ariaExpanded}
          aria-controls={ariaControls}
          aria-haspopup={ariaHasPopup}
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
        type={type}
        disabled={disabled}
        id={id}
        title={title}
        name={name}
        aria-label={ariaLabel}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={ariaHasPopup}
        onClick={onClick}
        className={classes}
      >
        {children}
      </button>
    );
  },
);
