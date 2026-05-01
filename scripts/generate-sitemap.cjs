const fs = require('fs');
const path = require('path');
const https = require('https');

function fetchJson(url) {
  return new Promise((resolve) => {
    try {
      https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const parsed = JSON.parse(data);
            resolve(Array.isArray(parsed) ? parsed : []);
          } catch (e) {
            resolve([]);
          }
        });
      }).on('error', () => resolve([]));
    } catch (e) {
      resolve([]);
    }
  });
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

  // Use backend endpoints relative to production domain. If your API is hosted under a subpath, change accordingly.
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
