/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4F8EF7',
        secondary: '#34C759',
        accent: '#FFB547',
        bg: '#F8FAFC',
        card: '#FFFFFF',
        border: '#E6EEF5',
        text: '#1F2937',
        subtext: '#6B7280',
        error: '#EF4444',
        success: '#22C55E',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(31, 41, 55, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
