export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    'bg-primary',
    'text-title',
    'bg-sidebar',
    'text-hoverText'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        sidebar: 'var(--sidebar-color)',
        title: 'var(--title-color)',
        hoverText: 'var(--hover-text-color)',
      },
    },
  },
  plugins: [],
}