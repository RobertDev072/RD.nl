'use client';
import Link from 'next/link';
import { eur } from '@/lib/format';
import { sq, fromPrice } from '@/lib/data';
import { useShop } from './ShopProvider';
import { Icon, Img } from './ui';

export default function TreatmentCard({ t }) {
  const { add, has } = useShop();
  const href = `/behandelingen/${t.slug}`;
  const chosen = has('treatment', t.slug);
  const onAdd = () => add({ kind: 'treatment', id: t.slug, slug: t.slug, name: t.name, opt: '', price: t.price, img: t.img ? sq(t.img, 300) : null });
  return (
    <article className={`tcard ${t.noimg ? 'noimg' : ''}`}>
      <Link href={href} className="timg" tabIndex={-1} aria-label={t.name}>
        {t.noimg ? <span className="tmono"><span>{t.name.split(' ')[0]}</span></span> : <Img src={sq(t.img, 600)} alt={t.name} />}
        {t.popular && <span className="tbadge">Populair</span>}
      </Link>
      <div className="tb">
        <Link href={href} className="tn">{t.name}</Link>
        <p>{t.short}</p>
        <div className="tbot">
          <span className="tprice">{t.variants ? <><small>vanaf</small> {eur(fromPrice(t))}</> : eur(t.price)}</span>
          {t.variants
            ? <Link href={href} className="tadd" aria-label={`Kies ${t.name}`}>Kies {Icon.arrow(15)}</Link>
            : <button className={`tadd ${chosen ? 'on' : ''}`} onClick={onAdd} disabled={chosen}>{chosen ? <>{Icon.check(15)} Gekozen</> : <>{Icon.plus(15)} Kies</>}</button>}
        </div>
      </div>
    </article>
  );
}
