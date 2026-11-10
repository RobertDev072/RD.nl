import { SITE } from '@/lib/format';

export default function manifest() {
  return {
    name: 'JeHaarwinkel (concept)',
    short_name: 'JeHaarwinkel',
    start_url: '/',
    display: 'standalone',
    background_color: '#fbf7f3',
    theme_color: '#fbf7f3',
    icons: [{ src: SITE.icon192, sizes: '192x192', type: 'image/png' }, { src: SITE.icon180, sizes: '180x180', type: 'image/png' }]
  };
}
