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
      },
      fontFamily: {
        space: ["'Space Grotesk'", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
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
        'fade-in': 'fade-in 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'fade-in-up': 'fade-in-up 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'shimmer': 'shimmer 5s ease-in-out infinite',
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
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '50%, 100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
