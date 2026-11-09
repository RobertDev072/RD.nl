import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { site } from '@/lib/site';
import { Reveal } from './Reveal';

export default function CtaBand({ title = 'Klaar om te bouwen?', text = 'Vertel kort wat je wilt maken. Je krijgt snel antwoord en een gratis eerste voorbeeld.' }: { title?: string; text?: string }) {
  return (
    <section className="wrap pb-[clamp(80px,10vw,150px)]">
      <Reveal>
        <div className="relative overflow-hidden rounded-[36px] bg-night p-[clamp(32px,6vw,88px)] text-white shadow-glow">
          <div aria-hidden className="absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full bg-white/[.09] blur-[100px]" />
          <div className="relative flex flex-wrap items-end justify-between gap-10">
            <div className="max-w-[720px]">
              <h2 className="h2 text-white">{title}</h2>
              <p className="lead mt-6 text-white/65">{text}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={site.whatsapp} className="btn-light"><MessageCircle size={18} /> App me</a>
              <Link href="/contact" className="btn border border-white/15 bg-white/5 text-white hover:bg-white/10">Contact <ArrowRight size={16} /></Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
