import { Metadata } from 'next';
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { ShoppingCart, CreditCard, Package, TrendingUp, Shield, Users, Settings, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: 'E-commerce Development Company in Jodhpur | Online Store Development',
  description: 'Leading e-commerce development company in Jodhpur, Rajasthan. Expert online store development, shopping cart solutions, and payment gateway integration. Custom e-commerce websites starting from ₹25,000.',
  keywords: [
    'e-commerce development Jodhpur',
    'online store development Rajasthan',
    'shopping website development',
    'e-commerce website design',
    'online shopping platform',
    'WooCommerce development',
    'Shopify development',
    'custom e-commerce solutions',
    'payment gateway integration',
    'shopping cart development'
  ],
  openGraph: {
    title: 'E-commerce Development Company in Jodhpur | Online Store Development',
    description: 'Leading e-commerce development company in Jodhpur, Rajasthan. Expert online store development, shopping cart solutions, and payment gateway integration.',
    url: 'https://shivkara.com/services/ecommerce-development',
    siteName: 'Shivkara Technologies',
    images: [{
      url: 'https://shivkara.com/og-ecommerce-development.jpg',
      width: 1200,
      height: 630,
      alt: 'E-commerce Development Services in Jodhpur'
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-commerce Development Company in Jodhpur | Online Store Development',
    description: 'Leading e-commerce development company in Jodhpur, Rajasthan. Expert online store development, shopping cart solutions, and payment gateway integration.',
    images: ['https://shivkara.com/og-ecommerce-development.jpg'],
  },
  alternates: {
    canonical: 'https://shivkara.com/services/ecommerce-development',
  },
};

const features = [
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "Custom E-commerce Websites",
    description: "Tailored online stores with unique designs and functionality specific to your business needs."
  },
  {
    icon: <CreditCard className="w-8 h-8" />,
    title: "Payment Gateway Integration", 
    description: "Secure payment processing with multiple payment options including cards, UPI, and wallets."
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Inventory Management",
    description: "Advanced inventory tracking with automated stock updates and low-stock alerts."
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "Sales Analytics",
    description: "Comprehensive reporting and analytics to track sales, customers, and performance metrics."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Security & SSL",
    description: "Enterprise-grade security with SSL certificates and secure checkout processes."
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Customer Management",
    description: "Complete customer database with order history and personalized shopping experiences."
  }
];

const platforms = [
  {
    name: "Custom E-commerce",
    description: "Built from scratch with unique features",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"]
  },
  {
    name: "WooCommerce",
    description: "WordPress-based flexible solution",
    technologies: ["WordPress", "WooCommerce", "PHP", "MySQL"]
  },
  {
    name: "Shopify",
    description: "Hosted solution with quick setup",
    technologies: ["Shopify", "Liquid", "JavaScript", "CSS"]
  },
  {
    name: "Magento",
    description: "Enterprise-level e-commerce platform",
    technologies: ["Magento", "PHP", "MySQL", "Elasticsearch"]
  }
];

const packages = [
  {
    name: "Basic Store",
    price: "₹25,000",
    features: [
      "Up to 50 Products",
      "Basic Payment Gateway",
      "Mobile Responsive",
      "Admin Panel",
      "3 Months Support",
      "Basic SEO"
    ]
  },
  {
    name: "Professional Store",
    price: "₹50,000",
    features: [
      "Up to 500 Products",
      "Multiple Payment Options",
      "Advanced Admin Panel",
      "Inventory Management",
      "6 Months Support",
      "Advanced SEO",
      "Customer Reviews"
    ]
  },
  {
    name: "Enterprise Store",
    price: "₹1,00,000",
    features: [
      "Unlimited Products",
      "Custom Features",
      "Multi-vendor Support",
      "Advanced Analytics",
      "12 Months Support",
      "Mobile App Ready",
      "Third-party Integrations"
    ]
  }
];

export default function EcommerceDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-green-900 to-blue-900 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                E-commerce Development Company in Jodhpur, Rajasthan
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Leading e-commerce development services in Jodhpur with 200+ successful online stores. 
                Expert shopping cart solutions, payment gateway integration, and custom e-commerce websites 
                starting from ₹25,000. Boost your online sales across Rajasthan and India.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full">Online Stores</span>
                <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full">Payment Integration</span>
                <span className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full">Inventory Management</span>
                <span className="bg-cyan-600/20 text-cyan-400 px-4 py-2 rounded-full">Mobile Ready</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Complete E-commerce Development Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                  <div className="text-green-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Platforms Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              E-commerce Platforms We Work With
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {platforms.map((platform, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-xl border border-gray-700 text-center">
                  <h3 className="text-xl font-bold text-white mb-3">{platform.name}</h3>
                  <p className="text-gray-300 mb-4">{platform.description}</p>
                  <div className="space-y-2">
                    {platform.technologies.map((tech, idx) => (
                      <span key={idx} className="inline-block bg-green-600/20 text-green-400 px-2 py-1 rounded text-sm mr-2">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              E-commerce Development Packages
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {packages.map((pkg, index) => (
                <div key={index} className="bg-gray-700 p-8 rounded-xl border border-gray-600 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-green-400 mb-6">{pkg.price}</div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-300 flex items-center justify-center">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Our E-commerce Development Process
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-6">
                <div className="text-center">
                  <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Business Analysis</h3>
                  <p className="text-gray-300 text-sm">Understanding your products and target market</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Store Design</h3>
                  <p className="text-gray-300 text-sm">Creating attractive and user-friendly store layouts</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Development</h3>
                  <p className="text-gray-300 text-sm">Building the e-commerce platform with all features</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Integration</h3>
                  <p className="text-gray-300 text-sm">Payment gateways and third-party service integration</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Testing</h3>
                  <p className="text-gray-300 text-sm">Comprehensive testing of all store functions</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">6</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Launch</h3>
                  <p className="text-gray-300 text-sm">Going live with ongoing support and marketing</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Your Online Store?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Get a free consultation and quote for your e-commerce development project. 
              Let's build an online store that drives sales and grows your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Free Quote
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                View Portfolio
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
