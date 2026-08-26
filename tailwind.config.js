/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sophisticated Mineral Beige & Industrial Charcoal Gray / Slate Palette (Zero Purple)
        slate: {
          950: '#0B0D12', // deep graphite background
          900: '#131720', // elevated card surface
          850: '#1A202C', // interactive surface
          800: '#262F3D', // clean border
          750: '#323E50', // active/hover border
          700: '#425167', // muted element
          600: '#5E6F87', // subtle icon
          500: '#7E90A8', // placeholder / secondary
          400: '#9FB0C7', // clean light-gray text
          300: '#CBD7E6', // high-readability text
          200: '#E4ECF5', // light text
          100: '#F0F5FA', // off-white
          50: '#F8FAFC',  // primary headline white
        },
        zinc: {
          950: '#0B0D12',
          900: '#131720',
          850: '#1A202C',
          800: '#262F3D',
          750: '#323E50',
          700: '#425167',
          600: '#5E6F87',
          500: '#7E90A8',
          400: '#9FB0C7',
          300: '#CBD7E6',
          200: '#E4ECF5',
          100: '#F0F5FA',
          50: '#F8FAFC',
        },
        // Mineral Beige & Sand Warm Accents
        sand: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E8DFD1',
          300: '#D9CBBA',
          400: '#C7B59F',
          500: '#B59E83',
          600: '#967F66',
          700: '#75624E',
          800: '#544638',
          900: '#362D24',
          950: '#1E1813',
        },
        brand: {
          blue: '#3B82F6',
          cyan: '#0EA5E9',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#EF4444',
          sand: '#D4C5B0',
        },
        accent: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          subtle: 'rgba(59, 130, 246, 0.12)',
          border: 'rgba(59, 130, 246, 0.3)',
          sand: '#D4C5B0',
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
        'card-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(181, 158, 131, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'glow-sand': '0 0 25px -5px rgba(212, 197, 176, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'popover': '0 20px 40px -15px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      },
    },
  },
  plugins: [],
}
