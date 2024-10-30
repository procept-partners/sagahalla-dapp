import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",  // Background color (dark purple)
        foreground: "hsl(var(--foreground))",  // Foreground color (light text)
        primary: {
          DEFAULT: "hsl(var(--primary))",  // Primary orange
          foreground: "hsl(var(--primary-foreground))",  // Text on primary elements
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",  // Lighter orange for secondary actions
          foreground: "hsl(var(--secondary-foreground))",  // Text on secondary elements
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",  // Red for destructive actions
          foreground: "hsl(var(--destructive-foreground))",  // Text for destructive actions
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",  // Muted color (lighter orange)
          foreground: "hsl(var(--muted-foreground))",  // Text on muted elements
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",  // Accent color
          foreground: "hsl(var(--accent-foreground))",  // Text on accent elements
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",  // Popover background
          foreground: "hsl(var(--popover-foreground))",  // Popover text
        },
        card: {
          DEFAULT: "hsl(var(--card))",  // Card background color (light orange)
          foreground: "hsl(var(--card-foreground))",  // Card text color
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
