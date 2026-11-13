'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { bySlug, SHIP, SHIP_FREE } from '@/lib/data';
const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);
export default function ShopProvider({ children }) {
  const [cart, setCart] = useState([]); const [wish, setWish] = useState([]);
  const [ready, setReady] = useState(false); const [open, setOpen] = useState(false); const [toast, setToast] = useState(null);
  useEffect(() => { try { setCart(JSON.parse(localStorage.getItem('bm_cart')) || []); setWish(JSON.parse(localStorage.getItem('bm_wish')) || []); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { localStorage.setItem('bm_cart', JSON.stringify(cart)); localStorage.setItem('bm_wish', JSON.stringify(wish)); } catch {} }, [cart, wish, ready]);
  const add = useCallback((slug, size, color, q = 1) => {
    const k = `${slug}|${size}|${color}`;
    setCart(c => c.some(l => l.k === k) ? c.map(l => l.k === k ? { ...l, q: l.q + q } : l) : [...c, { k, slug, size, color, q }]);
    setToast(bySlug(slug)?.name); setTimeout(() => setToast(null), 2200);
  }, []);
  const setQ = useCallback((k, q) => setCart(c => q < 1 ? c.filter(l => l.k !== k) : c.map(l => l.k === k ? { ...l, q } : l)), []);
  const clear = useCallback(() => setCart([]), []);
  const toggleWish = useCallback(s => setWish(w => w.includes(s) ? w.filter(x => x !== s) : [...w, s]), []);
  const openCart = useCallback(() => setOpen(true), []), closeCart = useCallback(() => setOpen(false), []);
  const v = useMemo(() => {
    const lines = cart.map(l => { const p = bySlug(l.slug); return p && { ...l, p, colorLabel: p.colors.find(c => c.id === l.color)?.label }; }).filter(Boolean);
    const sub = lines.reduce((a, l) => a + l.p.price * l.q, 0);
    const ship = sub === 0 || sub >= SHIP_FREE ? 0 : SHIP;
    return { lines, sub, ship, total: sub + ship, count: lines.reduce((a, l) => a + l.q, 0), wish, ready, open, toast, add, setQ, clear, toggleWish, openCart, closeCart };
  }, [cart, wish, ready, open, toast, add, setQ, clear, toggleWish, openCart, closeCart]);
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
