import { SITE } from '@/lib/data';
// Het echte logo van House of Nails by Jasmina (goud, transparant)
export default function Logo({ h = 46, priority }) {
  return <img className="logo" src={SITE.logo} alt="House of Nails by Jasmina" height={h} width={Math.round(h * 2.89)} style={{ height: h, width: 'auto' }} loading={priority ? 'eager' : 'lazy'} decoding="async" />;
}
