import { useState, useEffect } from 'react';

// Try these endpoint patterns — the correct one will return 200
const SEO_API_BASE = 'https://globalhotelsandtourism.com/seo/wp-json/seo/v1';

export interface PageSEO {
  page_slug: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  index_status?: 'index' | 'noindex';
  follow_status?: 'follow' | 'nofollow';
  schema_type?: string;
  focus_keyword?: string;
  author?: string;
  language?: string;
}

const cache: Record<string, PageSEO | null> = {};

function isValid(seo: PageSEO | null): seo is PageSEO {
  return !!seo && !!seo.meta_title;
}

// Correct pattern: /wp-json/seo/v1/page/{slug-without-leading-slash}
async function fetchSEO(slug: string): Promise<PageSEO | null> {
  if (slug in cache) return cache[slug];
  const bare = slug.startsWith('/') ? slug.slice(1) : slug;
  try {
    const res = await fetch(`${SEO_API_BASE}/page/${encodeURIComponent(bare)}`);
    if (!res.ok) { cache[slug] = null; return null; }
    const data = await res.json();
    const result: PageSEO = Array.isArray(data) ? data[0] : data;
    cache[slug] = result || null;
    return cache[slug];
  } catch {
    cache[slug] = null;
    return null;
  }
}

export async function resolveSEO(pageSlug: string): Promise<PageSEO | null> {
  const specific = await fetchSEO(pageSlug);
  if (isValid(specific)) return specific;
  const global = await fetchSEO('/global-page');
  if (isValid(global)) return global;
  return null;
}

export function useSEO(pageSlug: string) {
  const [seo, setSeo] = useState<PageSEO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    resolveSEO(pageSlug).then(data => {
      if (!cancelled) { setSeo(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [pageSlug]);

  return { seo, loading };
}
