const s = (d, n = 20, f) => <svg width={n} height={n} viewBox="0 0 24 24" fill={f ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
export const Icon = {
  bag: n => s(<><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>, n),
  heart: (n, f) => s(<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />, n, f),
  home: n => s(<><path d="M4 11l8-7 8 7" /><path d="M6 10v10h12V10" /></>, n),
  grid: n => s(<><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></>, n),
  menu: n => s(<path d="M4 7h16M4 12h16M4 17h10" />, n),
  x: n => s(<path d="M6 6l12 12M18 6L6 18" />, n),
  chat: n => s(<path d="M4 20l1.5-4A8 8 0 1 1 9 19.5L4 20z" />, n),
  pin: n => s(<><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>, n),
  phone: n => s(<path d="M6 3h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z" />, n),
  check: n => s(<path d="M5 12.5l4.5 4.5L19 7.5" />, n || 18),
  lock: n => s(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>, n),
  truck: n => s(<><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17" cy="18" r="1.8" /></>, n),
  back: n => s(<path d="M15 5l-7 7 7 7" />, n),
  arrow: n => s(<path d="M5 12h14M13 6l6 6-6 6" />, n),
  plus: n => s(<path d="M12 5v14M5 12h14" />, n),
  minus: n => s(<path d="M5 12h14" />, n),
  spark: n => s(<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />, n),
  insta: n => s(<><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r=".6" fill="currentColor" /></>, n),
  return: n => s(<path d="M9 14l-5-5 5-5M4 9h10a6 6 0 0 1 0 12h-3" />, n),
  user: n => s(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>, n)
};
export const Img = ({ src, alt = '', eager, className }) => <span className={`imgw ${className || ''}`}><img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} /></span>;
