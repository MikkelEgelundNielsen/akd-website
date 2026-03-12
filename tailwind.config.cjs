/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'forest-green': '#004928',    // Primary, navigation, headers
        'mint': {
          DEFAULT: '#10E397',          // Bright mint – use on dark backgrounds only
          'dark': '#0A8F5F',           // Accessible mint – WCAG AA on light backgrounds
        },
        'burnt-orange': '#E87722',    // PRIMARY CTA COLOR ⭐
        'amber': '#F5A623',           // Secondary CTA / highlights
        
        // Neutrals
        'charcoal': '#26251E',        // Body text
        'warm-light': '#F2F1EC',      // Page backgrounds
        'light': '#F7F7F4',           // Card backgrounds
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        serif: ['Lora', 'serif'],
      },
    },
  },
  plugins: [],
};


