// Warm, human message per lead, built only from what the website check actually found (no AI, no guesses).
// Robert sends it himself; it always contains an easy way to say "no thanks".

type Finding = { id: string; ok: boolean; weight: number };
export type MessageLead = {
  business_name: string | null; category: string | null; city: string | null; domain: string | null; slug: string | null;
  audit: { findings?: Finding[]; loadMs?: number } | null;
};

// Each check in plain language: what the visitor experiences, not technical jargon.
const HUMAN: Record<string, (l: MessageLead) => string> = {
  mobile: () => 'op de telefoon past de site zich niet goed aan het scherm aan, terwijl de meeste mensen tegenwoordig zo zoeken',
  speed: (l) => `de site laadt wat traag${l.audit?.loadMs ? ` (bij mij ongeveer ${(Math.round(l.audit.loadMs / 100) / 10).toLocaleString('nl-NL')} seconden)` : ''}, en dan haken bezoekers snel af`,
  https: () => 'de site heeft geen beveiligd slotje (https), waardoor sommige browsers een waarschuwing tonen',
  booking: (l) => `ik zag geen manier om direct online ${/kapper|salon|restaurant|café/.test(l.category ?? '') ? 'een afspraak of tafel te boeken' : 'een afspraak of offerte aan te vragen'}`,
  contact: () => 'op de telefoon kun je niet met één tik bellen of een WhatsApp sturen',
  title: () => 'de paginatitel die Google laat zien kan duidelijker, zodat mensen sneller zien wat u doet',
  description: () => 'de korte omschrijving in Google ontbreekt of is erg kort',
  fresh: () => 'de site oogt alsof hij al een tijdje niet is bijgewerkt',
  social: () => 'als iemand de link deelt via WhatsApp of Facebook, verschijnt er geen mooie preview met foto'
};

// Category label (from the lead engine) → how you'd naturally refer to the business.
const NOUN: Record<string, string> = {
  kapper: 'kapsalon', schoonheidssalon: 'salon', restaurant: 'restaurant', 'café': 'café', elektricien: 'bedrijf',
  'installatie/bouw': 'bedrijf', winkel: 'winkel', vakbedrijf: 'bedrijf'
};

const greetingFor =(l: MessageLead) => (l.business_name ? `Beste ${l.business_name}` : 'Goedendag');

export function warmMessage(l: MessageLead): { subject: string; body: string } {
  const issues = (l.audit?.findings ?? []).filter((f) => !f.ok && HUMAN[f.id]).sort((a, b) => b.weight - a.weight).slice(0, 2)
    .map((f) => HUMAN[f.id](l));
  const place = l.city ? ` in ${l.city}` : '';
  const what = NOUN[l.category ?? ''] ?? 'bedrijf';
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const observation = issues.length === 2
    ? `Wat me opviel: ${issues[0]}. ${cap(issues[1])}. Zonde, want dat kost u waarschijnlijk klanten die u nu niet ziet.`
    : issues.length === 1
      ? `Wat me opviel: ${issues[0]}. Zonde, want dat kost u waarschijnlijk klanten die u nu niet ziet.`
      : 'De site doet het netjes, maar ik denk dat er met een frisse, moderne uitstraling nog meer klanten uit te halen zijn.';

  const preview = l.slug
    ? `Ik heb alvast een gratis voorbeeld gemaakt van hoe uw site eruit zou kunnen zien, met uw eigen logo, kleuren en foto's:\nhttps://lorvex.nl/voor/${l.slug}`
    : 'Als u wilt, maak ik gratis een voorbeeld van hoe uw site eruit zou kunnen zien, met uw eigen logo, kleuren en foto\'s.';

  const body = `${greetingFor(l)},

Mijn naam is Robert, ik maak websites en webshops voor ondernemers. Ik kwam uw ${what}${place} tegen en heb even naar ${l.domain ?? 'uw website'} gekeken.

${observation}

${preview}

Het is helemaal vrijblijvend: kijk er rustig naar, en als het u aanspreekt hoor ik het graag. Geen interesse? Dan is een kort berichtje genoeg en hoort u verder niets meer van mij.

Hartelijke groet,
Robert Rocha
Lorvex · lorvex.nl · 06 41227451`;

  return { subject: `Even een idee voor de website van ${l.business_name ?? 'uw zaak'}`, body };
}
