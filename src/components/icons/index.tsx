import type { SVGProps } from "react";

type IconProps = Pick<SVGProps<SVGSVGElement>, "className">;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function SearchIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <line x1="16" y1="16" x2="20.5" y2="20.5" />
    </svg>
  );
}

export function BagIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5.5 8h13l-.8 12.2a1.5 1.5 0 0 1-1.5 1.3H7.8a1.5 1.5 0 0 1-1.5-1.3L5.5 8Z" />
      <path d="M8.5 10.5V6.75a3.5 3.5 0 0 1 7 0v3.75" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="17" x2="20" y2="17" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  );
}

export function ArrowUpRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="20" y1="12" x2="4" y2="12" />
      <path d="M10 6l-6 6 6 6" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="9" y1="6" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="18" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 5.5v13l11-6.5-11-6.5Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.75" />
      <circle cx="17.1" cy="6.9" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XSocialIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="9" cy="7" r="2.25" />
      <circle cx="15" cy="17" r="2.25" />
    </svg>
  );
}
