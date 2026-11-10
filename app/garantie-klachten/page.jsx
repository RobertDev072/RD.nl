import ServicePage, { Contact } from '@/components/ServicePage';
export const metadata = { title: 'Garantie & klachten' };
export default function Page() {
  return (
    <ServicePage path="/garantie-klachten" title="Garantie & klachten">
      <h2>Garantie</h2>
      <p>We vinden het belangrijk dat je een product ontvangt dat in goede staat is en doet wat je er redelijkerwijs van mag verwachten.</p>
      <p>Op onze producten is de wettelijke garantie van toepassing. Dit betekent dat een product moet voldoen aan wat je er bij normaal gebruik redelijkerwijs van mag verwachten. In Nederland geldt hiervoor geen vaste wettelijke garantietermijn; dit hangt onder andere af van het soort product, de prijs en het normale gebruik.</p>
      <p>Is een product beschadigd, defect of voldoet het niet aan wat je ervan mocht verwachten? Neem dan contact met ons op. We bekijken wat er aan de hand is en zorgen waar nodig voor een passende oplossing, zoals reparatie, vervanging of een andere oplossing volgens de wettelijke garantieregels.</p>
      <p>Garantie geldt niet wanneer een probleem is ontstaan door verkeerd gebruik, beschadiging door de gebruiker of normale slijtage.</p>
      <Contact />
    </ServicePage>
  );
}
