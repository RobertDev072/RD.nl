// Iconen (bruikbaar in server- en clientcomponenten)
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Icon = {
  bag: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></svg>,
  cal: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>,
  menu: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>,
  home: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>,
  nail: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M8 21V10a4 4 0 0 1 8 0v11" /><path d="M10 10.5a2 2 0 0 1 4 0V15h-4z" /></svg>,
  gift: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="3.5" y="8" width="17" height="4" rx="1" /><path d="M5 12v8h14v-8M12 8v12M12 8c-1.5-3-5-3.5-5-1.2C7 8 9 8 12 8zm0 0c1.5-3 5-3.5 5-1.2C17 8 15 8 12 8z" /></svg>,
  image: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.8" /><path d="m4 18 5-5 4 4 3-3 4 4" /></svg>,
  check: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} strokeWidth="2.1" aria-hidden="true"><path d="M5 12l5 5L20 7" /></svg>,
  plus: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} strokeWidth="2" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>,
  clock: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  pin: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>,
  phone: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>,
  chat: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z" /></svg>,
  insta: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.8" cy="7.2" r=".8" fill="currentColor" /></svg>,
  fb: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>,
  lock: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>,
  arrow: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  left: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>,
  right: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>,
  star: (s = 14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" /></svg>,
  spark: (s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" {...S} aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></svg>
};

