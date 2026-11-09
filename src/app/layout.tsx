import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/mona-sans/wdth.css';
import '@fontsource-variable/geist-mono/index.css';
import '@fontsource/pinyon-script/index.css';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import { site } from '@/lib/site';
import { services } from '@/lib/content';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Lorvex | Website laten maken in Alkmaar · Webdesign en AI', template: '%s | Lorvex' },
  description: site.description,
  applicationName: 'Lorvex',
  keywords: ['Lorvex', 'website laten maken alkmaar', 'webdesign alkmaar', 'websites maken alkmaar', 'website maker alkmaar', 'webdesigner alkmaar', 'ai automatisering', 'ai development', 'ai oplossingen mkb', 'web app laten maken', 'saas ontwikkeling', 'seo alkmaar'],
  authors: [{ name: site.owner, url: `${site.url}/over` }],
  creator: 'Lorvex',
  publisher: 'Lorvex',
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: site.url,
    siteName: 'Lorvex',
    title: 'Lorvex | Website laten maken in Alkmaar · Webdesign en AI',
    description: site.description,
    images: [{ url: '/brand/og-lorvex.png', width: 1200, height: 630, alt: 'Lorvex, AI Tech Company uit Alkmaar' }]
  },
  twitter: { card: 'summary_large_image', images: ['/brand/og-lorvex.png'] },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  formatDetection: { telephone: true },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } } : {})
};

export const viewport: Viewport = { themeColor: '#F5F5F4', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

const ORG = `${site.url}/#organization`;
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG,
      name: 'Lorvex',
      alternateName: ['Lorvex AI Tech Company', 'Lorvex Alkmaar'],
      slogan: site.slogan,
      url: site.url,
      logo: { '@type': 'ImageObject', url: `${site.url}/brand/lorvex-logo-512.png`, width: 512, height: 512 },
      image: `${site.url}/brand/og-lorvex.png`,
      description: site.description,
      email: undefined,
      telephone: '+31628669488',
      founder: { '@type': 'Person', name: site.owner, jobTitle: 'Oprichter en developer', url: `${site.url}/over` },
      address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'NL' },
      contactPoint: { '@type': 'ContactPoint', telephone: '+31628669488', contactType: 'customer service', availableLanguage: ['Dutch', 'English'], areaServed: 'NL' },
      knowsAbout: ['Webdesign', 'Website laten maken', 'Web apps', 'SaaS', 'Apps', 'AI-automatisering', 'AI-development', 'AI-agents', 'SEO', 'Systeembeheer']
    },
    {
      '@type': ['ProfessionalService', 'LocalBusiness'],
      '@id': `${site.url}/#localbusiness`,
      name: 'Lorvex',
      parentOrganization: { '@id': ORG },
      url: site.url,
      image: `${site.url}/brand/og-lorvex.png`,
      logo: `${site.url}/brand/lorvex-logo-512.png`,
      telephone: '+31628669488',
      priceRange: 'Vanaf €100',
      address: { '@type': 'PostalAddress', addressLocality: site.city, addressRegion: site.region, addressCountry: 'NL' },
      geo: { '@type': 'GeoCoordinates', latitude: site.geo.lat, longitude: site.geo.lng },
      areaServed: site.areas.map((a) => ({ '@type': 'City', name: a })),
      openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' }],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Diensten van Lorvex',
        itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: s.menu, url: `${site.url}/diensten/${s.slug}` } }))
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}/#website`,
      url: site.url,
      name: 'Lorvex',
      alternateName: 'Lorvex AI Tech Company',
      inLanguage: 'nl-NL',
      publisher: { '@id': ORG }
    }
  ]
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
