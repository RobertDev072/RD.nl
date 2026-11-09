export default function manifest() {
  return {
    name: 'Hewitt & Hewitt – Authentic Surinamese Food',
    short_name: 'Hewitt & Hewitt',
    description: 'Bestel authentiek Surinaams eten bij Hewitt & Hewitt.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf8f2',
    theme_color: '#225c2f',
    lang: 'nl',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
    ]
  };
}
