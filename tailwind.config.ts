import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': {
            borderColor: 'rgb(220, 38, 38)',
            boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)'
          },
          '50%': {
            borderColor: 'rgb(239, 68, 68)',
            boxShadow: '0 0 20px 4px rgba(220, 38, 38, 0.4)'
          },
        },
      },
      animation: {
        'pulse-border': 'pulse-border 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
