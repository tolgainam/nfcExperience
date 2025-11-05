/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Campaign-based theme colors (CSS variables)
        campaign: {
          primary: 'var(--campaign-primary)',
          secondary: 'var(--campaign-secondary)',
          accent: 'var(--campaign-accent)',
        },
        brand: {
          text: 'var(--brand-text)',
          background: 'var(--brand-background)',
        }
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
    },
  },
  plugins: [],
}
