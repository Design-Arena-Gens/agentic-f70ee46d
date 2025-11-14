import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: {
          900: "#030712",
          800: "#0f172a",
          700: "#1e293b",
        },
        neon: {
          pink: "#ff6ec7",
          purple: "#8a68ff",
          teal: "#00f5d4",
        },
      },
      boxShadow: {
        glass: "0 10px 40px -10px rgba(15, 23, 42, 0.6)",
      },
      backdropBlur: {
        xs: "2px",
      },
      fontFamily: {
        display: ["var(--font-geist-sans)", "sans-serif"],
      },
      animation: {
        pulseGlow: "pulseGlow 6s ease-in-out infinite",
        float: "float 12s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 0.9 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
