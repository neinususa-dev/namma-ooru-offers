// SEO utility functions for dynamic content

export interface OfferSEOData {
  id: string;
  title: string;
  description: string;
  shopName: string;
  discount: string;
  location: string;
  district: string;
  category: string;
  image?: string;
  expiryDate: string;
}

export interface MerchantSEOData {
  name: string;
  location: string;
  district: string;
  category: string;
  totalOffers: number;
}

// Generate SEO-optimized title for offers
export const generateOfferTitle = (offer: OfferSEOData): string => {
  return `${offer.discount} ${offer.title} at ${offer.shopName} in ${offer.location} | Namma OOru Offers`;
};

// Generate SEO-optimized description for offers
export const generateOfferDescription = (offer: OfferSEOData): string => {
  return `Save with ${offer.discount} on ${offer.title} at ${offer.shopName} in ${offer.location}, ${offer.district}. Limited time offer expires ${offer.expiryDate}. Book now!`;
};

// Generate SEO-optimized keywords for offers
export const generateOfferKeywords = (offer: OfferSEOData): string => {
  const baseKeywords = [
    `${offer.category} offers ${offer.location}`,
    `${offer.shopName} deals`,
    `${offer.district} discounts`,
    `${offer.location} coupons`,
    'Tamil Nadu offers',
    'local deals',
    'discount coupons',
    'save money'
  ];
  
  return baseKeywords.join(', ');
};

// Generate structured data for offers (Local Business + Offer)
export const generateOfferStructuredData = (offer: OfferSEOData) => {
  const currentDate = new Date().toISOString();
  const expiryDate = new Date(offer.expiryDate).toISOString();
  
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `https://namma-ooru-offers.com/merchant/${offer.shopName.toLowerCase().replace(/\s+/g, '-')}`,
        "name": offer.shopName,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": offer.location,
          "addressRegion": offer.district,
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "11.1271",
          "longitude": "78.6569"
        },
        "url": "https://namma-ooru-offers.com",
        "telephone": "+91-XXX-XXXXXXX",
        "priceRange": "$$",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Current Offers",
          "itemListElement": [
            {
              "@type": "Offer",
              "name": offer.title,
              "description": offer.description,
              "seller": {
                "@id": `https://namma-ooru-offers.com/merchant/${offer.shopName.toLowerCase().replace(/\s+/g, '-')}`
              },
              "validFrom": currentDate,
              "validThrough": expiryDate,
              "availability": "https://schema.org/InStock",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "INR"
              }
            }
          ]
        }
      },
      {
        "@type": "WebPage",
        "@id": `https://namma-ooru-offers.com/offer/${offer.id}`,
        "url": `https://namma-ooru-offers.com/offer/${offer.id}`,
        "name": generateOfferTitle(offer),
        "description": generateOfferDescription(offer),
        "isPartOf": {
          "@id": "https://namma-ooru-offers.com"
        },
        "about": {
          "@id": `https://namma-ooru-offers.com/merchant/${offer.shopName.toLowerCase().replace(/\s+/g, '-')}`
        }
      }
    ]
  };
};

// Generate structured data for the main website
export const generateWebsiteStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://namma-ooru-offers.com/#website",
    "url": "https://namma-ooru-offers.com",
    "name": "Namma OOru Offers",
    "alternateName": "Namma Offers",
    "description": "Discover amazing deals and offers from local shops across Tamil Nadu. Save money while supporting local businesses.",
    "publisher": {
      "@id": "https://namma-ooru-offers.com/#organization"
    },
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://namma-ooru-offers.com/?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ]
  };
};

// Generate organization structured data
export const generateOrganizationStructuredData = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://namma-ooru-offers.com/#organization",
    "name": "Namma OOru Offers",
    "url": "https://namma-ooru-offers.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://namma-ooru-offers.com/logo.png",
      "width": "300",
      "height": "100"
    },
    "description": "Tamil Nadu's premier local deals and offers platform connecting customers with local businesses",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@namma-ooru-offers.com"
    },
    "sameAs": [
      "https://www.facebook.com/nammaoffers",
      "https://www.twitter.com/namma_offers",
      "https://www.instagram.com/nammaoffers",
      "https://www.linkedin.com/company/namma-offers"
    ],
    "foundingDate": "2024",
    "areaServed": {
      "@type": "State",
      "name": "Tamil Nadu"
    }
  };
};

// Generate breadcrumb structured data
export const generateBreadcrumbStructuredData = (breadcrumbs: Array<{name: string; url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  };
};

// Generate FAQ structured data
export const generateFAQStructuredData = (faqs: Array<{question: string; answer: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

// Generate location-based structured data for city/district pages
export const generateLocationStructuredData = (location: string, district: string, totalOffers: number) => {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": `${location}, ${district}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": location,
      "addressRegion": district,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "11.1271",
      "longitude": "78.6569"
    },
    "description": `Discover ${totalOffers}+ exclusive deals and offers from local businesses in ${location}, ${district}. Save money while supporting local merchants.`,
    "url": `https://namma-ooru-offers.com/location/${district.toLowerCase()}/${location.toLowerCase()}`,
    "containsPlace": {
      "@type": "LocalBusiness",
      "name": "Local Merchants",
      "description": `Various local businesses offering deals in ${location}`
    }
  };
};

// SEO-friendly URL generator
export const generateSEOUrl = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Generate meta tags for social sharing
export const generateSocialMetaTags = (
  title: string,
  description: string,
  image: string,
  url: string
) => {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      url,
      site_name: 'Namma OOru Offers',
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@namma_offers',
      site: '@namma_offers',
    },
  };
};