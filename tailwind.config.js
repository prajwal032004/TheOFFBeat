/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07080c',
          900: '#0c0e15',
          850: '#111420',
          800: '#161a29',
          700: '#22283c',
        },
        brand: {
          red: '#ff2a3f',
          redHover: '#e01e33',
          redDark: '#8b0010',
          redGlow: 'rgba(255, 42, 63, 0.4)',
        }
      },
      fontFamily: {
        heading: ['Outfit', 'Syne', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(255, 42, 63, 0.4)',
        'glow-red-lg': '0 0 50px -10px rgba(255, 42, 63, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #ff2a3f 0%, #a80015 100%)',
        'card-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'hero-overlay': 'linear-gradient(180deg, rgba(7, 8, 12, 0.4) 0%, rgba(7, 8, 12, 0.85) 75%, #07080c 100%)',
      }
    },
  },
  plugins: [],
}
