export interface NavItem {
  label: string;
  href: string;
  /** Treat nested routes (e.g. /collections/[slug]) as active too. */
  matchPrefix?: boolean;
  /** Ordered position shown in the sidebar/mobile menu. */
  number?: number;
}

/** Primary site routes — used by the sidebar, mobile menu and footer. */
export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Home", href: "/", number: 1 },
  { label: "Shop", href: "/shop", number: 2 },
  { label: "Collections", href: "/collections", matchPrefix: true, number: 3 },
  { label: "About", href: "/about", number: 4 },
] as const;

/** Bag lives in the same numbered sequence as a utility entry. */
export const BAG_NAV = { label: "Bag", href: "/cart", number: 5 } as const;

/** Social platform destinations. */
export const SOCIAL_NAV: readonly { label: string; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/sus_wears?igsi=Y3A1cmp2cHQ4OWl6" },
  { label: "Facebook", href: "https://www.facebook.com/share/1CMCAozViD/" },
  { label: "TikTok", href: "https://www.tiktok.com/@suswears" },
] as const;

export const FOOTER_NAV: readonly NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections", matchPrefix: true },
  { label: "About", href: "/about" },
] as const;

export const CONTACT_EMAIL = "suswears469@gmail.com";