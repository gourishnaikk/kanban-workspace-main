/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F5F2EA',
        surface: '#FFFFFF',
        muted: '#EAE6DC',
        brand: '#171717',
        accent: '#FFD84D',
        'accent-mint': '#A8E6CF',
        'accent-coral': '#FF9B85',
        'accent-periwinkle': '#B8C5FF',
        success: '#B8F28B',
        danger: '#FF7777',
        'text-primary': '#171717',
        'text-secondary': '#555555',
        sidebar: '#171717',
        // Keep sticky note colors for task cards (key part of existing data model)
        sticky: {
          sage: '#A8E6CF',
          butter: '#FFD84D',
          peach: '#FF9B85',
          lavender: '#B8C5FF',
          powderBlue: '#93C5FD',
        },
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'DEFAULT': '0px',
        'sm': '2px',
        'md': '4px',
        'lg': '6px',
        'xl': '6px',
        '2xl': '6px',
        '3xl': '6px',
        'full': '9999px',
      },
      boxShadow: {
        'hard': '4px 4px 0 #171717',
        'hard-sm': '2px 2px 0 #171717',
        'hard-lg': '6px 6px 0 #171717',
        'hard-xl': '8px 8px 0 #171717',
        'hard-yellow': '4px 4px 0 #FFD84D',
        'none': 'none',
      },
      spacing: {
        '4.5': '1.125rem',
      },
    },
  },
  plugins: [],
}
