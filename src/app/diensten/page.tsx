import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import ServicesGrid from '@/components/home/ServicesGrid';
import CtaBand from '@/components/CtaBand';

export const metadata: Metadata = {
  title: 'Diensten: websites, web apps, SaaS, apps en automatisering',
  description: 'Alle diensten van Lorvex uit Alkmaar: website laten maken, web apps, SaaS, apps, AI-automatisering, SEO en domein, mail en hosting.',
  alternates: { canonical: '/diensten' }
};

export default function Diensten() {
  return (
    <>
      <PageHero eyebrow="Diensten" title="Van domein tot *platform*, alles geregeld." intro="Websites, web apps, SaaS en apps, met de techniek en vindbaarheid erachter. Eén aanspreekpunt, geen contracten, werk vanaf €100." />
      <div className="-mt-16"><ServicesGrid heading={false} /></div>
      <CtaBand />
    </>
  );
}
