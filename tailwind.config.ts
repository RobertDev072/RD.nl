import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0C12',
        paper: '#FFFFFF',
        canvas: '#F4F6FA',
        line: '#E3E7EE',
        muted: '#5B6271',
        soft: '#8A92A2',
        blue: { DEFAULT: '#1F5CFF', 600: '#1747D6', 50: '#EEF3FF', 100: '#DCE6FF' },
        navy: { DEFAULT: '#0B1630', 900: '#070E20' }
      },
      fontFamily: {
        sans: ['"Mona Sans Variable"', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        script: ['"Pinyon Script"', 'cursive'],
        mono: ['"Geist Mono Variable"', 'ui-monospace', 'Menlo', 'monospace']
      },
      maxWidth: { site: '1600px' },
      boxShadow: {
        card: '0 1px 2px rgba(10,12,18,.04), 0 18px 40px -24px rgba(10,12,18,.25)',
        glow: '0 30px 80px -30px rgba(31,92,255,.55)'
      },
      keyframes: {
        marquee: { to: { transform: 'translateX(-50%)' } },
        pulseRing: { '0%': { boxShadow: '0 0 0 0 rgba(31,92,255,.45)' }, '100%': { boxShadow: '0 0 0 12px rgba(31,92,255,0)' } }
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        pulseRing: 'pulseRing 2s ease-out infinite'
      }
    }
  },
  plugins: []
} satisfies Config;
