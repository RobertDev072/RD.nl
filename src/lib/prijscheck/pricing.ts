/**
 * Prijzen van Lorvex (vastgesteld door Robert, 9 nov 2026).
 * De AI kiest alleen een pakket; de prijs wordt hier vastgezet, zodat de agent nooit zelf bedragen verzint.
 */
export type Pakket = 'simpel' | 'website' | 'webshop' | 'webapp';

export const pakketten: Record<Pakket, { naam: string; min: number; max: number; uitleg: string }> = {
  simpel: { naam: 'Simpele website', min: 100, max: 100, uitleg: 'Een strakke site tot 3 pagina’s.' },
  website: { naam: 'Website', min: 100, max: 250, uitleg: 'Een complete bedrijfswebsite met meer pagina’s, op maat ontworpen.' },
  webshop: { naam: 'Webshop', min: 500, max: 500, uitleg: 'Een webshop met producten, winkelwagen en betalen.' },
  webapp: { naam: 'Web app of SaaS', min: 750, max: 750, uitleg: 'Software op maat: inloggen, dashboards, boekingen of een SaaS-platform.' }
};

/** Prijs vastzetten binnen de grenzen van het pakket, afgerond op €50. */
export function prijsVoor(pakket: Pakket, voorstel?: number): number {
  const p = pakketten[pakket];
  const v = typeof voorstel === 'number' && Number.isFinite(voorstel) ? voorstel : p.max;
  return Math.min(p.max, Math.max(p.min, Math.round(v / 50) * 50));
}

export const prijsRegels = `
PRIJZEN VAN LORVEX (houd je hier strikt aan):
- "simpel": simpele website tot 3 pagina's, informatief: €100
- "website": bedrijfswebsite met meer pagina's of meer maatwerk: €100 tot maximaal €250 (kies 150, 200 of 250 naar omvang)
- "webshop": webshop / e-commerce: ongeveer €500
- "webapp": web app, klantportaal, boekingssysteem op maat of SaaS: ongeveer €750
- AI-automatisering (zoals een WhatsApp-assistent) noem je alleen als optionele uitbreiding met "prijs op aanvraag".
- Werk begint vanaf €100. Geen contracten, geen vaste maandkosten.
`;
