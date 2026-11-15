// Legal business details shown on /privacy and in the footer.
// KvK-nummer, btw-id and address are NOT stored in this (public) repository: they come from
// environment variables in Vercel, so nothing is published before Robert fills them in.
//   NEXT_PUBLIC_LEGAL_KVK      e.g. 12345678
//   NEXT_PUBLIC_LEGAL_BTW      e.g. NL000000000B01
//   NEXT_PUBLIC_LEGAL_ADDRESS  e.g. Straat 1, 1234 AB Alkmaar  (only after explicit approval)
const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : null);

export const legal = {
  tradeName: 'Lorvex',
  owner: 'Robert Rocha',
  email: 'rb085@icloud.com',
  phone: '+31 6 28669488',
  city: 'Alkmaar',
  kvk: clean(process.env.NEXT_PUBLIC_LEGAL_KVK),
  btw: clean(process.env.NEXT_PUBLIC_LEGAL_BTW),
  address: clean(process.env.NEXT_PUBLIC_LEGAL_ADDRESS)
};

// Everything required for the legal footer and a complete privacy statement is present.
export const legalComplete = Boolean(legal.kvk && legal.btw && legal.address);

export const PRIVACY_UPDATED = '2026-11-15';
