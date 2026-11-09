# Lorvex SEO-agent

Werkinstructies voor de wekelijkse SEO-agent van lorvex.nl. De agent draait elke week als geplande taak
en volgt dit bestand. Doel: Lorvex in de top 3 van Google krijgen op lokale zoekopdrachten rond
**website laten maken / webdesign in Alkmaar** en op **AI-automatisering / AI-development / AI-oplossingen**.

## Vaste gegevens

- Site: https://lorvex.nl (fallback zolang het domein nog niet actief is: https://rd-main-project-2026-site.vercel.app)
- Repo: github.com/RobertDev072/RD.nl, branch `main` (Vercel deployt `main` automatisch naar productie)
- Eigenaar: Robert Rocha, Lorvex, Alkmaar. Telefoon/WhatsApp +31 6 28669488.
- Prijzen (niet afwijken): simpele site tot 3 pagina's €100 · websites tot max €250 · webshop/e-commerce ca. €500 ·
  web apps en SaaS ca. €750 · werk begint vanaf €100 · geen contracten, geen vaste kosten.
- Zoekwoorden en planning: `seo/zoekwoorden.md`. Logboek: `seo/logboek.md`.
- Artikelen: `content/kennisbank/<slug>.md` (formaat: zie `content/kennisbank/_TEMPLATE.md`).

## Elke week, in deze volgorde

1. **Repo bijwerken.** Clone of pull `main`. Lees `seo/zoekwoorden.md` en de laatste 3 entries van `seo/logboek.md`.
2. **Gezondheid checken.**
   - Haal de homepage, `/sitemap.xml` en `/robots.txt` op. Noteer statuscodes en of de sitemap alle artikelen bevat.
   - Check of `lorvex.nl` resolvet (bijv. `https://dns.google/resolve?name=lorvex.nl&type=A`).
   - PageSpeed: `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=<site>&strategy=mobile&category=performance&category=seo`
     Noteer performance- en SEO-score. Zakt performance onder 85: zoek de oorzaak en los het op als het klein en veilig is.
3. **Posities checken.** Zoek op het web naar de 6 belangrijkste zoekwoorden uit `seo/zoekwoorden.md` en noteer of en waar
   lorvex.nl verschijnt. (Dit is een indicatie; Google Search Console is leidend zodra Robert die heeft gekoppeld.)
4. **Eén nieuw artikel publiceren.**
   - Kies het eerstvolgende zoekwoord met status `gepland` in `seo/zoekwoorden.md`.
   - Schrijf 700 tot 1100 woorden in natuurlijk Nederlands, voor ondernemers, zonder jargon. Beantwoord de echte vraag achter het zoekwoord.
   - Gebruik het zoekwoord in de titel, de description, de eerste alinea en minstens één H2. Niet volproppen.
   - Interne links: minstens 2 naar relevante pagina's (`/diensten/...`, `/kennisbank/...`, `/contact`, `/automatisering`).
   - Eindig met een korte, eerlijke call-to-action naar Lorvex.
   - **Nooit verzinnen**: geen nep-reviews, geen klantnamen of resultaten die niet in de repo staan, geen garanties
     ("nummer 1 in Google"), geen andere prijzen dan hierboven, geen cijfers zonder bron. Twijfel je over een feit, laat het weg.
   - Zet het zoekwoord in `seo/zoekwoorden.md` op `gepubliceerd` met datum en slug.
5. **Bestaande pagina's verbeteren (klein).** Als er tijd is: verbeter één bestaande pagina of artikel (betere title/description,
   extra FAQ, interne link). Houd wijzigingen klein en veilig. Geen ontwerp- of layoutwijzigingen.
6. **Bouwen en controleren.** `npm ci && npx next build`. Alleen bij een geslaagde build verder. Bij fouten: herstel of draai je
   wijziging terug.
7. **Publiceren.** Commit op `main` met een duidelijke Nederlandse commitboodschap en push. Controleer daarna dat de
   Vercel-deploy slaagt en dat het nieuwe artikel live bereikbaar is.
8. **Indexering versnellen.** Ping IndexNow voor de nieuwe URL:
   `https://api.indexnow.org/indexnow?url=<volledige-url>&key=<key>` (key: `347f0b387fb9729307567109f1226cbb`, bestand `public/347f0b387fb9729307567109f1226cbb.txt`).
9. **Logboek.** Voeg bovenaan `seo/logboek.md` een entry toe: datum, wat er gecheckt is (scores, posities), wat er gepubliceerd
   of verbeterd is, en maximaal 3 concrete adviezen voor Robert (dingen die alleen hij kan doen, zoals reviews vragen,
   Google Bedrijfsprofiel bijwerken of backlinks regelen). Commit en push het logboek mee.
10. **Rapport.** Sluit af met een korte samenvatting in het Nederlands voor Robert.

## Wat de agent niet doet

- Geen wijzigingen aan prijzen, contactgegevens, juridische teksten of het ontwerp.
- Geen nieuwe dependencies zonder noodzaak.
- Geen berichten versturen, accounts aanmaken of iets kopen.
