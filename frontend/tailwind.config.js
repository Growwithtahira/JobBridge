/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6A0DAD",   // Cyber Violet (Gen Z Premium)
        secondary: "#F3E8FF", // Light Lavender (Backgrounds)
        dark: "#ffffff",      // Main Background (White)
        card: "#ffffff",      // Card Background (White)
        textMain: "#1e1b4b",  // Deep Indigo/Black (Premium Text)
        textGray: "#64748b"   // Cool Gray
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      animation: {
        blob: "blob 7s infinite",
        shimmer: "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        }
      },
    },
  },
  plugins: [],
}