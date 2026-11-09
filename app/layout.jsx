import './globals.css';
import ShopProvider from '@/components/ShopProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Hewitt & Hewitt – Surinaams eten bestellen',
  description: 'Bestel authentiek Surinaams eten bij Hewitt & Hewitt: roti, bami, nasi, moksi alesi, bara, broodjes en meer. Bezorging vrijdag t/m zondag 11:00–22:00.',
  robots: { index: false, follow: false },
  icons: { icon: '/logo.webp' }
};
export const viewport = { themeColor: '#225c2f', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://primary.jwwb.nl" />
        <link href="https://fonts.googleapis.com/css2?family=Bitter:wght@600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet" />
      </head>
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
