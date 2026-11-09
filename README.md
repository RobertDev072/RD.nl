# R DEV — rd.nl

Website van **R DEV** (Robert Rocha), webdesign en development uit Alkmaar: websites, web apps, SaaS, apps en AI-automatisering.

## Structuur

| Pad | Inhoud |
|---|---|
| `index.html` | De gebouwde homepage (statisch, geen build nodig) |
| `assets/img/` | Screenshots van projecten en het logo |
| `assets/js/` | Runtime voor de animatie (klant → website → WhatsApp → AI-agent → agenda) |
| `sitemap.xml`, `robots.txt` | SEO |
| `design/` | Bronbestanden uit Claude Design (`.dc.html`) en het SEO-plan |
| `tools/build.cjs` | Bouwt `index.html` en de rest opnieuw uit `design/` |

## Deployen op Vercel

1. Importeer deze repository in Vercel.
2. Framework preset: **Other**. Build command: leeg laten. Output directory: leeg laten (root).
3. Koppel je domein onder *Settings → Domains*.

## Domein invullen en opnieuw bouwen

Na een wijziging in `design/` of zodra het domein bekend is:

```bash
DOMAIN=https://www.jouwdomein.nl node tools/build.cjs
```

Dit vult het domein in de canonical-URL, Open Graph-tags, structured data, `sitemap.xml` en `robots.txt`.
