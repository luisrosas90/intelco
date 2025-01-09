/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,svelte,ts}',  // Eliminamos 'js' para evitar conflictos
    './src/lib/**/*.{html,svelte,ts}',
    './src/routes/**/*.{html,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2b88e8',
        secondary: '#f99800',
        'primary-dark': '#1a64b7',
        'secondary-dark': '#c67600',
      }
    },
  },
  plugins: [],
}
