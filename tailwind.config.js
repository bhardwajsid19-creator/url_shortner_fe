/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:   'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent:    'var(--color-accent)',
        'theme-bg':   'var(--color-bg)',
        'theme-text': 'var(--color-text)',
        success:   'var(--color-success)',
        warning:   'var(--color-warning)',
        error:     'var(--color-error)',
        border:    'var(--color-border)',
        muted:     'var(--color-muted)',
      },
    },
  },
  plugins: [],
}
