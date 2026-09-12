import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
     colors: {
        // ▼▼▼ YE SAB ADD KARO ▼▼▼

        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // ▲▲▲ YE SAB ADD KARO ▲▲▲

        ink: {
          950: "#08090D",
          900: "#0D0F14",
          800: "#141720",
          700: "#1A1D2E",
          600: "#222640",
          500: "#2C3154",
        },
        gold: {
          900: "#7A5C1E",
          800: "#A07828",
          700: "#C9A84C",
          600: "#D4B862",
          500: "#E5C97E",
          400: "#F0D98A",
          300: "#F8EBBB",
          200: "#FDF6E3",
        },
        emerald: {
          700: "#047857",
          600: "#059669",
          500: "#10B981",
          400: "#34D399",
          300: "#6EE7B7",
        },
        crimson: {
          600: "#DC2626",
          500: "#EF4444",
          400: "#F87171",
        },
        surface: {
          900: "#0D0F14",
          800: "#141720",
          700: "#1A1D2E",
          600: "#222640",
          glass: "rgba(26,29,46,0.7)",
          glassLight: "rgba(255,255,255,0.05)",
        },
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #F0D98A 50%, #C9A84C 100%)",
        "ink-gradient": "linear-gradient(135deg, #0D0F14 0%, #1A1D2E 100%)",
        "emerald-gradient": "linear-gradient(135deg, #059669 0%, #10B981 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(26,29,46,0.9) 0%, rgba(20,23,32,0.95) 100%)",
        "hero-gradient": "linear-gradient(to bottom, rgba(8,9,13,0.3) 0%, rgba(8,9,13,0.7) 60%, rgba(8,9,13,1) 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(201,168,76,0.3), 0 4px 24px rgba(0,0,0,0.4)",
        "gold-lg": "0 0 40px rgba(201,168,76,0.4), 0 8px 40px rgba(0,0,0,0.5)",
        emerald: "0 0 20px rgba(16,185,129,0.3), 0 4px 24px rgba(0,0,0,0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        card: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(201,168,76,0.1)",
        deep: "0 20px 60px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn: { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 10px rgba(201,168,76,0.2)" }, "50%": { boxShadow: "0 0 30px rgba(201,168,76,0.5)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
