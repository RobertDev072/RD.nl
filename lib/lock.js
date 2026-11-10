// Scroll-lock zonder dat de pagina verspringt (ook op iOS Safari)
let y = 0, n = 0;
export function lock() {
  if (n++ > 0) return;
  y = window.scrollY;
  const b = document.body.style;
  b.position = 'fixed'; b.top = `-${y}px`; b.left = '0'; b.right = '0'; b.width = '100%';
}
export function unlock() {
  if (n === 0) return;
  if (--n > 0) return;
  const b = document.body.style;
  b.position = ''; b.top = ''; b.left = ''; b.right = ''; b.width = '';
  window.scrollTo({ top: y, behavior: 'instant' });
}
