/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FACC15",   // Bright Yellow (Highlight)
        dark: "#000000",      // Pure Black (Background)
        card: "#111827",      // Dark Gray (Cards ke liye)
        textMain: "#FFFFFF",  // White Text
        textGray: "#9CA3AF"   // Gray Text (Descriptions)
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}