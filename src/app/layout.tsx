import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/mona-sans/wdth.css';
import '@fontsource-variable/geist-mono/index.css';
import '@fontsource/pinyon-script/index.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Website laten maken Alkmaar | Webdesign Alkmaar | R DEV', template: '%s | R DEV' },
  description: 'R DEV bouwt websites, web apps, SaaS en apps in Alkmaar. Strak, snel en goed vindbaar in Google, met slimme automatisering. Werk vanaf €100, geen contracten.',
  keywords: ['website laten maken alkmaar', 'webdesign alkmaar', 'websites maken alkmaar', 'web app laten maken', 'saas ontwikkeling', 'ai automatisering', 'seo alkmaar'],
  authors: [{ name: site.owner }],
  openGraph: { type: 'website', locale: 'nl_NL', siteName: 'R DEV', images: [{ url: '/img/sg-desktop.webp', width: 800, height: 500 }] },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = { themeColor: '#F4F6FA', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'R DEV',
  url: site.url,
  image: `${site.url}/img/logo.png`,
  telephone: '+31628669488',
  priceRange: 'Vanaf €100',
  founder: { '@type': 'Person', name: site.owner, jobTitle: 'Developer' },
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'NL' },
  areaServed: site.areas,
  knowsAbout: ['Webdesign', 'Websites laten maken', 'Web apps', 'SaaS', 'Apps', 'AI-automatisering', 'SEO']
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">Naar inhoud</a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
