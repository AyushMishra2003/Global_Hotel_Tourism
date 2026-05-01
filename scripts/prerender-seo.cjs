/**
 * prerender-seo.cjs
 * Runs after `vite build`.
 * For each known route, fetches SEO from WP API and writes a dist/<route>/index.html
 * with the correct <title>, meta description, og:*, twitter:* baked in.
 * Crawlers / view-source will now see real meta tags without needing JS.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');
const http  = require('http');

const DIST        = path.resolve(__dirname, '../dist');
const BASE_HTML   = path.join(DIST, 'index.html');
const SEO_API     = 'https://globalhotelsandtourism.com/seo/wp-json/seo/v1';
const SITE_URL    = 'https://globalhotelsandtourism.com';

// All static routes
const ROUTES = [
  { route: '/',                  slug: '/home' },
  { route: '/hotels',            slug: '/hotels' },
  { route: '/all-hotels',        slug: '/hotels' },
  { route: '/vendors',           slug: '/vendor' },
  { route: '/awards',            slug: '/awards' },
  { route: '/current-affairs',   slug: '/current-affairs' },
  { route: '/blogs',             slug: '/blogs' },
  { route: '/AllCities',         slug: '/global-page' },
  { route: '/premier-destinations-DL-UK', slug: '/global-page' },
  { route: '/join-as-vendor',    slug: '/global-page' },
  { route: '/privacy-policy',    slug: '/global-page' },
  { route: '/disclaimer',        slug: '/global-page' },
];

function fetch(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) { resolve(null); return; }
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function getSEO(slug) {
  const bare = slug.startsWith('/') ? slug.slice(1) : slug;

  // Correct endpoint: /wp-json/seo/v1/page/{slug-without-slash}
  const data = await fetch(`${SEO_API}/page/${encodeURIComponent(bare)}`);
  const seo  = Array.isArray(data) ? data[0] : data;
  if (seo && seo.meta_title) return seo;

  // fallback to global-page
  if (slug !== '/global-page') return getSEO('/global-page');
  return {};
}

function escape(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHead(seo, route) {
  const title       = escape(seo.meta_title)       || 'Global Hotels &amp; Tourism';
  const desc        = escape(seo.meta_description)  || '';
  const keywords    = escape(seo.meta_keywords)     || '';
  const ogTitle     = escape(seo.og_title)          || title;
  const ogDesc      = escape(seo.og_description)    || desc;
  const ogImage     = seo.og_image && seo.og_image.startsWith('http')
                        ? escape(seo.og_image)
                        : `${SITE_URL}/ght_logo.png`;
  const ogType      = escape(seo.og_type)           || 'website';
  const twCard      = escape(seo.twitter_card)      || 'summary_large_image';
  const twTitle     = escape(seo.twitter_title)     || ogTitle;
  const twDesc      = escape(seo.twitter_description) || ogDesc;
  const twImage     = seo.twitter_image && seo.twitter_image.startsWith('http')
                        ? escape(seo.twitter_image)
                        : ogImage;
  const canonical   = seo.canonical_url             || `${SITE_URL}${route}`;
  const robots      = `${seo.index_status || 'index'}, ${seo.follow_status || 'follow'}`;
  const author      = escape(seo.author)            || 'Global Hotels &amp; Tourism';
  const lang        = seo.language                  || 'en';

  return `
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta name="keywords" content="${keywords}" />
    <meta name="author" content="${author}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDesc}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:site_name" content="Global Hotels &amp; Tourism" />
    <meta name="twitter:card" content="${twCard}" />
    <meta name="twitter:title" content="${twTitle}" />
    <meta name="twitter:description" content="${twDesc}" />
    <meta name="twitter:image" content="${twImage}" />
    <meta name="twitter:site" content="@globalhotelsandtourism" />`.trim();
}

async function run() {
  if (!fs.existsSync(BASE_HTML)) {
    console.error('❌  dist/index.html not found — run `npm run build` first');
    process.exit(1);
  }

  // Copy .htaccess into dist/ so Apache serves SPA routes correctly
  const htaccessSrc = path.resolve(__dirname, '../public/.htaccess');
  const htaccessDst = path.join(DIST, '.htaccess');
  if (fs.existsSync(htaccessSrc)) {
    fs.copyFileSync(htaccessSrc, htaccessDst);
    console.log('✅  Copied .htaccess to dist/');
  }

  const baseHtml = fs.readFileSync(BASE_HTML, 'utf8');

  // Strip any existing <title> and static meta tags from base html
  const stripped = baseHtml
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta name="description"[^>]*>/gi, '')
    .replace(/<meta name="keywords"[^>]*>/gi, '')
    .replace(/<meta name="author"[^>]*>/gi, '')
    .replace(/<meta name="robots"[^>]*>/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '')
    .replace(/<meta property="og:[^>]*>/gi, '')
    .replace(/<meta name="twitter:[^>]*>/gi, '');

  for (const { route, slug } of ROUTES) {
    console.log(`⏳  ${route}  →  slug: ${slug}`);
    const seo  = await getSEO(slug);
    const head = buildHead(seo, route);

    // Inject after <head>
    const html = stripped.replace('<head>', `<head>\n    ${head}`);

    // Write to dist/<route>/index.html
    const dir = route === '/'
      ? DIST
      : path.join(DIST, ...route.split('/').filter(Boolean));

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`✅  Written: ${path.join(dir, 'index.html')}`);
  }

  console.log('\n🎉  Prerender complete!');
}

run().catch(err => { console.error(err); process.exit(1); });
