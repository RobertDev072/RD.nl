import { SITE } from '@/lib/format';

// Het echte JeHaarwinkel-logo, rechtstreeks van jehaarwinkel.nl
export default function Logo({ h = 30, light = false, priority = false }) {
  return (
    <img
      className={`logo-img ${light ? 'light' : ''}`}
      src={SITE.logo}
      srcSet={SITE.logoSet}
      sizes={`${Math.round(h * 4.7)}px`}
      alt="JeHaarwinkel"
      width={Math.round(h * 4.7)}
      height={h}
      style={{ height: h, width: 'auto' }}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
