import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forest: "var(--forest)",
        jungle: "var(--jungle)",
        gold: "var(--gold)",
        cream: "var(--cream)",
        ink: "var(--ink)",
        "l-bg": "rgb(var(--l-bg) / <alpha-value>)",
        "l-surface": "rgb(var(--l-surface) / <alpha-value>)",
        "l-muted": "rgb(var(--l-muted) / <alpha-value>)",
        "l-fg": "rgb(var(--l-fg) / <alpha-value>)",
        "l-accent": "rgb(var(--l-accent) / <alpha-value>)",
        "l-success": "rgb(var(--l-success) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
