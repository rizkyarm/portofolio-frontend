import { Helmet } from 'react-helmet-async';

/**
 * @param {Object} props
 * @param {string} props.title 
 * @param {string} [props.description] 
 * @param {string} [props.path] 
 * @param {string} [props.image]
 * @param {string} [props.type]
 */
export default function SEO({
  title,
  description = 'Creative Developer & Digital Creator — Portfolio of Rizki Aditiya Ramadan. Specializing in Web Development, Android Apps, Video Production, and UI/UX Design.',
  path = '',
  image = null,
  type = 'website',
}) {
  const siteTitle = 'Rizki Aditiya Ramadan';
  const fullTitle = title ? `${title} — ${siteTitle}` : siteTitle;
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://portofolio-sigma-three-11.vercel.app';
  const canonicalUrl = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/og-image.png`;

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
    </Helmet>
  );
}
