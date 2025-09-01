import React from 'react';
import { Helmet } from 'react-helmet-async';

// Schema Markup Component for different types of content
interface SchemaMarkupProps {
  type: 'organization' | 'website' | 'localbusiness' | 'offer' | 'breadcrumb' | 'faq';
  data: Record<string, any>;
}

export const SchemaMarkup: React.FC<SchemaMarkupProps> = ({ type, data }) => {
  const generateSchema = () => {
    const baseContext = "https://schema.org";
    
    switch (type) {
      case 'organization':
        return {
          "@context": baseContext,
          "@type": "Organization",
          "@id": "https://namma-ooru-offers.com/#organization",
          ...data
        };
        
      case 'website':
        return {
          "@context": baseContext,
          "@type": "WebSite",
          "@id": "https://namma-ooru-offers.com/#website",
          ...data
        };
        
      case 'localbusiness':
        return {
          "@context": baseContext,
          "@type": "LocalBusiness",
          ...data
        };
        
      case 'offer':
        return {
          "@context": baseContext,
          "@type": "Offer",
          ...data
        };
        
      case 'breadcrumb':
        return {
          "@context": baseContext,
          "@type": "BreadcrumbList",
          ...data
        };
        
      case 'faq':
        return {
          "@context": baseContext,
          "@type": "FAQPage",
          ...data
        };
        
      default:
        return data;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateSchema())}
      </script>
    </Helmet>
  );
};

// Pre-built schema components for common use cases
export const OrganizationSchema: React.FC = () => (
  <SchemaMarkup 
    type="organization"
    data={{
      "name": "Namma OOru Offers",
      "url": "https://namma-ooru-offers.com",
      "logo": "https://namma-ooru-offers.com/logo.png",
      "description": "Tamil Nadu's premier local deals and offers platform connecting customers with local businesses",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "11.1271",
        "longitude": "78.6569"
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
    }}
  />
);

export const WebsiteSchema: React.FC = () => (
  <SchemaMarkup 
    type="website"
    data={{
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
    }}
  />
);

export default SchemaMarkup;