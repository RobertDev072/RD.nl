import Link from 'next/link';
import { GALLERY, img } from '@/lib/data';
export const metadata = { title: 'Wat is BIAB?' };
export default function Page() {
  return (
    <div className="wrap">
      <nav className="crumbs"><Link href="/">Home</Link><span>/ BIAB</span></nav>
      <div className="biab">
        <article className="prose">
          <span className="eyebrow">BIAB</span>
          <h1>BIAB, je hoort er steeds meer over</h1>
          <p className="lead">Maar wat is dit nou? Wat houdt het in en wat voor voordelen zitten hieraan?</p>
          <p>BIAB is simpel gezegd de afkorting van Builder In A Bottle. Gel in een flesje op basis van rubber met een extreme hechting en wat flexibeler is dan Acryl, maar stukken steviger dan gellac.</p>
          <p>Er zijn ondertussen heel veel merken die ook Gel in a Bottle hebben uitgebracht, het is per salon verschillend met welk merk gewerkt wordt.</p>
          <h2>Wat doet dit product voor je natuurlijke nagel?</h2>
          <p>Met deze gel kan je de natuurlijke nagel opbouwen zodat deze er weer prachtig en natuurlijk uitziet. Het biedt stevigheid en het breken of scheuren van je nagels zal minimaal tot niet zijn.</p>
          <p>Ook zal nagelbijten verleden tijd zijn. Na een aantal behandelingen, zal je ook merken dat je nagels er een mooiere vorm van krijgen en ook steviger zullen zijn.</p>
          <p>Vergeet niet, dat je jouw natuurlijke nagels ook moet blijven verzorgen, dit ondanks dat er een product op zit. Dit doe je door je handen regelmatig in te smeren met een goede handcrème en je nagelriemen dagelijks met nagelriemolie in te masseren. Zo blijft je nagel, nagelriemen en huid rondom je nagels mooi.</p>
          <blockquote className="pull">Geen enkel product zal jouw natuurlijke nagel sterker maken, dit kan alleen van binnen uit. Het product is alleen een hulpmiddel.</blockquote>
          <h2>Correctie nagels</h2>
          <p>Nagels kan je er ook mee corrigeren. Heb je nagels die bijvoorbeeld heel plat zijn, ribbels hebben, naar boven of omlaag groeien, dan kan je dit met BIAB corrigeren.</p>
          <p>Wil je een wat intensere kleur op je nagels? Of Nailart? Er zijn ontelbare mogelijkheden! Gellac blijft zeker 3 tot 4 weken prachtig op je nagels zitten.</p>
          <div className="cta" style={{ marginTop: 22 }}><Link href="/behandelingen/biab-nieuwe-set" className="btn btn-gold">Boek BIAB</Link><Link href="/prijzen" className="btn btn-line">Bekijk prijzen</Link></div>
        </article>
        <aside className="biab-v">{[GALLERY[16], GALLERY[19], GALLERY[22]].map(g => <img key={g} src={img(g, 'width=700')} alt="BIAB nagels" loading="lazy" />)}</aside>
      </div>
    </div>
  );
}
