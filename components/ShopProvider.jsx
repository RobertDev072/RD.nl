'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';

const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);
const KEY = 'hon_cart_v1';

export default function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [toast, setToast] = useState(null);
  const tRef = useRef();
  const path = usePathname();
  useEffect(() => { setToast(null); }, [path]);
  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} }, [cart, ready]);

  const notify = useCallback((msg, action) => {
    clearTimeout(tRef.current); setToast({ msg, action });
    tRef.current = setTimeout(() => setToast(null), 3600);
  }, []);
  const openCart = useCallback(() => { setToast(null); setDrawer(true); }, []);
  const closeCart = useCallback(() => setDrawer(false), []);

  // item: { kind: 'treatment'|'gift', id, slug, name, opt, price, img, meta }
  const add = useCallback((item, q = 1) => {
    const k = `${item.kind}:${item.id}:${item.opt || ''}:${item.meta?.design || ''}:${item.meta?.to || ''}`;
    setCart(c => {
      const e = c.find(l => l.k === k);
      if (e) return item.kind === 'gift' ? c.map(l => l.k === k ? { ...l, q: Math.min(10, l.q + q) } : l) : c;
      return [...c, { ...item, k, q: item.kind === 'gift' ? q : 1 }];
    });
    notify(item.kind === 'gift' ? `${item.name} toegevoegd` : `${item.name}${item.opt ? ` (${item.opt})` : ''} staat in je afspraak`, { label: 'Bekijk', fn: () => setDrawer(true) });
  }, [notify]);
  const remove = useCallback(k => setCart(c => c.filter(l => l.k !== k)), []);
  const setQty = useCallback((k, q) => { if (q < 1) return remove(k); setCart(c => c.map(l => l.k === k ? { ...l, q } : l)); }, [remove]);
  const clear = useCallback(() => setCart([]), []);
  const has = useCallback((kind, id) => cart.some(l => l.kind === kind && l.id === id), [cart]);

  const value = useMemo(() => {
    const count = cart.reduce((a, l) => a + l.q, 0);
    const total = cart.reduce((a, l) => a + l.price * l.q, 0);
    const treatments = cart.filter(l => l.kind === 'treatment');
    const gifts = cart.filter(l => l.kind === 'gift');
    return { cart, count, total, treatments, gifts, ready, add, remove, setQty, clear, has, openCart, notify };
  }, [cart, ready, add, remove, setQty, clear, has, openCart, notify]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {drawer && <CartDrawer onClose={closeCart} />}
      {toast && (
        <div className="toast" role="status">
          <span style={{ flex: 1 }}>{toast.msg}</span>
          {toast.action && <button onClick={() => { setToast(null); toast.action.fn(); }}>{toast.action.label}</button>}
        </div>
      )}
    </Ctx.Provider>
  );
}
