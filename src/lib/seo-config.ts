// SEO and Analytics Configuration for Enhanced Performance Tracking

export const SEO_CONFIG = {
  // Core SEO Settings
  siteName: 'Shivkara Digitals',
  siteUrl: 'https://shivkaradigitals.com',
  defaultTitle: 'Software Development Company in Jodhpur, Rajasthan | Shivkara Digitals',
  defaultDescription: 'Leading software development company in Jodhpur, Rajasthan, India. Expert mobile app development, web development, custom software solutions, e-commerce platforms, and digital transformation services. ISO 27001 certified with 75+ successful projects.',
  
  // Local SEO
  businessInfo: {
    name: 'Shivkara Digitals',
    address: {
      street: 'Business District',
      city: 'Jodhpur',
      state: 'Rajasthan',
      country: 'India',
      postalCode: '342001'
    },
    coordinates: {
      latitude: 26.2389,
      longitude: 73.0243
    },
    phone: '+91-9521699090',
    email: 'info@shivkaradigital.com',
    openingHours: 'Mo-Fr 09:00-18:00',
    serviceAreas: ['Jodhpur', 'Rajasthan', 'India', 'International']
  },

  // Primary Keywords for SEO Focus
  primaryKeywords: [
    'software development company Jodhpur',
    'mobile app development Jodhpur',
    'web development Rajasthan',
    'custom software solutions India',
    'digital transformation services',
    'IT company Jodhpur'
  ],

  // Long-tail Keywords for Content Strategy
  longTailKeywords: [
    'best software development company in Jodhpur Rajasthan',
    'affordable mobile app development services India',
    'custom web development company Jodhpur',
    'enterprise software solutions Rajasthan',
    'outsource software development to India',
    'digital transformation consulting Jodhpur'
  ],

  // Social Media Profiles
  socialProfiles: {
    facebook: 'https://www.facebook.com/shivkaradigitals',
    instagram: 'https://www.instagram.com/shivkaradigitals',
    linkedin: 'https://www.linkedin.com/company/shivkara-digitals',
    twitter: 'https://twitter.com/shivkaradigital'
  },

  // Analytics Configuration
  analytics: {
    googleAnalytics: 'GA-MEASUREMENT-ID', // Replace with actual GA4 Measurement ID
    googleSearchConsole: 'GSC-VERIFICATION-CODE', // Replace with actual verification code
    clarityId: 'CLARITY-PROJECT-ID', // Microsoft Clarity for user behavior analytics
    hotjarId: 'HOTJAR-SITE-ID' // Hotjar for user session recordings
  }
};

// Content Strategy for SEO Blog Posts
export const CONTENT_STRATEGY = {
  // Blog post ideas for organic traffic growth
  suggestedPosts: [
    {
      title: 'Why Outsource App Development to Jodhpur? Cost Benefits & Quality Assurance',
      targetKeywords: ['outsource app development', 'Jodhpur', 'cost benefits'],
      contentType: 'Guide',
      estimatedWordCount: 2500,
      priority: 'High'
    },
    {
      title: 'Cost Benefits of Offshore Development from India: Complete Analysis',
      targetKeywords: ['offshore development India', 'cost analysis', 'software outsourcing'],
      contentType: 'Analysis',
      estimatedWordCount: 3000,
      priority: 'High'
    },
    {
      title: 'Rajasthan Tech Ecosystem 2024: Opportunities for Startups',
      targetKeywords: ['Rajasthan tech ecosystem', 'startup opportunities', 'technology hub'],
      contentType: 'Industry Report',
      estimatedWordCount: 2000,
      priority: 'Medium'
    },
    {
      title: 'React Native vs Flutter 2024: Complete Business Comparison',
      targetKeywords: ['React Native vs Flutter', 'mobile development', 'technology comparison'],
      contentType: 'Comparison',
      estimatedWordCount: 2800,
      priority: 'High'
    },
    {
      title: 'Digital Transformation for Small Businesses: Step-by-Step Guide',
      targetKeywords: ['digital transformation', 'small business', 'business automation'],
      contentType: 'Guide',
      estimatedWordCount: 2200,
      priority: 'Medium'
    }
  ],

  // Content publishing schedule
  publishingSchedule: {
    frequency: '2 posts per week',
    optimalDays: ['Tuesday', 'Thursday'],
    optimalTime: '10:00 AM IST'
  }
};

