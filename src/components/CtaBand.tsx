import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { site } from '@/lib/site';
import { Reveal } from './Reveal';

export default function CtaBand({ title = 'Klaar om te bouwen?', text = 'Vertel kort wat je wilt maken. Je krijgt snel antwoord en een gratis eerste voorbeeld.' }: { title?: string; text?: string }) {
  return (
    <section className="wrap pb-[clamp(80px,10vw,150px)]">
      <Reveal>
        <div className="relative overflow-hidden rounded-[36px] border border-line bg-white p-[clamp(32px,6vw,88px)] shadow-glow">
          <div aria-hidden className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-blue/25 blur-[100px]" />
          <div className="relative flex flex-wrap items-end justify-between gap-10">
            <div className="max-w-[720px]">
              <h2 className="h2">{title}</h2>
              <p className="lead mt-6">{text}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={site.whatsapp} className="btn-blue"><MessageCircle size={18} /> App me</a>
              <Link href="/contact" className="btn-ghost">Contact <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
