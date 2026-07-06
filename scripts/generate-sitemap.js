/**
 * Generate sitemap.xml saat build
 * Mengambil data projects dari API backend
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// config
const SITE_URL = process.env.VITE_SITE_URL || 'https://rizkiaditiyar.vercel.app';
const API_URL  = process.env.VITE_API_URL  || 'https://rizkiaditiyar-backend.my.id/api/v1';
const OUTPUT   = path.resolve(__dirname, '..', 'public', 'sitemap.xml');

const staticPages = [
  { loc: '/',          priority: 1.0 },
  { loc: '/about',     priority: 0.8 },
  { loc: '/projects',  priority: 0.9 },
  { loc: '/services',  priority: 0.8 },
  { loc: '/contact',   priority: 0.7 },
];

async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) return [];
    const json = await res.json();
    const projects = json.data?.data || json.data || [];
    return projects.filter(p => p.slug);
  } catch {
    console.warn('[sitemap] Gagal fetch projects dari API, hanya halaman statis');
    return [];
  }
}

function buildXml(pages) {
  const urls = pages.map(p => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${p.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${p.priority}</priority>
  </url>`);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

async function main() {
  const projects = await fetchProjects();

  const allPages = [
    ...staticPages,
    ...projects.map(p => ({
      loc: `/projects/${p.slug}`,
      priority: 0.7,
      lastmod: p.updated_at || p.created_at || undefined,
    })),
  ];

  const xml = buildXml(allPages);
  fs.writeFileSync(OUTPUT, xml, 'utf-8');
  console.log(`[sitemap] ✅ Generated sitemap.xml — ${allPages.length} URLs`);
}

main().catch(err => {
  console.error('[sitemap] Error:', err.message);
  process.exit(1);
});
