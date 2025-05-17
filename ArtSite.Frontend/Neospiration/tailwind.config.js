
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        art: {
          'bg-dark': '#25022A',
          'bg-darker': '#320425',
          'primary': '#6c2769',
          'primary-hover': '#7c3279',
          'border': '#6c2769',
          'text-primary': 'rgba(255, 255, 255, 0.87)',
          'text-secondary': '#CCCCCC',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to bottom right, var(--color-art-bg-dark), var(--color-art-bg-darker))'
      }
    },
  },
  plugins: [],
}
