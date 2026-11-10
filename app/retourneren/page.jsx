import ServicePage, { Contact } from '@/components/ServicePage';
export const metadata = { title: 'Retourneren' };
export default function Page() {
  return (
    <ServicePage path="/retourneren" title="Retourneren">
      <h2>Bedenktijd en retourtermijn</h2>
      <p>Je hebt het recht om je bestelling tot 14 dagen na de dag van ontvangst zonder opgave van reden te annuleren.</p>
      <p>Na het aanmelden van je retour heb je nog 14 dagen om het product daadwerkelijk terug te sturen.</p>
      <h2>Bestelling herroepen</h2>
      <p>Wil je je bestelling geheel of gedeeltelijk herroepen? Vul dan het herroepingsformulier in. Na het verzenden ontvang je per e-mail een bevestiging van je melding. Je hoeft geen reden op te geven.</p>
      <div className="demo">In deze preview is het herroepingsformulier uitgeschakeld. In de echte webshop staat het formulier hier.</div>
      <h2>Retourkosten</h2>
      <p>De kosten voor het terugsturen van je bestelling zijn voor eigen rekening. De exacte retourkosten zijn afhankelijk van de vervoerder die je zelf kiest.</p>
      <h2>Terugbetaling</h2>
      <p>Bij een volledige retour ontvang je het aankoopbedrag inclusief de oorspronkelijke standaard verzendkosten terug.</p>
      <p>Wij betalen het verschuldigde bedrag uiterlijk binnen 14 dagen na je retourmelding terug. We mogen wachten met terugbetalen totdat we de producten hebben ontvangen of totdat je hebt aangetoond dat je ze hebt teruggestuurd.</p>
      <h2>Staat van het product</h2>
      <p>Je mag een product bekijken en beoordelen zoals je dat ook in een winkel zou kunnen doen. Gebruik het product niet verder dan nodig is om de aard, kenmerken en werking ervan vast te stellen.</p>
      <p>Verbruiksproducten zoals shampoo, conditioner, haarmaskers, serums en stylingproducten mogen niet daadwerkelijk worden gebruikt als je het volledige aankoopbedrag terug wilt ontvangen.</p>
      <Contact />
    </ServicePage>
  );
}
