import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'local.business';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  structuredData?: Record<string, any>;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = "Namma OOru Offers - Your Local Savings Hub | Tamil Nadu",
  description = "Discover amazing deals and offers from local shops across Tamil Nadu. Save money while supporting local businesses with Namma OOru Offers.",
  keywords = "Tamil Nadu offers, local deals, coupons Chennai, discounts Coimbatore, Madurai offers, Salem deals, local shops Tamil Nadu, South India coupons, merchant offers, customer savings",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  url = "https://namma-ooru-offers.com",
  type = "website",
  author = "Namma OOru Offers",
  publishedTime,
  modifiedTime,
  structuredData,
  canonical
}) => {
  const fullTitle = title.includes('Namma OOru Offers') ? title : `${title} | Namma OOru Offers`;
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : url);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="Namma OOru Offers" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="ta_IN" />
      
      {/* Article specific tags */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content={author} />
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@namma_offers" />
      <meta name="twitter:creator" content="@namma_offers" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#0066ff" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Namma OOru Offers" />

      {/* Geo Tags for Tamil Nadu */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Tamil Nadu, India" />
      <meta name="geo.position" content="11.1271;78.6569" />
      <meta name="ICBM" content="11.1271, 78.6569" />

      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-IN" />
      <link rel="alternate" hrefLang="en-in" href={currentUrl} />
      <link rel="alternate" hrefLang="ta-in" href={currentUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;