'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { bySlug, unitPrice } from '@/lib/menu';
import ProductModal from './ProductModal';
import CartDrawer from './CartDrawer';
import MobileBar from './MobileBar';

const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);
const KEY = 'hh_cart_v1';

export default function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null); // product slug
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState(null);
  const tRef = useRef();

  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem(KEY) || '[]').filter(l => bySlug(l.s))); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} }, [cart, ready]);

  const notify = useCallback((msg, action) => {
    clearTimeout(tRef.current);
    setToast({ msg, action });
    tRef.current = setTimeout(() => setToast(null), 4000);
  }, []);

  const add = useCallback((s, opt = '', q = 1, silent) => {
    const p = bySlug(s);
    const o = p.v ? (opt || p.v[0][0]) : '';
    const k = `${s}|${o}`;
    setCart(c => {
      const e = c.find(l => l.k === k);
      return e ? c.map(l => l.k === k ? { ...l, q: Math.min(50, l.q + q) } : l) : [...c, { k, s, o, q }];
    });
    if (!silent) notify(`${q}× ${p.n}${o ? ` (${o})` : ''} toegevoegd`, { label: 'Bekijk mand', fn: () => setDrawer(true) });
  }, [notify]);

  const remove = useCallback(k => {
    setCart(c => {
      const i = c.findIndex(l => l.k === k);
      if (i < 0) return c;
      const line = c[i];
      notify(`${bySlug(line.s).n} verwijderd`, { label: 'Ongedaan maken', fn: () => setCart(cc => { const n = [...cc]; n.splice(i, 0, line); return n; }) });
      return c.filter(l => l.k !== k);
    });
  }, [notify]);

  const setQty = useCallback((k, q) => {
    if (q < 1) return remove(k);
    setCart(c => c.map(l => l.k === k ? { ...l, q: Math.min(50, q) } : l));
  }, [remove]);

  const clear = useCallback(() => setCart([]), []);

  const lines = useMemo(() => cart.map(l => { const p = bySlug(l.s); const u = unitPrice(p, l.o); return { ...l, p, u, t: u * l.q }; }), [cart]);
  const count = lines.reduce((a, l) => a + l.q, 0);
  const subtotal = lines.reduce((a, l) => a + l.t, 0);
  const qtyOf = s => cart.filter(l => l.s === s).reduce((a, l) => a + l.q, 0);

  const value = { cart, lines, count, subtotal, ready, add, remove, setQty, clear, qtyOf, query, setQuery, openProduct: setOpen, openCart: () => { setToast(null); setDrawer(true); }, notify };

  return (
    <Ctx.Provider value={value}>
      <div className={count ? 'hasbar' : ''}>{children}</div>
      {open && <ProductModal slug={open} onClose={() => setOpen(null)} />}
      {drawer && <CartDrawer onClose={() => setDrawer(false)} />}
      <MobileBar />
      {toast && (
        <div className="toast" role="status">
          <span>{toast.msg}</span>
          {toast.action && <button onClick={() => { setToast(null); toast.action.fn(); }}>{toast.action.label}</button>}
        </div>
      )}
    </Ctx.Provider>
  );
}
