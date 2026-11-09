import type { MetadataRoute } from 'next';
import { projects, services } from '@/lib/content';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = ['', '/diensten', '/projecten', '/automatisering', '/over', '/contact'];
  return [
    ...routes.map((r) => ({ url: `${site.url}${r}`, lastModified: now, priority: r === '' ? 1 : 0.8 })),
    ...services.map((s) => ({ url: `${site.url}/diensten/${s.slug}`, lastModified: now, priority: 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}/projecten/${p.slug}`, lastModified: now, priority: 0.6 }))
  ];
}
