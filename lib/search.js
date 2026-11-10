// Snelle zoekfunctie in de browser (live suggesties)
export const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

export function searchIndex(index, q, limit = 6) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const out = [];
  for (const p of index) {
    const name = norm(p.name), hay = `${name} ${norm(p.brand)} ${norm(p.cats)}`;
    if (!terms.every(t => hay.includes(t))) continue;
    let score = 0;
    for (const t of terms) { if (name.startsWith(t)) score += 4; else if (name.includes(' ' + t)) score += 3; else if (name.includes(t)) score += 2; else score += 1; }
    if (p.inStock) score += 1;
    out.push([score, p]);
  }
  return out.sort((a, b) => b[0] - a[0]).slice(0, limit).map(x => x[1]);
}

export const POPULAR = ['Zilvershampoo', 'Föhn', 'Krultang', 'Orchid', 'Pomade', 'Satijn', 'Haarmasker', 'Core Lab'];