// Technical SEO Checklist
export const TECHNICAL_SEO_CHECKLIST = [
  {
    item: 'robots.txt file',
    status: 'completed',
    description: 'Properly configured robots.txt with sitemap references'
  },
  {
    item: 'XML Sitemap',
    status: 'completed',
    description: 'Dynamic sitemap generation for all pages and articles'
  },
  {
    item: 'Structured Data',
    status: 'completed',
    description: 'Organization, LocalBusiness, and WebSite schema markup'
  },
  {
    item: 'Page Speed Optimization',
    status: 'pending',
    description: 'Optimize images, implement lazy loading, minimize JavaScript'
  },
  {
    item: 'Mobile Responsiveness',
    status: 'completed',
    description: 'Fully responsive design with mobile-first approach'
  },
  {
    item: 'Core Web Vitals',
    status: 'pending',
    description: 'Optimize LCP, FID, and CLS metrics'
  },
  {
    item: 'Internal Linking',
    status: 'in-progress',
    description: 'Strategic internal linking between related pages and blog posts'
  },
  {
    item: 'Image Alt Tags',
    status: 'pending',
    description: 'Add descriptive alt text to all images'
  },
  {
    item: 'Meta Descriptions',
    status: 'completed',
    description: 'Unique, compelling meta descriptions for all pages'
  },
  {
    item: 'Canonical URLs',
    status: 'completed',
    description: 'Proper canonical URL implementation'
  }
];

// Local SEO Strategy
export const LOCAL_SEO_STRATEGY = {
  // Google Business Profile optimization
  gbpOptimization: {
    businessName: 'Shivkara Digitals',
    category: 'Software Company',
    description: 'Leading software development company in Jodhpur, Rajasthan specializing in mobile app development, web development, and custom software solutions.',
    attributes: [
      'Veteran-owned',
      'LGBTQ+ friendly', 
      'Women-owned',
      'Identifies as Black-owned'
    ],
    services: [
      'Mobile App Development',
      'Web Development', 
      'Custom Software Development',
      'E-commerce Solutions',
      'Digital Transformation',
      'UI/UX Design'
    ],
    posts: [
      {
        type: 'offer',
        title: 'Free Consultation for Software Development Projects',
        description: 'Get expert advice on your next software project. Book a free 30-minute consultation with our development team.',
        cta: 'Book Consultation'
      }
    ]
  },

  // Local directory submissions
  directorySubmissions: [
    'Google Business Profile',
    'Bing Places',
    'IndiaMART',
    'JustDial',
    'Sulekha',
    'UrbanPro',
    'Rajasthan Business Directory',
    'Jodhpur Local Business Directory'
  ],

  // Local citation building
  citationSources: [
    'Chamber of Commerce Jodhpur',
    'Rajasthan IT Association',
    'India Software Companies Directory',
    'Tech Company Listings India'
  ]
};

// Performance Monitoring
export const PERFORMANCE_MONITORING = {
  // Key metrics to track
  keyMetrics: [
    'Organic traffic growth',
    'Keyword ranking positions',
    'Local search visibility',
    'Click-through rates',
    'Conversion rates',
    'Page load speed',
    'Core Web Vitals scores',
    'Bounce rate',
    'Time on page',
    'Pages per session'
  ],

  // Recommended tools
  recommendedTools: [
    'Google Analytics 4',
    'Google Search Console',
    'Ahrefs (for backlink analysis)',
    'SEMrush (for keyword tracking)',
    'PageSpeed Insights',
    'Core Web Vitals report',
    'Screaming Frog (for technical audits)',
    'GTmetrix (for performance monitoring)'
  ],

  // Monthly reporting schedule
  reportingSchedule: {
    frequency: 'Monthly',
    includeMetrics: [
      'Organic traffic trends',
      'Keyword ranking changes',
      'Technical SEO issues',
      'Content performance',
      'Local SEO metrics',
      'Competitor analysis'
    ]
  }
};
