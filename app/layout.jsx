import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource-variable/jost';
import './globals.css';
import ShopProvider from '@/components/ShopProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { getNav } from '@/lib/catalog';
import { SITE } from '@/lib/format';

export const metadata = {
  title: { default: 'Professionele haarproducten & Artistique | JeHaarwinkel (concept)', template: '%s · JeHaarwinkel (concept)' },
  description: 'Ontwerpvoorstel van Lorvex voor JeHaarwinkel: professionele haarverzorging, styling en kleurproducten met advies vanuit de kapsalon.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: [{ url: SITE.icon32, sizes: '32x32' }, { url: SITE.icon192, sizes: '192x192' }], apple: SITE.icon180 },
  appleWebApp: { capable: true, title: 'JeHaarwinkel', statusBarStyle: 'default' },
  formatDetection: { telephone: false }
};
export const viewport = { themeColor: '#fbf7f3', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default async function RootLayout({ children }) {
  const { index, ...nav } = await getNav();
  return (
    <html lang="nl">
      <head><link rel="preconnect" href="https://www.jehaarwinkel.nl" /></head>
      <body>
        <ShopProvider index={index}>
          <Header nav={nav} />
          <main>{children}</main>
          <Footer nav={nav} />
          <BottomNav />
        </ShopProvider>
      </body>
    </html>
  );
}
