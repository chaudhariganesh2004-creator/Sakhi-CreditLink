import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          '"Noto Sans Gujarati"',
          '"Nirmala UI"',
          '"Shruti"',
          "system-ui",
          "sans-serif",
        ],
        serif: ['"Source Serif 4"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        canvas: "#FAF8F4",
        surface: "#FFFFFF",
        "surface-muted": "#F2EFE8",
        ink: "#141A23",
        "ink-muted": "#475467",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0F5E4E",
          hover: "#0A4539",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F2EFE8",
          foreground: "#141A23",
        },
        muted: {
          DEFAULT: "#F2EFE8",
          foreground: "#475467",
        },
        accent: {
          DEFAULT: "#B45309",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#B91C1C",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#141A23",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
