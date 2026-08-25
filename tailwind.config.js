/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Obsidian & Midnight Slate Palette
        slate: {
          950: '#080B11', // main deep background
          900: '#0E131F', // card / elevated surface
          850: '#141C2E', // secondary interactive surface
          800: '#1E293B', // standard border
          750: '#28364D', // hover border
          700: '#334155', // subtle border highlight
          600: '#475569', // muted icon
          500: '#64748B', // placeholder text
          400: '#94A3B8', // muted secondary text
          300: '#CBD5E1', // light text
          200: '#E2E8F0', // near white text
          100: '#F1F5F9', // high contrast text
          50: '#F8FAFC',  // primary headline white
        },
        zinc: {
          950: '#080B11',
          900: '#0E131F',
          850: '#141C2E',
          800: '#1E293B',
          750: '#28364D',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
          400: '#94A3B8',
          300: '#CBD5E1',
          200: '#E2E8F0',
          100: '#F1F5F9',
          50: '#F8FAFC',
        },
        brand: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          indigo: '#4F46E5',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          subtle: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.3)',
        },
        status: {
          success: '#10B981',
          'success-bg': 'rgba(16, 185, 129, 0.12)',
          'success-border': 'rgba(16, 185, 129, 0.25)',
          warning: '#F59E0B',
          'warning-bg': 'rgba(245, 158, 11, 0.12)',
          'warning-border': 'rgba(245, 158, 11, 0.25)',
          danger: '#EF4444',
          'danger-bg': 'rgba(239, 68, 68, 0.12)',
          'danger-border': 'rgba(239, 68, 68, 0.25)',
          info: '#0EA5E9',
          'info-bg': 'rgba(14, 165, 233, 0.12)',
          'info-border': 'rgba(14, 165, 233, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'DEFAULT': '8px',
        'md': '10px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.4)',
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(59, 130, 246, 0.2)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'popover': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(ellipse at top, rgba(37, 99, 235, 0.12), transparent 70%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      }
    },
  },
  plugins: [],
}
