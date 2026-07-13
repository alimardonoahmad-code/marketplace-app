/** @type {import('tailwindcss').Config} */

module.exports = {

  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],

  darkMode: 'class',

  theme: {

    extend: {

      colors: {

        /* Ozon Digital Blue */

        primary: {

          DEFAULT: '#005BFF',

          50: '#EEF3FF',

          100: '#D6E4FF',

          200: '#A8C7FF',

          300: '#7AABFF',

          400: '#4D8FFF',

          500: '#005BFF',

          600: '#0050E0',

          700: '#0047CC',

        },

        secondary: {

          DEFAULT: '#0047CC',

          50: '#EEF3FF',

          100: '#D6E4FF',

          500: '#0050E0',

          600: '#0047CC',

        },

        /* Ozon Magenta — тахфифҳо, аксент */

        accent: {

          DEFAULT: '#F91155',

          50: '#FFF0F5',

          100: '#FFE0EA',

          500: '#F91155',

          600: '#E0104C',

        },

        success: { DEFAULT: '#22C55E', 50: '#F0FDF4', 100: '#DCFCE7', 600: '#16A34A' },

        warning: { DEFAULT: '#F59E0B', 50: '#FFFBEB', 100: '#FEF3C7' },

        danger: { DEFAULT: '#F91155', 50: '#FFF0F5', 100: '#FFE0EA', 600: '#E0104C' },

        surface: {

          DEFAULT: '#FFFFFF',

          secondary: '#F5F7FA',

          dark: '#0F172A',

          'dark-secondary': '#1E293B',

        },

        text: {

          DEFAULT: '#001A34',

          secondary: '#6B7280',

          muted: '#9CA3AF',

        },

        border: { DEFAULT: '#E5E7EB', dark: '#334155' },

        brand: {

          50: '#EEF3FF', 100: '#D6E4FF', 200: '#A8C7FF', 300: '#7AABFF',

          400: '#4D8FFF', 500: '#005BFF', 600: '#0050E0', 700: '#0047CC',

        },

      },

      fontFamily: {

        sans: [

          'Inter', 'Manrope', 'system-ui', '-apple-system',

          'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif',

        ],

      },

      fontSize: {

        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],

      },

      borderRadius: {

        card: '18px',

        btn: '12px',

        input: '12px',

      },

      boxShadow: {

        soft: '0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)',

        card: '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',

        float: '0 8px 32px rgba(0,91,255,0.15)',

        glow: '0 0 24px rgba(0,91,255,0.25)',

        'dark-card': '0 2px 8px rgba(0,0,0,0.3)',

      },

      height: {

        btn: '48px',

      },

      animation: {

        'fade-up': 'fadeUp 0.4s ease-out forwards',

        'fade-in': 'fadeIn 0.3s ease-out forwards',

        'slide-up': 'slideUp 0.35s ease-out forwards',

        'scale-in': 'scaleIn 0.3s ease-out forwards',

        shimmer: 'shimmer 1.8s linear infinite',

        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',

        'hero-ken-burns': 'heroKenBurns 8s ease-out forwards',

        'hero-title-in': 'heroTitleIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',

        'hero-sub-in': 'heroSubIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.12s forwards',

        'hero-cta-in': 'heroCtaIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.28s forwards',

        'hero-badge-in': 'heroFadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',

        'hero-shine': 'heroShine 3s ease-in-out infinite',

        'hero-progress': 'heroProgress 8s linear forwards',

      },

      keyframes: {

        fadeUp: {

          '0%': { opacity: '0', transform: 'translateY(12px)' },

          '100%': { opacity: '1', transform: 'translateY(0)' },

        },

        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },

        slideUp: {

          '0%': { opacity: '0', transform: 'translateY(16px)' },

          '100%': { opacity: '1', transform: 'translateY(0)' },

        },

        scaleIn: {

          '0%': { opacity: '0', transform: 'scale(0.96)' },

          '100%': { opacity: '1', transform: 'scale(1)' },

        },

        shimmer: {

          '0%': { backgroundPosition: '-200% 0' },

          '100%': { backgroundPosition: '200% 0' },

        },

        pulseSoft: {

          '0%, 100%': { opacity: '1' },

          '50%': { opacity: '0.88' },

        },

        heroKenBurns: {

          '0%': { transform: 'scale(1) translate(0, 0)' },

          '100%': { transform: 'scale(1.1) translate(-1.5%, -1%)' },

        },

        heroTitleIn: {

          '0%': { opacity: '0', transform: 'translateX(-28px)' },

          '100%': { opacity: '1', transform: 'translateX(0)' },

        },

        heroSubIn: {

          '0%': { opacity: '0', transform: 'translateX(-20px)' },

          '100%': { opacity: '1', transform: 'translateX(0)' },

        },

        heroCtaIn: {

          '0%': { opacity: '0', transform: 'translateY(10px)' },

          '100%': { opacity: '1', transform: 'translateY(0)' },

        },

        heroFadeUp: {

          '0%': { opacity: '0', transform: 'translateY(8px)' },

          '100%': { opacity: '1', transform: 'translateY(0)' },

        },

        heroShine: {

          '0%, 100%': { transform: 'translateX(-120%) skewX(-12deg)', opacity: '0' },

          '45%': { opacity: '0.35' },

          '55%': { opacity: '0.2' },

          '100%': { transform: 'translateX(220%) skewX(-12deg)', opacity: '0' },

        },

        heroProgress: {

          '0%': { transform: 'scaleX(0)' },

          '100%': { transform: 'scaleX(1)' },

        },

      },

      backgroundImage: {

        'gradient-primary': 'linear-gradient(135deg, #005BFF 0%, #0047CC 100%)',

        'gradient-price': 'linear-gradient(135deg, #F91155 0%, #E0104C 100%)',

        'gradient-hero': 'linear-gradient(135deg, #005BFF 0%, #0047CC 100%)',

        'gradient-brand': 'linear-gradient(135deg, #005BFF 0%, #0047CC 100%)',

        'gradient-gold': 'linear-gradient(135deg, #F91155 0%, #E0104C 100%)',

        'gradient-nav': 'linear-gradient(135deg, #005BFF 0%, #0047CC 100%)',

        'gradient-dark': 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',

      },

    },

  },

  plugins: [],

};

