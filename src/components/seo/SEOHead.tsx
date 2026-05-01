import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: object | null;
  // Extended fields from WP API
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  robots?: string;        // e.g. "index, follow"
  author?: string;
  language?: string;
}

export default function SEOHead({
  title = 'Global Hotels & Tourism',
  description = 'Top Wedding Venue, Top Wedding Planner, Indian Wedding Destination Venue, Luxury Wedding Planners in India',
  keywords = 'wedding venues, event planners, hotels, tourism, luxury destinations',
  image = '/ght_logo.png',
  url = 'https://globalhotelsandtourism.com',
  type = 'website',
  schema = null,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonical,
  robots,
  author,
  language = 'en',
}: SEOHeadProps) {
  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDesc = ogDescription || description;
  const resolvedOgImage = ogImage || `https://globalhotelsandtourism.com${image}`;
  const resolvedTwitterTitle = twitterTitle || resolvedOgTitle;
  const resolvedTwitterDesc = twitterDescription || resolvedOgDesc;
  const resolvedTwitterImage = twitterImage || resolvedOgImage;
  const resolvedCanonical = canonical || url;

  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {author && <meta name="author" content={author} />}
      {robots && <meta name="robots" content={robots} />}
      <link rel="canonical" href={resolvedCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={resolvedOgTitle} />
      <meta property="og:description" content={resolvedOgDesc} />
      <meta property="og:image" content={resolvedOgImage} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={resolvedTwitterTitle} />
      <meta name="twitter:description" content={resolvedTwitterDesc} />
      <meta name="twitter:image" content={resolvedTwitterImage} />

      {/* Schema.org JSON-LD */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  );
}
