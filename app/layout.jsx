import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource-variable/jost';
import './globals.css';
import ShopProvider from '@/components/ShopProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import CartDrawer from '@/components/CartDrawer';
export const metadata = { title: 'BellaMina · Damesmode webshop (concept)', description: 'Bijzondere damesmode vol stijl en vrouwelijkheid. Boetiek in Heerhugowaard.', robots: { index: false, follow: false } };
export const viewport = { themeColor: '#f7f1ec', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export default function RootLayout({ children }) {
  return (
    <html lang="nl"><body>
      <ShopProvider><Header /><main>{children}</main><Footer /><BottomNav /><CartDrawer /></ShopProvider>
    </body></html>
  );
}
