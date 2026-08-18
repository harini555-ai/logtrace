/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#05070d',
          900: '#0a0e17',
          850: '#0f1420',
          800: '#141a29',
          700: '#1c2436',
          600: '#2a3448',
          500: '#3d4a63',
        },
        brand: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        level: {
          error: '#ef4444',
          warn: '#eab308',
          info: '#3b82f6',
          debug: '#9ca3af',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(59,130,246,0.15), 0 0 20px rgba(59,130,246,0.08)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
