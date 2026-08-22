import { cn } from "@/lib/cn";

export interface SectionAction {
  label: string;
  href: string;
}

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: SectionAction;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={cn("flex flex-col gap-[var(--space-4)] lg:gap-[var(--space-6)]", centered && "items-center text-center", className)}>
      <div className={cn("flex flex-col gap-5 lg:gap-6", centered ? "items-center" : "")}>
        {eyebrow ? (
          <p className="type-metadata flex items-center gap-3 text-foreground-muted">
            <span aria-hidden="true" className="h-px w-10 bg-foreground/30" />
            {eyebrow}
          </p>
        ) : null}
        <h2 id={id} className="type-h2 max-w-3xl text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="type-body max-w-xl text-foreground-secondary">{description}</p>
        ) : null}
      </div>
      {action ? (
        <a href={action.href} className="link-underline type-nav text-foreground lg:pb-1">
          {action.label}
        </a>
      ) : null}
    </div>
  );
}
