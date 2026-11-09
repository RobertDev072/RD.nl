import '@fontsource-variable/dm-sans';
import '@fontsource/bitter/700.css';
import './globals.css';
import ShopProvider from '@/components/ShopProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Hewitt & Hewitt – Surinaams eten bestellen',
  description: 'Bestel authentiek Surinaams eten bij Hewitt & Hewitt: roti, bami, nasi, moksi alesi, bara, broodjes en meer. Bezorging vrijdag t/m zondag 11:00–22:00.',
  robots: { index: false, follow: false },
  icons: { icon: '/icon-192.png', apple: '/icon-180.png' },
  appleWebApp: { capable: true, title: 'Hewitt & Hewitt', statusBarStyle: 'default' },
  formatDetection: { telephone: false }
};
export const viewport = { themeColor: '#225c2f', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head><link rel="preconnect" href="https://primary.jwwb.nl" /></head>
      <body>
        <ShopProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </ShopProvider>
      </body>
    </html>
  );
}
