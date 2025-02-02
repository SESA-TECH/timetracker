import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',    // Vibrant blue
        secondary: '#6366F1',  // Indigo
        success: '#10B981',    // Rich green
        error: '#EF4444',      // Bright red
        warning: '#F59E0B',    // Warm amber
        background: '#F3F4F6',
        surface: '#FFFFFF',
        text: '#111827',
        'text-secondary': '#374151',
        'text-tertiary': '#4B5563',
        'text-on-primary': '#FFFFFF',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};

export default config;
