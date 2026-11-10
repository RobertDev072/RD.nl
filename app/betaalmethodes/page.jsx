import ServicePage, { Contact } from '@/components/ServicePage';
export const metadata = { title: 'Betaalmethodes' };
export default function Page() {
  return (
    <ServicePage path="/betaalmethodes" title="Betaalmethodes">
      <p>Bij JeHaarwinkel kun je veilig betalen via Mollie. Tijdens het afrekenen kies je zelf de betaalmethode die bij je past.</p>
      <div className="paygrid">
        <div><b>iDEAL | Wero</b><p>Betaal direct en veilig via je eigen bank. Na een geslaagde betaling ontvangen wij direct een bevestiging en kunnen we je bestelling verwerken.</p></div>
        <div><b>Creditcard en debitcard</b><p>Je kunt betalen met ondersteunde creditcards en debitcards. De betaling wordt veilig verwerkt via Mollie.</p></div>
        <div><b>Klarna</b><p>Met Klarna kun je gebruikmaken van de beschikbare betaalmogelijkheden van Klarna, zoals achteraf betalen wanneer deze optie voor jouw bestelling beschikbaar is.</p></div>
        <div><b>Bancontact</b><p>Klanten met een Belgische bankrekening kunnen betalen via Bancontact. De betaling wordt veilig verwerkt via je eigen bankomgeving.</p></div>
      </div>
      <h2>Veilig betalen</h2>
      <p>Onze betalingen worden verwerkt via Mollie. Je betaalgegevens worden niet rechtstreeks door JeHaarwinkel opgeslagen.</p>
      <p>Heb je een vraag over een betaling of is er iets misgegaan tijdens het afrekenen? Neem dan contact met ons op.</p>
      <Contact />
    </ServicePage>
  );
}
