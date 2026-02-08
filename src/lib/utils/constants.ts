import type { SpendingCategory } from "@/lib/types/spending";

export const COLORS = {
  texasBlue: "#003f87",
  texasOrange: "#bf5700",
  texasRed: "#d00000",
  texasGreen: "#2d6a4f",
  background: "#fafafa",
  charcoal: "#2b2d42",
} as const;

export const CATEGORY_COLORS: Record<SpendingCategory, string> = {
  education: COLORS.texasBlue,
  health: COLORS.texasGreen,
  transportation: COLORS.texasOrange,
  public_safety: COLORS.texasRed,
  other: "#8d99ae",
};

export const CATEGORY_LABELS: Record<SpendingCategory, string> = {
  education: "Education",
  health: "Health & Human Services",
  transportation: "Transportation",
  public_safety: "Public Safety",
  other: "Other",
};

export const CATEGORY_EMOJIS: Record<SpendingCategory, string> = {
  education: "\u{1F4DA}",
  health: "\u{1FA7A}",
  transportation: "\u{1F6E3}\uFE0F",
  public_safety: "\u{1F6E1}\uFE0F",
  other: "\u{1F4CB}",
};

export const QUICK_CITIES = [
  { name: "Houston", zip: "77002" },
  { name: "Dallas", zip: "75201" },
  { name: "Austin", zip: "78701" },
  { name: "San Antonio", zip: "78201" },
  { name: "Fort Worth", zip: "76102" },
  { name: "El Paso", zip: "79901" },
] as const;

export const SITE_NAME = "TxTax";
export const SITE_DESCRIPTION =
  "See exactly where your Texas state tax dollars went.";
