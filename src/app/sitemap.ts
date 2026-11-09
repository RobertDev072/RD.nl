import type { MetadataRoute } from 'next';
import { projects, services } from '@/lib/content';
import { getArticles } from '@/lib/kennisbank';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const articles = getArticles();
  const routes: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['', 1, 'weekly'],
    ['/diensten', 0.9, 'monthly'],
    ['/kennisbank', 0.8, 'weekly'],
    ['/projecten', 0.8, 'monthly'],
    ['/automatisering', 0.8, 'monthly'],
    ['/over', 0.7, 'monthly'],
    ['/contact', 0.7, 'yearly']
  ];
  return [
    ...routes.map(([r, priority, changeFrequency]) => ({ url: `${site.url}${r}`, lastModified: now, changeFrequency, priority })),
    ...services.map((s) => ({ url: `${site.url}/diensten/${s.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.9 })),
    ...articles.map((a) => ({ url: `${site.url}/kennisbank/${a.slug}`, lastModified: new Date((a.updated || a.date) + 'T12:00:00'), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...projects.map((p) => ({ url: `${site.url}/projecten/${p.slug}`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.6 }))
  ];
}
