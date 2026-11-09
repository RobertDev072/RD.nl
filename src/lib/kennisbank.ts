import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

/**
 * Kennisbank-artikelen staan als markdown in /content/kennisbank/<slug>.md.
 * Bovenaan elk bestand staat frontmatter:
 *
 * ---
 * title: Wat kost een website laten maken in 2026?
 * description: Korte samenvatting voor Google (max ~155 tekens).
 * date: 2026-11-09
 * keyword: wat kost een website laten maken
 * category: Websites
 * service: websites-laten-maken
 * ---
 */
export type Article = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  keyword: string;
  category: string;
  service?: string;
  html: string;
  headings: { id: string; text: string }[];
  words: number;
  minutes: number;
};

const DIR = path.join(process.cwd(), 'content', 'kennisbank');

const slugify = (t: string) =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function parse(file: string): Article {
  const raw = fs.readFileSync(path.join(DIR, file), 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error(`Frontmatter ontbreekt in ${file}`);
  const meta: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
  }
  const body = m[2].trim();
  const headings: Article['headings'] = [];
  const renderer = new marked.Renderer();
  renderer.heading = ({ tokens, depth }) => {
    const text = tokens.map((t) => ('text' in t ? t.text : '')).join('');
    const id = slugify(text);
    if (depth === 2) headings.push({ id, text });
    return `<h${depth} id="${id}">${marked.parseInline(text)}</h${depth}>`;
  };
  const html = marked.parse(body, { renderer, async: false }) as string;
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug: file.replace(/\.md$/, ''),
    title: meta.title,
    description: meta.description,
    date: meta.date,
    updated: meta.updated || undefined,
    keyword: meta.keyword || '',
    category: meta.category || 'Kennisbank',
    service: meta.service || undefined,
    html,
    headings,
    words,
    minutes: Math.max(2, Math.round(words / 220))
  };
}

export function getArticles(): Article[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') && !f.startsWith('_'))
    .map(parse)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const getArticle = (slug: string) => getArticles().find((a) => a.slug === slug);

export const formatDate = (d: string) =>
  new Date(d + 'T12:00:00').toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
