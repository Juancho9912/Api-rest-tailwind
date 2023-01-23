const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  // purge: ["./public/**/*.html", "./src/**/*.{js,jsx,ts,tsx,vue}"],
  purge: [
    './index.html',
    './resources/**/*.{html,js}'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        // se agregan estos de https://tailwindcss.com/docs/customizing-colors#color-palette-reference
        teal: colors.teal,
        'sky': colors.sky,
        'orange': colors.orange,
        'rose': colors.rose
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}