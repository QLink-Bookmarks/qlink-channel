const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./providers/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
    "./.rnstorybook/**/*.{js,jsx,ts,tsx}",
    "./.storybook/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "960px",
      xl: "1180px",
      "2xl": "1440px",
      "3xl": "1600px",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          2: "hsl(var(--primary-2))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          yellow: "hsl(var(--accent-yellow))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          elevated: "hsl(var(--surface-elevated))",
        },
        "border-soft": "hsl(var(--border-soft))",
        overlay: "hsl(var(--overlay))",
      },
      borderRadius: {
        xs: "4px",
        sm: "calc(var(--radius) - 8px)",
        md: "calc(var(--radius) - 6px)",
        lg: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) - 2px)",
        "2xl": "var(--radius)",
        "3xl": "20px",
        "4xl": "28px",
      },
      boxShadow: {
        "qlink-sm": "0 1px 3px rgba(var(--glow-rgb), 0.08)",
        "qlink-md": "0 4px 16px rgba(var(--glow-rgb), 0.15)",
        "qlink-lg": "0 12px 32px rgba(var(--glow-rgb), 0.25)",
        "qlink-card": "0 2px 8px rgba(var(--glow-rgb), 0.08)",
        "qlink-glow": "0 0 20px rgba(var(--glow-rgb), 0.35)",
        "qlink-fab": "0 8px 24px rgba(var(--glow-rgb), 0.35), 0 0 0 4px rgba(255, 255, 255, 0.4)",
        "qlink-modal": "0 24px 60px rgba(0, 0, 0, 0.30)",
      },
      fontFamily: {
        sans: ["Pretendard", "SF Pro KR", "Apple SD Gothic Neo", "Noto Sans KR", "sans-serif"],
        display: ["Outfit", "Pretendard", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": "10px",
        xs: "11px",
        sm: "12px",
        base: "13px",
        md: "14px",
        lg: "16px",
        xl: "18px",
        "2xl": "20px",
        "3xl": "22px",
        "4xl": "24px",
        "5xl": "28px",
      },
      spacing: {
        3.5: "14px",
        7: "28px",
        14: "56px",
      },
      minWidth: {
        "button-xs": "var(--button-width-xs)",
        "button-sm": "var(--button-width-sm)",
        "button-default": "var(--button-width-default)",
        "button-lg": "var(--button-width-lg)",
      },
      zIndex: {
        dropdown: "10",
        sticky: "20",
        fixed: "30",
        backdrop: "50",
        sidePanel: "55",
        sidebar: "60",
        modal: "100",
        popover: "110",
        tooltip: "120",
        toast: "130",
      },
      borderWidth: {
        hairline: hairlineWidth(),
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("tailwindcss-animate")],
};
