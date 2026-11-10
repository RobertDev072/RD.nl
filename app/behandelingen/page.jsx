import { Suspense } from 'react';
import Link from 'next/link';
import List from './List';
export const metadata = { title: 'Behandelingen' };
export default function Page() {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ Behandelingen</span></nav>
      <div className="listhead">
        <span className="eyebrow">Online boeken</span>
        <h1>Behandelingen</h1>
        <p>Kies je behandeling en eventuele extra's, daarna kies je zelf een datum en tijd. Professionele verzorging van uw natuurlijke nagels en handen.</p>
      </div>
      <Suspense fallback={null}><List /></Suspense>
    </div>
  );
}
