import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom gaming palette
        game: {
          dark: "#060914",      // Deep void night background
          card: "#0d1224",      // Card base background
          cardHover: "#141b34", // Expanded hovered card background
          border: "#1f294d",    // Slate/blue high contrast borders
          accent: "#d97706",    // Currency gold amber
          accentLight: "#f59e0b",
          highlight: "#3b82f6", // Cyan glow
        },
        // Rarity color codes
        rarity: {
          common: "#9d9d9d",
          uncommon: "#1eff00",
          rare: "#0070dd",
          epic: "#a335ee",
          legendary: "#ff8000",
          mythic: "#ff4747",
        }
      },
      boxShadow: {
        'glow-common': '0 0 10px rgba(157, 157, 157, 0.15)',
        'glow-uncommon': '0 0 10px rgba(30, 255, 0, 0.2)',
        'glow-rare': '0 0 12px rgba(0, 112, 221, 0.25)',
        'glow-epic': '0 0 15px rgba(163, 53, 238, 0.3)',
        'glow-legendary': '0 0 20px rgba(255, 128, 0, 0.4)',
        'glow-mythic': '0 0 25px rgba(255, 71, 71, 0.5)',
        'glow-gold': '0 0 15px rgba(245, 158, 11, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.2s ease-out',
        'spin-slow': 'spin 4s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.7', transform: 'scale(1.02)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
