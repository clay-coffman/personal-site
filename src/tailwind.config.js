/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
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
        display: ["koulen"],
        title: ['"josefin sans"'],
        body: ["forum"],
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
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.text-title': {
          '@apply font-body text-xl lg:text-2xl font-semibold text-gray-800': {}
        },
        '.text-body': {
          '@apply font-body text-sm lg:text-lg text-gray-800': {}
        },
        '.text-meta': {
          '@apply text-sm lg:text-xl text-gray-500 italic': {}
        }
      })
    }
  ],
};
