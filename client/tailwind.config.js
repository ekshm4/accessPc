/** @type {import('tailwindcss').Config} */
export default {
  content: ['./client/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#e4e4e7',
        card: {
          DEFAULT: '#18181b',
          foreground: '#e4e4e7',
        },
        border: '#27272a',
        muted: {
          DEFAULT: '#27272a',
          foreground: '#71717a',
        },
        accent: {
          DEFAULT: '#3b82f6',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [],
};
