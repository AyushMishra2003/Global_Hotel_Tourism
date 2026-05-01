// JSON-LD schema helper generators
export interface ArticleSchemaInput {
  title: string;
  description?: string | null;
  authorName?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
  image?: string;
  publisherName?: string;
  publisherLogo?: string;
}

export function articleSchema(input: ArticleSchemaInput): Record<string, unknown> {
  const {
    title,
    description,
    authorName,
    datePublished,
    dateModified,
    url,
    image,
    publisherName = 'Global Hotels & Tourism',
    publisherLogo = 'https://globalhotelsandtourism.com/ght_logo.png'
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: title,
    description: description || undefined,
    image: image ? [image] : undefined,
    author: authorName ? { '@type': 'Person', name: authorName } : undefined,
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: { '@type': 'ImageObject', url: publisherLogo }
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished
  };

  // remove undefined properties in a type-safe way
  const _s = schema as Record<string, unknown>;
  Object.keys(_s).forEach(k => _s[k] === undefined && delete _s[k]);
  return schema;
}

export interface LocalBusinessSchemaInput {
  name: string;
  description?: string;
  url?: string;
  telephone?: string;
  addressLocality?: string;
  addressRegion?: string;
  postalCode?: string;
  streetAddress?: string;
  image?: string;
  sameAs?: string[];
}

export function localBusinessSchema(input: LocalBusinessSchemaInput): Record<string, unknown> {
  const {
    name,
    description,
    url,
    telephone,
    addressLocality,
    addressRegion,
    postalCode,
    streetAddress,
    image,
    sameAs
  } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    description,
    url,
    telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality,
      addressRegion,
      postalCode
    },
    image: image ? [image] : undefined,
    sameAs: sameAs && sameAs.length ? sameAs : undefined
  };

  // remove undefined properties in a type-safe way
  const _lb = schema as Record<string, unknown>;
  Object.keys(_lb).forEach(k => _lb[k] === undefined && delete _lb[k]);
  return schema;
}

export interface HotelSchemaInput {
  name: string;
  description?: string;
  url?: string;
  starRating?: number | string;
  addressLocality?: string;
  telephone?: string;
  image?: string;
}

export function hotelSchema(input: HotelSchemaInput): Record<string, unknown> {
  const { name, description, url, starRating, addressLocality, telephone, image } = input;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name,
    description,
    url,
    address: { '@type': 'PostalAddress', addressLocality },
    telephone,
    starRating: starRating ? { '@type': 'Rating', ratingValue: Number(starRating) } : undefined,
    image: image ? [image] : undefined
  };

  // remove undefined properties in a type-safe way
  const _h = schema as Record<string, unknown>;
  Object.keys(_h).forEach(k => _h[k] === undefined && delete _h[k]);
  return schema;
}

export function breadcrumbSchema(items: { position: number; name: string; item: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(i => ({ '@type': 'ListItem', position: i.position, name: i.name, item: i.item }))
  };
}
