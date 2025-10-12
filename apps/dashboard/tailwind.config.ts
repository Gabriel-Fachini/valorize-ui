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
        secondary: {
          DEFAULT: '#D9004F',
          50: '#FFE5EF',
          100: '#FFCCE0',
          200: '#FF99C1',
          300: '#FF66A2',
          400: '#FF3383',
          500: '#D9004F',
          600: '#AD003F',
          700: '#82002F',
          800: '#56001F',
          900: '#2B0010',
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
