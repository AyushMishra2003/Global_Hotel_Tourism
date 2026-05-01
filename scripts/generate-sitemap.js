const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// NOTE: This script assumes you have an API endpoint that lists vendors and cities
// Modify endpoints to match your backend. It runs during build and writes public/sitemap.xml

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) return [];
  return res.json();
}

async function generateSitemap() {
  const baseUrl = 'https://globalhotelsandtourism.com';
  const staticRoutes = [
    '/',
    '/hotels',
    '/vendors',
    '/vendors/event-planners',
    '/allcities',
    '/awards',
    '/current-affairs',
    '/vendor-registration',
    '/join-as-vendor'
  ];

  // Fetch dynamic routes from your API - update these URLs if your API lives under /backend or /api
  const vendors = await fetchJson(`${baseUrl}/backend/get_vendors.php`);
  const cities = await fetchJson(`${baseUrl}/backend/get_cities.php`);
  const blogs = await fetchJson(`${baseUrl}/backend/current_affairs.php`);

  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  staticRoutes.forEach(route => {
    sitemap += `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  if (Array.isArray(vendors)) {
    vendors.forEach(v => {
      // Expect vendor to have slug or id
      const slug = v.slug || (`vendor-${v.id}`);
      sitemap += `  <url>\n    <loc>${baseUrl}/vendor/${slug}</loc>\n    <priority>0.8</priority>\n  </url>\n`;
    });
  }

  if (Array.isArray(cities)) {
    cities.forEach(c => {
      const slug = c.slug || c.city || '';
      if (slug) {
        sitemap += `  <url>\n    <loc>${baseUrl}/city/${slug}</loc>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    });
  }

  if (Array.isArray(blogs)) {
    blogs.forEach(b => {
      const slug = b.slug || b.id || '';
      if (slug) {
        sitemap += `  <url>\n    <loc>${baseUrl}/blog/${slug}</loc>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    });
  }

  sitemap += '</urlset>';

  const outPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outPath, sitemap, 'utf8');
  console.log('Sitemap written to', outPath);
}

generateSitemap().catch(err => {
  console.error('Failed to generate sitemap', err);
  process.exit(1);
});
