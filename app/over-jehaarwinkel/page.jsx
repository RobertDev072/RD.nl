import ServicePage, { Contact } from '@/components/ServicePage';
import { SITE } from '@/lib/format';
export const metadata = { title: 'Over JeHaarwinkel' };
export default function Page() {
  return (
    <ServicePage path="/over-jehaarwinkel" title="Over JeHaarwinkel" eyebrow="Over ons">
      <p>JeHaarwinkel.nl is een Nederlandse webshop voor professionele haarverzorging, styling en kleurproducten. Vanuit Alkmaar leveren we haarproducten aan klanten in heel Nederland en België.</p>
      <p>Het assortiment is samengesteld met kennis van professionele haarproducten en ervaring uit de kapperspraktijk. Daardoor kijken we niet alleen naar wat een product belooft, maar vooral naar voor welk haar het geschikt is, wat het doet en hoe je het op de juiste manier gebruikt.</p>
      <h2>Professionele haarproducten met duidelijke uitleg</h2>
      <p>Een goed haarproduct kiezen is niet altijd eenvoudig. Shampoo, verzorging en styling moeten passen bij je haartype, haarconditie en het resultaat dat je wilt bereiken.</p>
      <p>Daarom willen we bij JeHaarwinkel producten zo duidelijk mogelijk uitleggen. Geen ingewikkelde verkooppraat, maar praktische informatie over wat een product doet, voor wie het geschikt is en hoe je het gebruikt.</p>
      <p>Een belangrijk deel van ons assortiment bestaat uit professionele haarproducten van Artistique. Met deze producten is veel praktijkervaring opgebouwd, waardoor we gericht kunnen adviseren over de verschillende lijnen en toepassingen.</p>
      <h2>Persoonlijke service</h2>
      <p>Heb je een vraag over een product of twijfel je welke keuze bij jouw haar past? Dan kun je contact opnemen via e-mail of WhatsApp. We proberen vragen zo duidelijk en praktisch mogelijk te beantwoorden.</p>
      <Contact />
      <h2>JeHaarwinkel.nl</h2>
      <p>JeHaarwinkel.nl wordt geëxploiteerd door:<br />{SITE.company}<br />{SITE.street}<br />{SITE.zip}<br />Nederland<br />KvK: {SITE.kvk}<br />BTW: {SITE.btw}</p>
    </ServicePage>
  );
}
