/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0b0f1a',
          800: '#111827',
          700: '#1a2235',
          600: '#1f2d42',
        },
        accent: {
          DEFAULT: '#3b82f6',
          glow: '#60a5fa',
        },
        positive: '#10b981',
        negative: '#ef4444',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
