import type { Metadata } from 'next';
import PageHero from '@/components/PageHero';
import { legal, legalComplete, PRIVACY_UPDATED } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Privacyverklaring',
  description: 'Hoe Lorvex omgaat met je gegevens: welke gegevens, waarvoor, hoe lang en wat je rechten zijn.',
  alternates: { canonical: '/privacy' },
  // Indexed only once the KvK-nummer, btw-id and address are filled in.
  robots: { index: legalComplete, follow: true }
};

const missing = (label: string) => <span className="rounded bg-[#fef3c7] px-1.5 text-[#92400e]">[{label}: wordt aangevuld]</span>;

export default function Privacy() {
  const date = new Date(`${PRIVACY_UPDATED}T12:00:00`).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy*verklaring*" intro={`Laatst bijgewerkt op ${date}. In gewone taal: welke gegevens Lorvex verwerkt, waarom, hoe lang en wat je rechten zijn.`} />
      <section className="wrap pb-[clamp(96px,12vw,170px)]">
        <div className="prose-lorvex">
          <h2>Wie is verantwoordelijk?</h2>
          <p>
            {legal.tradeName}, eigenaar {legal.owner}<br />
            Adres: {legal.address ?? missing('adres')}<br />
            KvK-nummer: {legal.kvk ?? missing('KvK-nummer')}<br />
            Btw-id: {legal.btw ?? missing('btw-id')}<br />
            E-mail: <a href={`mailto:${legal.email}`}>{legal.email}</a><br />
            Telefoon: {legal.phone}
          </p>

          <h2>Welke gegevens en waarvoor?</h2>
          <h3>Gratis website-check</h3>
          <p>
            Als je een webadres invult, bekijken wij de openbare voorpagina van die website en tonen we het resultaat. Daarvoor vragen we
            geen persoonsgegevens. Om misbruik te voorkomen tellen we per bezoeker het aantal checks; daarbij slaan we je IP-adres
            <strong> niet</strong> op, alleen een onomkeerbare, versleutelde code (hash) die na korte tijd vervalt.
          </p>
          <h3>Aanvraag voor een gratis voorbeeldontwerp</h3>
          <p>Vraag je na de check een voorbeeldontwerp aan, dan bewaren we:</p>
          <ul>
            <li>je naam, e-mailadres, en als je die invult je telefoonnummer en bedrijfsnaam;</li>
            <li>het webadres en de uitkomst van de website-check;</li>
            <li>het bewijs van je toestemming: de exacte tekst waarmee je akkoord ging, de datum en tijd, de gekozen contactkanalen,
              je browsertype en een versleutelde code van je IP-adres (niet het IP-adres zelf).</li>
          </ul>
          <p>
            We gebruiken deze gegevens alleen om contact met je op te nemen over de check en het voorbeeldontwerp, via de kanalen waarvoor
            je toestemming gaf. <strong>Grondslag:</strong> je toestemming (artikel 6 lid 1 sub a AVG). Je kunt die altijd intrekken.
          </p>
          <h3>Contact via WhatsApp of telefoon</h3>
          <p>
            Neem je zelf contact op via WhatsApp of telefoon, dan gebruiken we je gegevens om je vraag te beantwoorden en, als je klant
            wordt, om de opdracht uit te voeren (artikel 6 lid 1 sub b AVG). WhatsApp is een dienst van Meta; daarvoor geldt ook het
            privacybeleid van WhatsApp.
          </p>

          <h2>Hoe lang bewaren we je gegevens?</h2>
          <ul>
            <li>Aanvragen die niet tot een opdracht leiden: maximaal 12 maanden na het laatste contact, daarna verwijderd.</li>
            <li>Bewijs van toestemming: zolang we je gegevens gebruiken, en daarna maximaal 2 jaar om te kunnen aantonen dat we de regels volgden.</li>
            <li>Gegevens van klanten: zolang nodig voor de opdracht, en facturen 7 jaar (wettelijke bewaarplicht).</li>
            <li>Wil je niet meer benaderd worden? Dan bewaren we alleen je e-mailadres of webadres op een blokkeerlijst, zodat we je niet opnieuw benaderen.</li>
          </ul>

          <h2>Wie verwerkt gegevens voor ons?</h2>
          <ul>
            <li><strong>Supabase</strong>: database waarin aanvragen worden opgeslagen, gehost in de Europese Unie (Ierland).</li>
            <li><strong>Vercel</strong>: hosting van deze website; de functies die aanvragen verwerken draaien in de Europese Unie (Ierland).
              Vercel is een Amerikaans bedrijf; voor eventuele doorgifte buiten de EU gelden de waarborgen uit de verwerkersovereenkomst van Vercel.</li>
          </ul>
          <p>We verkopen je gegevens nooit en delen ze niet met anderen voor hun eigen doeleinden.</p>

          <h2>Cookies</h2>
          <p>
            Deze website gebruikt geen tracking- of advertentiecookies en geen analysediensten van derden. Lettertypen worden vanaf
            onze eigen website geladen, niet via Google.
          </p>

          <h2>Je rechten</h2>
          <p>
            Je hebt het recht om je gegevens in te zien, te laten corrigeren of verwijderen, de verwerking te laten beperken, bezwaar te
            maken, je gegevens over te laten dragen en je toestemming in te trekken. Stuur daarvoor een e-mail naar{' '}
            <a href={`mailto:${legal.email}`}>{legal.email}</a>. We reageren binnen een maand.
          </p>
          <p>
            Ben je het niet eens met hoe we met je gegevens omgaan? Dan kun je een klacht indienen bij de{' '}
            <a href="https://autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener">Autoriteit Persoonsgegevens</a>.
          </p>

          <h2>Beveiliging</h2>
          <p>
            Aanvragen worden versleuteld verstuurd en opgeslagen in een database die niet openbaar toegankelijk is. Binnen Lorvex heeft
            alleen {legal.owner} toegang.
          </p>
        </div>
      </section>
    </>
  );
}
