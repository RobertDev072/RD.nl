'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import CartDrawer from './CartDrawer';
import QuickView from './QuickView';
import SearchOverlay from './SearchOverlay';

const Ctx = createContext(null);
export const useShop = () => useContext(Ctx);
const KEY = 'jhw_cart_v1', WKEY = 'jhw_wish_v1', RKEY = 'jhw_recent_v1';
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// Compacte productkaart-data om lokaal te bewaren (verlanglijst / recent bekeken)
export const snap = p => ({
  id: p.id, slug: p.slug, name: p.name, brand: p.brand, price: p.price, regular: p.regular, onSale: p.onSale,
  inStock: p.inStock, priceMax: p.priceMax, attrName: p.attrName, rating: p.rating, reviews: p.reviews,
  options: p.options ? p.options.map(o => ({ id: o.id, label: o.label, price: o.price, regular: o.regular, inStock: o.inStock, image: o.image ? { thumb: o.image.thumb, src: o.image.src } : null })) : null,
  images: (p.images || []).slice(0, 2).map(i => ({ src: i.src, thumb: i.thumb, alt: i.alt })), short: p.short
});

export default function ShopProvider({ children, index = [] }) {
  const [cart, setCart] = useState([]);
  const [wish, setWish] = useState([]);
  const [recent, setRecent] = useState([]);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [quick, setQuick] = useState(null);
  const [search, setSearch] = useState(false);
  const [toast, setToast] = useState(null);
  const tRef = useRef();

  useEffect(() => {
    setCart(load(KEY, [])); setWish(load(WKEY, [])); setRecent(load(RKEY, []));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) save(KEY, cart); }, [cart, ready]);
  useEffect(() => { if (ready) save(WKEY, wish); }, [wish, ready]);
  useEffect(() => { if (ready) save(RKEY, recent); }, [recent, ready]);

  const notify = useCallback((msg, img, action) => {
    clearTimeout(tRef.current);
    setToast({ msg, img, action });
    tRef.current = setTimeout(() => setToast(null), 3800);
  }, []);

  const openCart = useCallback(() => { setToast(null); setQuick(null); setDrawer(true); }, []);
  const closeCart = useCallback(() => setDrawer(false), []);
  const openQuick = useCallback(p => { setToast(null); setQuick(p); }, []);
  const closeQuick = useCallback(() => setQuick(null), []);
  const openSearch = useCallback(() => setSearch(true), []);
  const closeSearch = useCallback(() => setSearch(false), []);

  // item: { pid, oid, slug, name, opt, price, regular, img }
  const add = useCallback((item, q = 1) => {
    const k = `${item.pid}:${item.oid || 0}`;
    setCart(c => {
      const e = c.find(l => l.k === k);
      return e ? c.map(l => l.k === k ? { ...l, q: Math.min(20, l.q + q) } : l) : [...c, { ...item, k, q }];
    });
    notify(`${item.name}${item.opt ? ` (${item.opt})` : ''} is toegevoegd`, item.img, { label: 'Bekijk mand', fn: () => setDrawer(true) });
  }, [notify]);

  const remove = useCallback(k => {
    setCart(c => {
      const i = c.findIndex(l => l.k === k);
      if (i < 0) return c;
      const line = c[i];
      notify(`${line.name} verwijderd`, null, { label: 'Ongedaan maken', fn: () => setCart(cc => { const n = [...cc]; n.splice(i, 0, line); return n; }) });
      return c.filter(l => l.k !== k);
    });
  }, [notify]);

  const setQty = useCallback((k, q) => {
    if (q < 1) return remove(k);
    setCart(c => c.map(l => l.k === k ? { ...l, q: Math.min(20, q) } : l));
  }, [remove]);

  const clear = useCallback(() => setCart([]), []);

  const toggleWish = useCallback(p => {
    setWish(w => {
      if (w.some(x => x.id === p.id)) { notify(`${p.name} van je verlanglijst gehaald`); return w.filter(x => x.id !== p.id); }
      notify(`${p.name} staat op je verlanglijst`, p.images?.[0]?.thumb, { label: 'Bekijk', fn: () => { location.href = '/verlanglijst'; } });
      return [snap(p), ...w].slice(0, 60);
    });
  }, [notify]);

  const seen = useCallback(p => setRecent(r => [snap(p), ...r.filter(x => x.id !== p.id)].slice(0, 12)), []);

  const value = useMemo(() => {
    const count = cart.reduce((a, l) => a + l.q, 0);
    const subtotal = cart.reduce((a, l) => a + l.price * l.q, 0);
    const savings = cart.reduce((a, l) => a + Math.max(0, (l.regular || l.price) - l.price) * l.q, 0);
    const qtyOf = pid => cart.filter(l => l.pid === pid).reduce((a, l) => a + l.q, 0);
    const isWish = id => wish.some(x => x.id === id);
    return { cart, count, subtotal, savings, ready, add, remove, setQty, clear, qtyOf, openCart, notify, wish, isWish, toggleWish, recent, seen, openQuick, openSearch, index };
  }, [cart, wish, recent, ready, add, remove, setQty, clear, openCart, notify, toggleWish, seen, openQuick, openSearch, index]);

  return (
    <Ctx.Provider value={value}>
      {children}
      {drawer && <CartDrawer onClose={closeCart} />}
      {quick && <QuickView p={quick} onClose={closeQuick} />}
      {search && <SearchOverlay onClose={closeSearch} />}
      {toast && (
        <div className="toast" role="status">
          {toast.img && <img src={toast.img} alt="" width="40" height="40" />}
          <span style={{ flex: 1 }}>{toast.msg}</span>
          {toast.action && <button onClick={() => { setToast(null); toast.action.fn(); }}>{toast.action.label}</button>}
        </div>
      )}
    </Ctx.Provider>
  );
}
