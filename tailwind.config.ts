import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        paper: '#FFFFFF',
        canvas: '#F5F5F4',
        line: '#E4E4E2',
        muted: '#5C5C5A',
        soft: '#8B8B88',
        // Lorvex: zwart-wit. 'accent' is het merkzwart, 'night' de donkere vlakken, 'haze' het zilveren licht.
        accent: { DEFAULT: '#0A0A0A', 600: '#262626', 50: '#F0F0EE', 100: '#E6E6E3' },
        night: { DEFAULT: '#0B0B0B', 900: '#050505' },
        haze: '#C9C9C6'
      },
      fontFamily: {
        sans: ['"Mona Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        script: ['"Pinyon Script"', 'cursive'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'Menlo', 'monospace']
      },
      maxWidth: { site: '1600px' },
      boxShadow: {
        card: '0 1px 2px rgba(10,12,18,.04), 0 18px 40px -24px rgba(10,12,18,.25)',
        glow: '0 30px 80px -34px rgba(10,10,10,.45)'
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        pulseRing: { '0%': { boxShadow: '0 0 0 0 rgba(10,10,10,.35)' }, '100%': { boxShadow: '0 0 0 12px rgba(10,10,10,0)' } }
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        pulseRing: 'pulseRing 2s ease-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
