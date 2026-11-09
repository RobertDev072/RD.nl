import type { Metadata } from 'next';
import { MapPin, MessageCircle, Phone } from 'lucide-react';
import PageHero from '@/components/PageHero';
import ContactForm from '@/components/ContactForm';
import { Reveal } from '@/components/Reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact: bel of app Lorvex in Alkmaar',
  description: `Directe lijn met Robert van Lorvex. Bel of app ${site.phone}. Geen contracten, geen vaste kosten, werk vanaf €100.`,
  alternates: { canonical: '/contact' }
};

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Bel me wanneer je me *nodig* hebt." intro="Geen ticketsysteem en geen accountmanager. Je spreekt mij direct. Werk begint vanaf €100, zonder contract of vaste kosten." />
      <section className="wrap grid gap-10 pb-[clamp(96px,12vw,170px)] lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)]">
        <div className="grid content-start gap-4">
          <Reveal>
            <a href={site.whatsapp} className="card group flex items-center gap-5 p-6 transition-all hover:-translate-y-1 hover:border-[#16a34a]/40">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#16a34a] text-white"><MessageCircle size={24} /></span>
              <span><b className="block text-[19px]">WhatsApp</b><span className="text-muted">Snelste manier, meestal binnen een uur antwoord</span></span>
            </a>
          </Reveal>
          <Reveal delay={0.08}>
            <a href={site.phoneHref} className="card group flex items-center gap-5 p-6 transition-all hover:-translate-y-1 hover:border-accent/40">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-white"><Phone size={22} /></span>
              <span><b className="block text-[19px] tabular-nums">{site.phone}</b><span className="text-muted">Bel gerust, ook voor een korte vraag</span></span>
            </a>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="card flex items-center gap-5 p-6">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white"><MapPin size={22} /></span>
              <span><b className="block text-[19px]">{site.city} en omgeving</b><span className="text-muted">{site.areas.slice(1).join(', ')}</span></span>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}><ContactForm /></Reveal>
      </section>
    </>
  );
}
