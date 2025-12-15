/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  presets: [require('@ssr-comparison/ui/tailwind')],
  content: [
    './src/**/*.{html,ts}',
  ],
  plugins: [],
};

