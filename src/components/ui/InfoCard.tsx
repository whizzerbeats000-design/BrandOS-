"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface InfoCardProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function InfoCard({
  eyebrow,
  title,
  description,
  children,
  className,
  as = "div",
}: InfoCardProps) {
  const Tag = as;
  return (
    <Tag className={cn("glass-card p-8 lg:p-10", className)}>
      {eyebrow && (
        <p className="type-metadata mb-4 text-accent">{eyebrow}</p>
      )}
      <h3 className="type-h3 mb-3 text-foreground">{title}</h3>
      {description && (
        <p className="type-body text-foreground-secondary">{description}</p>
      )}
      {children}
    </Tag>
  );
}
