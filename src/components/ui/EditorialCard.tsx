"use client";

import type { ReactNode } from "react";
import NextImage from "next/image";
import { cn } from "@/lib/cn";

interface EditorialCardProps {
  image: {
    src: string;
    alt: string;
    aspectRatio?: string;
  };
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
  };
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
}

export function EditorialCard({
  image,
  eyebrow,
  title,
  description,
  cta,
  children,
  className,
  imageClassName,
}: EditorialCardProps) {
  return (
    <div className={cn("group relative flex flex-col", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden bg-surface",
          image.aspectRatio || "aspect-[4/5]",
          imageClassName,
        )}
      >
        <NextImage
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-slow ease-standard group-hover:scale-[1.02]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent"
        />
      </div>

      <div className="relative z-10 flex flex-col gap-3 p-6 lg:-mt-24 lg:ml-auto lg:max-w-sm lg:p-0">
        {eyebrow && (
          <p className="type-metadata text-accent">{eyebrow}</p>
        )}
        <h3 className="type-h3 text-foreground">{title}</h3>
        {description && (
          <p className="type-body text-foreground-secondary">{description}</p>
        )}
        {cta && (
          <a
            href={cta.href}
            className="link-underline type-nav text-foreground transition-colors duration-standard ease-standard hover:text-accent"
          >
            {cta.label}
          </a>
        )}
        {children}
      </div>
    </div>
  );
}
