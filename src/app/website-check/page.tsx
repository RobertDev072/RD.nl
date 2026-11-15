import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import WebsiteCheck from '@/components/WebsiteCheck';

// The lead form is on by default now that /privacy exists. Emergency switch: LEAD_FORM_ENABLED=0.
const leadFormEnabled = process.env.LEAD_FORM_ENABLED !== '0';

export const metadata: Metadata = {
  title: 'Gratis website-check: hoe scoort jouw website?',
  description: 'Check gratis in 10 seconden of je website snel, veilig en mobielvriendelijk is en of klanten je makkelijk kunnen bereiken. Met concrete verbeterpunten.',
  alternates: { canonical: '/website-check' }
};

export default function WebsiteCheckPage() {
  return (
    <>
      <PageHero eyebrow="Gratis website-check" title="Hoeveel klanten mist jouw *website*?" intro="Vul je webadres in en zie direct hoe je website scoort op snelheid, mobiel, vindbaarheid en bereikbaarheid. Met uitleg in gewone taal." />
      <section className="wrap max-w-[860px] pb-[clamp(96px,12vw,170px)]">
        <WebsiteCheck leadFormEnabled={leadFormEnabled} />
      </section>
    </>
  );
}
