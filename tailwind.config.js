/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--color-primary)", // Using CSS var directly for dynamic updates
          foreground: "var(--color-bg-primary)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-text-primary)",
        },
        destructive: {
          DEFAULT: "var(--color-error)",
          foreground: "white",
        },
        muted: {
          DEFAULT: "var(--color-text-muted)",
          foreground: "var(--color-text-primary)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "white",
        },
        popover: {
          DEFAULT: "var(--color-bg-secondary)",
          foreground: "var(--color-text-primary)",
        },
        card: {
          DEFAULT: "var(--color-bg-secondary)",
          foreground: "var(--color-text-primary)",
        },
        // Industrial / Cyberpunk Palette
        industrial: {
          obsidian: "#050b14", // Deep background
          slate: "#1e293b",    // Surfaces
          neon: "#00f3ff",     // High impact cyan
          plasma: "#8b5cf6",   // Secondary neon
          warning: "#f59e0b",
          danger: "#ef4444",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'glow-cyan': '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
        'glow-plasma': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
        'metallic': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'scanline': 'scanline 2s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
