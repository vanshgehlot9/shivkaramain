// SEO Configuration for Shivkara Digital
export const seoConfig = {
  // Main site configuration
  siteName: 'Shivkara Digital',
  siteUrl: 'https://shivkaradigital.com',
  defaultTitle: 'Shivkara Digital - Professional Software Development Company in Jodhpur',
  defaultDescription: 'Leading software development company in Jodhpur, Rajasthan. Custom software solutions, mobile app development, web development, and digital transformation services. ISO 27001 certified.',
  
  // Business Information
  business: {
    name: 'Shivkara Digital',
    type: 'Software Development Company',
    foundedYear: '2020',
    employeeCount: '10-50',
    location: {
      city: 'Jodhpur',
      state: 'Rajasthan',
      country: 'India',
      address: 'Jodhpur, Rajasthan, India',
      latitude: 26.2389,
      longitude: 73.0243
    },
    contact: {
      phone: '+91-XXXXXXXXXX',
      email: 'info@shivkaradigital.com',
      website: 'https://shivkaradigital.com'
    }
  },

  // Social Media
  social: {
    twitter: '@ShivkaraDigital',
    linkedin: 'https://linkedin.com/company/shivkara-digital',
    facebook: 'https://facebook.com/shivkaradigital',
    instagram: 'https://instagram.com/shivkaradigital'
  },

  // Analytics & Verification
  analytics: {
    googleAnalytics: 'G-XXXXXXXXXX', // Replace with actual GA ID
    googleSearchConsole: 'your-google-verification-code',
    bingWebmaster: 'your-bing-verification-code',
    yandex: 'your-yandex-verification-code'
  },

  // Keywords by service
  keywords: {
    global: [
      'software development company Jodhpur',
      'mobile app development Rajasthan',
      'web development company India',
      'custom software solutions',
      'digital transformation services'
    ],
    services: {
      'custom-software-development': [
        'custom software development',
        'enterprise software solutions',
        'business automation software',
        'custom CRM development',
        'ERP solutions'
      ],
      'mobile-app-development': [
        'mobile app development',
        'iOS app development',
        'Android app development',
        'Flutter development',
        'React Native development'
      ],
      'web-development': [
        'web development',
        'website design',
        'responsive web design',
        'e-commerce website',
        'WordPress development'
      ],
      'ecommerce-development': [
        'e-commerce development',
        'online store development',
        'shopping cart development',
        'payment gateway integration',
        'WooCommerce development'
      ]
    }
  },

  // Page-specific configurations
  pages: {
    home: {
      title: 'Shivkara Digital - Leading Software Development Company in Jodhpur, Rajasthan',
      description: 'Transform your business with custom software solutions. Expert mobile app development, web development, and digital transformation services starting from ₹7,000. ISO 27001 certified.',
      keywords: [
        'software development company Jodhpur',
        'mobile app development Rajasthan',
        'web development services',
        'custom software solutions',
        'digital transformation'
      ]
    },
    services: {
      'custom-software-development': {
        title: 'Custom Software Development Company in Jodhpur | Enterprise Solutions',
        description: 'Leading custom software development services in Jodhpur, Rajasthan. Expert enterprise software solutions, business automation, CRM, and ERP development with 500+ successful projects.',
      },
      'mobile-app-development': {
        title: 'Mobile App Development Company in Jodhpur | iOS & Android Apps',
        description: 'Expert mobile app development services in Jodhpur, Rajasthan. iOS, Android, Flutter, and React Native app development with 500+ successful mobile applications.',
      },
      'web-development': {
        title: 'Web Development Company in Jodhpur | Website Design & Development',
        description: 'Professional web development services in Jodhpur, Rajasthan. Custom websites, e-commerce development, and responsive web design starting from ₹7,000.',
      },
      'ecommerce-development': {
        title: 'E-commerce Development Company in Jodhpur | Online Store Development',
        description: 'Expert e-commerce development services in Jodhpur, Rajasthan. Custom online stores, shopping cart solutions, and payment gateway integration starting from ₹25,000.',
      }
    }
  },

  // Local SEO
  local: {
    businessType: 'Software Development Company',
    serviceAreas: [
      'Jodhpur',
      'Rajasthan',
      'Jaipur',
      'Udaipur',
      'Ajmer',
      'Bikaner',
      'Kota',
      'Bharatpur',
      'India'
    ],
    services: [
      'Custom Software Development',
      'Mobile App Development',
      'Web Development',
      'E-commerce Development',
      'Digital Transformation',
      'Software Consulting',
      'UI/UX Design',
      'Cloud Solutions'
    ]
  },

  // Content Strategy
  content: {
    primaryTopics: [
      'Software Development',
      'Mobile App Development',
      'Web Development',
      'Digital Transformation',
      'Technology Trends',
      'Business Automation'
    ],
    targetAudience: [
      'Small Business Owners',
      'Startups',
      'Enterprise Companies',
      'Digital Agencies',
      'Entrepreneurs'
    ]
  }
};

// Helper function to generate meta tags
export const generateMetaTags = (pageType: string, customData?: any) => {
  const pagesConfig = seoConfig.pages;
  let page: any = pagesConfig.home;
  
  if (pageType === 'home') {
    page = pagesConfig.home;
  } else if (pageType.startsWith('services/')) {
    const serviceKey = pageType.replace('services/', '') as keyof typeof pagesConfig.services;
    page = pagesConfig.services[serviceKey] || pagesConfig.home;
  }
  
  return {
    title: customData?.title || page.title,
    description: customData?.description || page.description,
    keywords: [
      ...(page.keywords || []),
      ...seoConfig.keywords.global
    ].join(', '),
    openGraph: {
      title: customData?.title || page.title,
      description: customData?.description || page.description,
      url: `${seoConfig.siteUrl}${customData?.path || ''}`,
      siteName: seoConfig.siteName,
      images: [{
        url: `${seoConfig.siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: page.title
      }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: customData?.title || page.title,
      description: customData?.description || page.description,
      creator: seoConfig.social.twitter,
      images: [`${seoConfig.siteUrl}/og-image.jpg`],
    }
  };
};

export default seoConfig;
