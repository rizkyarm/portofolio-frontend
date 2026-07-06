import { Helmet } from 'react-helmet-async';

/**
 * @param {Object} props
 * @param {string} props.title 
 * @param {string} [props.description] 
 * @param {string} [props.path] 
 * @param {string} [props.image]
 * @param {string} [props.type]
 * @param {Object} [props.jsonLd]
 */
export default function SEO({
  title,
  description = 'Creative Developer & Digital Creator — Portfolio of Rizki Aditiya Ramadan. Specializing in Web Development, Android Apps, Video Production, and UI/UX Design.',
  path = '',
  image = null,
  type = 'website',
  jsonLd = null,
}) {
  const siteTitle = 'Rizki Aditiya Ramadan';
  const fullTitle = title ? `${title} — ${siteTitle}` : siteTitle;
  const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://rizkiaditiyar.vercel.app').replace(/\/+$/, '');
  const canonicalUrl = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/og-image.png`;

  // ── JSON-LD: default Person + WebSite ──
  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: 'Rizki Aditiya Ramadan',
        url: siteUrl,
        jobTitle: 'Creative Developer',
        description: description,
        sameAs: [
          'https://github.com/rizkiaditiyar',
          'https://linkedin.com/in/rizkiaditiyar',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: siteTitle,
        description: description,
        publisher: { '@id': `${siteUrl}/#person` },
      },
      {
        '@type': 'WebPage',
        '@id': canonicalUrl,
        url: canonicalUrl,
        name: fullTitle,
        description: description,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#person` },
      },
    ],
  };

  const ld = jsonLd || defaultJsonLd;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteTitle} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="robots" content="index, follow" />
      <meta name="author" content={siteTitle} />

      <script type="application/ld+json">{JSON.stringify(ld)}</script>
    </Helmet>
  );
}
