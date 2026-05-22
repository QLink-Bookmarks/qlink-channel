import { type AccentName } from "@/lib/theme";

export const ACCENT_OPTIONS: AccentName[] = ["gray", "pink", "blue"];

export const accentSwatchClasses = {
  swatch: {
    gray: "bg-[#6b7280]",
    pink: "bg-pink-400",
    blue: "bg-blue-500",
  },
} as const;
