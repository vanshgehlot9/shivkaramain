"use client";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shivkara Digitals",
  "alternateName": ["Shivkara Digital", "SD"],
  "url": "https://shivkaradigital.com",
  "logo": "https://shivkaradigital.com/logo.jpeg",
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "telephone": "+91-9521699090",
      "contactType": "customer service",
      "availableLanguage": ["English", "Hindi"],
      "areaServed": ["IN", "US", "GB", "AU", "CA"]
    }
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shivkara Digitals",
    "addressLocality": "Jodhpur",
    "addressRegion": "Rajasthan",
    "postalCode": "342001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 26.2389,
    "longitude": 73.0243
  },
  "sameAs": [
    "https://instagram.com/shivkaradigital",
    "https://linkedin.com/company/shivkara-digitals"
  ],
  "founder": {
    "@type": "Person",
    "name": "Shivkara Digitals Team"
  },
  "foundingDate": "2020",
  "numberOfEmployees": "10-50",
  "knowsAbout": [
    "Software Development",
    "Mobile App Development", 
    "Web Development",
    "Digital Transformation",
    "Cloud Solutions",
    "E-commerce Development"
  ]
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Shivkara Digitals",
  "image": "https://shivkaradigital.com/logo.jpeg",
  "telephone": "+91-9521699090",
  "email": "info@shivkaradigital.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Shivkara Digitals",
    "addressLocality": "Jodhpur", 
    "addressRegion": "Rajasthan",
    "postalCode": "342001",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates", 
    "latitude": 26.2389,
    "longitude": 73.0243
  },
  "url": "https://shivkaradigital.com",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification", 
      "dayOfWeek": "Saturday",
      "opens": "10:00",
      "closes": "16:00"
    }
  ],
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Rajesh Kumar"
      },
      "reviewBody": "Excellent software development services. Delivered our e-commerce platform on time and within budget."
    }
  ]
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom Software Development Services",
  "description": "Professional software development, mobile app development, and digital transformation services in Jodhpur, Rajasthan.",
  "provider": {
    "@type": "Organization",
    "name": "Shivkara Digitals"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "Jodhpur",
      "containedInPlace": {
        "@type": "State", 
        "name": "Rajasthan"
      }
    },
    {
      "@type": "Country",
      "name": "India"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Software Development Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Software Development",
          "description": "Tailored software solutions for businesses"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Mobile App Development",
          "description": "iOS and Android app development services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Web Development",
          "description": "Professional websites and web applications"
        }
      }
    ]
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Shivkara Digitals",
  "url": "https://shivkaradigital.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://shivkaradigital.com/articles?search={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Shivkara Digitals"
  }
};
