import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lorvex | AI Tech Company',
    short_name: 'Lorvex',
    description: 'Websites, web apps, SaaS, apps en AI-automatisering uit Alkmaar.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5F4',
    theme_color: '#0A0A0A',
    lang: 'nl',
    icons: [
      { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/lorvex-logo-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ]
  };
}
