import ServicePage, { Contact } from '@/components/ServicePage';
export const metadata = { title: 'Verzending & bezorgen' };
export default function Page() {
  return (
    <ServicePage path="/verzending" title="Verzending & bezorgen">
      <h2>Levertijd</h2>
      <p>We doen ons best om je bestelling zo snel mogelijk te verzenden. Bestel je op een werkdag vóór 16:00 uur, dan proberen we je bestelling dezelfde dag nog te verzenden.</p>
      <p>Is een product niet direct op voorraad of kunnen we de verwachte levertijd niet halen? Dan laten we je dit zo snel mogelijk weten.</p>
      <table className="infotable"><thead><tr><th>Land</th><th>Verzendkosten</th><th>Gratis vanaf</th><th>Bezorging</th></tr></thead>
        <tbody><tr><td>Nederland</td><td>€ 4,89</td><td>€ 30</td><td>Doorgaans de eerstvolgende werkdag</td></tr><tr><td>België</td><td>€ 8,99</td><td>€ 75</td><td>Doorgaans binnen twee werkdagen</td></tr></tbody></table>
      <h2>Verzending binnen Nederland</h2>
      <p>Bestellingen binnen Nederland worden verzonden met PostNL. Na verzending wordt een bestelling doorgaans de eerstvolgende werkdag bezorgd. De exacte bezorgtijd is afhankelijk van PostNL.</p>
      <h2>Verzending naar België</h2>
      <p>Bestellingen naar België worden verzonden met PostNL. Na verzending wordt een bestelling doorgaans binnen twee werkdagen bezorgd. De exacte bezorgtijd is afhankelijk van PostNL.</p>
      <h2>Is er iets mis met de bezorging?</h2>
      <p>Is je bestelling vertraagd, beschadigd aangekomen of lijkt er iets anders mis te zijn met de bezorging? Neem dan contact met ons op. We kijken graag met je mee.</p>
      <Contact />
    </ServicePage>
  );
}
