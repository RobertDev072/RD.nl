'use client';
import { useCallback, useEffect, useState } from 'react';
import { GALLERY, img, sq } from '@/lib/data';
import { lock, unlock } from '@/lib/lock';
import { Icon } from '@/components/ui';

function Lightbox({ i, set, onClose }) {
  useEffect(() => {
    lock();
    const k = e => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') set(x => (x + 1) % GALLERY.length); if (e.key === 'ArrowLeft') set(x => (x - 1 + GALLERY.length) % GALLERY.length); };
    addEventListener('keydown', k);
    return () => { unlock(); removeEventListener('keydown', k); };
  }, [onClose, set]);
  const [x0, setX0] = useState(null);
  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label="Foto" onTouchStart={e => setX0(e.touches[0].clientX)} onTouchEnd={e => { if (x0 == null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) set(x => (x + (d < 0 ? 1 : -1) + GALLERY.length) % GALLERY.length); setX0(null); }}>
      <button className="lb-x" onClick={onClose} aria-label="Sluiten">×</button>
      <button className="lb-n p" onClick={() => set(x => (x - 1 + GALLERY.length) % GALLERY.length)} aria-label="Vorige">{Icon.left(28)}</button>
      <img src={img(GALLERY[i], 'width=1400')} alt="Nagels van House of Nails" />
      <button className="lb-n n" onClick={() => set(x => (x + 1) % GALLERY.length)} aria-label="Volgende">{Icon.right(28)}</button>
      <span className="lb-c">{i + 1} / {GALLERY.length}</span>
    </div>
  );
}

export default function Gallery() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  useEffect(() => { const h = +location.hash.slice(1); if (location.hash && h >= 0 && h < GALLERY.length) setOpen(h); }, []);
  return (
    <>
      <div className="gal">{GALLERY.map((g, i) => <button key={g} onClick={() => setOpen(i)} aria-label={`Foto ${i + 1} vergroten`}><img src={sq(g, 500)} alt="" loading={i < 8 ? 'eager' : 'lazy'} /></button>)}</div>
      {open != null && <Lightbox i={open} set={setOpen} onClose={close} />}
    </>
  );
}
