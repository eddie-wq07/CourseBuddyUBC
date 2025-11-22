import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        montserrat: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glow: "hsl(var(--secondary-glow))",
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
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        neon: {
          blue: "hsl(var(--neon-blue))",
          cyan: "hsl(var(--neon-cyan))",
        },
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, hsl(var(--gradient-start)), hsl(var(--gradient-end)))',
        'gradient-radial': 'radial-gradient(circle, hsl(var(--gradient-start)), hsl(var(--gradient-end)))',
      },
      boxShadow: {
        'neon': '0 0 20px hsl(var(--neon-blue) / 0.5), 0 0 40px hsl(var(--neon-blue) / 0.3)',
        'neon-sm': '0 0 10px hsl(var(--neon-blue) / 0.4), 0 0 20px hsl(var(--neon-blue) / 0.2)',
        'neon-cyan': '0 0 20px hsl(var(--neon-cyan) / 0.5), 0 0 40px hsl(var(--neon-cyan) / 0.3)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px hsl(var(--neon-blue) / 0.5)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 30px hsl(var(--neon-blue) / 0.7)",
          },
        },
        "pulse-neon": {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        "aurora-1": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.3",
          },
          "33%": {
            transform: "translate(100px, -50px) scale(1.1)",
            opacity: "0.4",
          },
          "66%": {
            transform: "translate(-50px, 80px) scale(0.9)",
            opacity: "0.35",
          },
        },
        "aurora-2": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.3",
          },
          "33%": {
            transform: "translate(-80px, 60px) scale(1.15)",
            opacity: "0.4",
          },
          "66%": {
            transform: "translate(70px, -40px) scale(0.95)",
            opacity: "0.35",
          },
        },
        "aurora-3": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.25",
          },
          "50%": {
            transform: "translate(-60px, -70px) scale(1.2)",
            opacity: "0.35",
          },
        },
        "aurora-4": {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
            opacity: "0.25",
          },
          "50%": {
            transform: "translate(90px, 50px) scale(1.1)",
            opacity: "0.35",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow": "glow 2s ease-in-out infinite",
        "pulse-neon": "pulse-neon 3s ease-in-out infinite",
        "aurora-1": "aurora-1 20s ease-in-out infinite",
        "aurora-2": "aurora-2 25s ease-in-out infinite",
        "aurora-3": "aurora-3 18s ease-in-out infinite",
        "aurora-4": "aurora-4 22s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
