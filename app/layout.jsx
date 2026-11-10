import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource-variable/jost';
import './globals.css';
import ShopProvider from '@/components/ShopProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import { SITE } from '@/lib/data';

export const metadata = {
  title: { default: 'House of Nails by Jasmina · Natural Nail Treatment salon Heerhugowaard (concept)', template: '%s · House of Nails (concept)' },
  description: 'Ontwerpvoorstel van Lorvex voor House of Nails by Jasmina: online boeken, prijzen 2026, BIAB en cadeaubonnen.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: SITE.logo, apple: SITE.logo },
  appleWebApp: { capable: true, title: 'House of Nails', statusBarStyle: 'black-translucent' },
  formatDetection: { telephone: false }
};
export const viewport = { themeColor: '#0e0c0b', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head><link rel="preconnect" href="https://primary.jwwb.nl" /></head>
      <body>
        <ShopProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <BottomNav />
        </ShopProvider>
      </body>
    </html>
  );
}
