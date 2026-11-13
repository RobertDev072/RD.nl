import { notFound } from 'next/navigation';
import { PRODUCTS, bySlug } from '@/lib/data';
import Buy from './Buy';
export const generateStaticParams = () => PRODUCTS.map(p => ({ slug: p.slug }));
export async function generateMetadata({ params }) { const p = bySlug((await params).slug); return { title: p ? `${p.name} · BellaMina` : 'BellaMina' }; }
export default async function Page({ params }) { const p = bySlug((await params).slug); if (!p) notFound(); return <Buy p={p} />; }
