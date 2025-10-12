import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        primary: {
          DEFAULT: '#00D959',
          50: '#E5FFF0',
          100: '#CCFFE1',
          200: '#99FFC3',
          300: '#66FFA5',
          400: '#33FF87',
          500: '#00D959',
          600: '#00AD47',
          700: '#008235',
          800: '#005623',
          900: '#002B12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
