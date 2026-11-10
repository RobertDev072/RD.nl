'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lock, unlock } from '@/lib/lock';
import { eur } from '@/lib/format';
import { useShop } from './ShopProvider';
import { Icon, Img, Qty } from './ui';

export default function CartDrawer({ onClose }) {
  const { cart, total, treatments, gifts, setQty, remove } = useShop();
  const router = useRouter();
  useEffect(() => {
    const k = e => e.key === 'Escape' && onClose();
    addEventListener('keydown', k); lock();
    return () => { removeEventListener('keydown', k); unlock(); };
  }, [onClose]);
  const Line = ({ l }) => (
    <div className="line">
      <span className="li">{l.kind === 'gift' ? <span className="giftmini"><b>Cadeaubon</b>{eur(l.price)}</span> : <Img src={l.img} alt="" />}</span>
      <div>
        <div className="nm">{l.name}</div>
        <div className="sub">{[l.opt, l.meta?.design, l.meta?.to && `voor ${l.meta.to}`].filter(Boolean).join(' · ')}</div>
        <div className="ctr">{l.kind === 'gift' && <Qty value={l.q} onChange={q => setQty(l.k, q)} />}<button className="rm" onClick={() => remove(l.k)}>Verwijderen</button></div>
      </div>
      <div className="lt">{eur(l.price * l.q)}</div>
    </div>
  );
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Jouw selectie">
        <div className="handle" aria-hidden="true" />
        <div className="dhead"><h2>Jouw selectie</h2><button className="x" onClick={onClose} aria-label="Sluiten">×</button></div>
        <div className="dbody">
          {cart.length === 0 ? (
            <div className="empty" style={{ marginTop: 20 }}>
              <h3>Nog niets gekozen</h3>
              <p>Kies een behandeling om je afspraak te boeken, of geef een cadeaubon cadeau.</p>
              <div style={{ display: 'grid', gap: 8 }}>
                <button className="btn btn-gold" onClick={() => { onClose(); router.push('/behandelingen'); }}>Bekijk behandelingen</button>
                <button className="btn btn-line" onClick={() => { onClose(); router.push('/cadeaubon'); }}>Cadeaubon kopen</button>
              </div>
            </div>
          ) : (
            <>
              {treatments.length > 0 && <h4 className="dsec">{Icon.cal(17)} Afspraak</h4>}
              {treatments.map(l => <Line key={l.k} l={l} />)}
              {treatments.length > 0 && <Link href="/behandelingen?cat=extras" className="addmore" onClick={onClose}>{Icon.plus(16)} Extra toevoegen (french, chrome, design…)</Link>}
              {gifts.length > 0 && <h4 className="dsec">{Icon.gift(17)} Cadeaubonnen</h4>}
              {gifts.map(l => <Line key={l.k} l={l} />)}
            </>
          )}
        </div>
        {cart.length > 0 && (
          <div className="dfoot">
            <div className="row tot" style={{ marginTop: 0, borderTop: 0, paddingTop: 0 }}><span>Totaal</span><span>{eur(total)}</span></div>
            <button className="btn btn-gold btn-block" style={{ marginTop: 10 }} onClick={() => { onClose(); router.push('/afrekenen'); }}>
              {treatments.length ? 'Kies datum & tijd' : 'Afrekenen'} {Icon.arrow(17)}
            </button>
            <button className="btn btn-line btn-block" style={{ marginTop: 8 }} onClick={onClose}>Verder kijken</button>
          </div>
        )}
      </aside>
    </>
  );
}
