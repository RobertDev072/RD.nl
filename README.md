# R DEV — website

Website van **R DEV** (Robert Rocha), webdesign en development uit Alkmaar: websites, web apps, SaaS, apps en AI-automatisering.

Gebouwd met **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS**, **Framer Motion** en **Lenis** (smooth scroll).

## Pagina's

| Route | Inhoud |
|---|---|
| `/` | Homepage: hero, diensten, scroll-animatie (zoeken → website → WhatsApp → AI-agent → agenda), projecten, over, werkwijze, FAQ |
| `/diensten` en `/diensten/[slug]` | 7 dienstpagina's, elk met eigen SEO-titel en FAQ |
| `/projecten` en `/projecten/[slug]` | SG Onderneming, BN Elektra, VeriPasso, Goaltje |
| `/automatisering` | AI-automatisering met de interactieve flow |
| `/over`, `/contact` | Over Robert, contact (formulier opent WhatsApp) |
| `/sitemap.xml`, `/robots.txt` | Automatisch gegenereerd |

Content (diensten, projecten) staat in `src/lib/content.ts`, contactgegevens in `src/lib/site.ts`.

## Lokaal draaien

```bash
npm install
npm run dev
```

## Domein

Zet in Vercel de environment variable `NEXT_PUBLIC_SITE_URL` op je domein (bijv. `https://www.jouwdomein.nl`). Die wordt gebruikt voor canonical-URL's, Open Graph, structured data en de sitemap.

## Bronnen

`design/` bevat de oorspronkelijke Claude Design-bestanden.
