import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'selector', // Updated for Tailwind CSS v4
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
