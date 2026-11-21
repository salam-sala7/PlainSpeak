/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'plain-ink': '#17343b',
        'plain-teal': '#125d54',
        'plain-paper': '#f3f7f5',
        'plain-border': '#cddbd5',
      },
    },
  },
}
