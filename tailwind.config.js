/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "accent-1": "#F9F9F9",
        "accent-2": "#2B3A39",
        "accent-7": "#333",
        tradefoundry: "#f29602",
        success: "#0070f3",
        cyan: "#79FFE1",
      },
      spacing: { 28: "7rem" },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: 1.2,
      },
      fontFamily: {
        display: ["Koulen", "sans-serif"],
        title: ["Josefin Sans", "sans-serif"],
        body: ["Forum", "serif"],
      },
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      boxShadow: {
        small: "0 5px 10px rgba(0, 0, 0, 0.12)",
        medium: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
