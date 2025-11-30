/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0A0A0A",
        charcoal: "#13151A",
        neon: {
          DEFAULT: "#3BC9FF",
          glow: "rgba(59, 201, 255, 0.5)",
          dim: "#2A8FB5",
        },
        teal: {
          light: "#4ccae2",
          dark: "#399fb1",
        },
        glass: {
          border: "rgba(255, 255, 255, 0.1)",
          surface: "rgba(255, 255, 255, 0.03)",
        },
      },
      fontFamily: {
        space: ["'Space Grotesk'", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px -5px rgba(59, 201, 255, 0.6)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gradient-dark": "linear-gradient(135deg, #0A0A0A 0%, #13151A 100%)",
      },
      animation: {
        'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
        'star-movement-top': 'star-movement-top linear infinite alternate',
      },
      keyframes: {
        'star-movement-bottom': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
        },
        'star-movement-top': {
          '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
          '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
