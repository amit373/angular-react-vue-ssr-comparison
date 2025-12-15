/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  presets: [require('../../packages/ui/tailwind/preset.js')],
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  plugins: [],
};

