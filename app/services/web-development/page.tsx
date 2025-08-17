import { Metadata } from 'next';
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Globe, Code, Smartphone, Shield, Zap, Search, ShoppingCart, Users } from "lucide-react";

export const metadata: Metadata = {
  title: 'Web Development Company in Jodhpur | Website Design & Development Services',
  description: 'Leading web development company in Jodhpur, Rajasthan. Expert website design, e-commerce development, and custom web applications. Responsive, SEO-optimized websites starting from ₹7,000.',
  keywords: [
    'web development company Jodhpur',
    'website development Rajasthan',
    'web design company',
    'e-commerce development',
    'responsive website design',
    'custom web applications',
    'website developers Jodhpur',
    'web development services',
    'WordPress development',
    'React development'
  ],
  openGraph: {
    title: 'Web Development Company in Jodhpur | Website Design & Development Services',
    description: 'Leading web development company in Jodhpur, Rajasthan. Expert website design, e-commerce development, and custom web applications.',
    url: 'https://shivkara.com/services/web-development',
    siteName: 'Shivkara Technologies',
    images: [{
      url: 'https://shivkara.com/og-web-development.jpg',
      width: 1200,
      height: 630,
      alt: 'Web Development Services in Jodhpur'
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web Development Company in Jodhpur | Website Design & Development Services',
    description: 'Leading web development company in Jodhpur, Rajasthan. Expert website design, e-commerce development, and custom web applications.',
    images: ['https://shivkara.com/og-web-development.jpg'],
  },
  alternates: {
    canonical: 'https://shivkara.com/services/web-development',
  },
};

const services = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Custom Website Development",
    description: "Bespoke websites tailored to your business needs with modern design and functionality."
  },
  {
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "E-commerce Development", 
    description: "Complete online stores with payment integration, inventory management, and admin panels."
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Web Application Development",
    description: "Complex web applications with advanced features and database integration."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Responsive Design",
    description: "Mobile-first responsive websites that work perfectly on all devices and screen sizes."
  },
  {
    icon: <Search className="w-8 h-8" />,
    title: "SEO Optimization",
    description: "SEO-friendly websites optimized for search engines and better online visibility."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Performance Optimization",
    description: "Fast-loading websites with optimized code and efficient resource management."
  }
];

const technologies = [
  "React", "Next.js", "Vue.js", "Angular", "Node.js", "Express.js", 
  "WordPress", "PHP", "Laravel", "Python", "Django", "MongoDB", 
  "MySQL", "PostgreSQL", "AWS", "Google Cloud"
];

const packages = [
  {
    name: "Basic Website",
    price: "₹7,000",
    features: [
      "5 Pages Website",
      "Responsive Design",
      "Contact Form",
      "Basic SEO",
      "1 Month Support"
    ]
  },
  {
    name: "Business Website",
    price: "₹15,000",
    features: [
      "10 Pages Website",
      "Advanced Design",
      "CMS Integration",
      "SEO Optimization",
      "3 Months Support",
      "Social Media Integration"
    ]
  },
  {
    name: "E-commerce Website",
    price: "₹25,000",
    features: [
      "Product Catalog",
      "Payment Gateway",
      "Admin Panel",
      "Inventory Management",
      "6 Months Support",
      "Mobile App Ready"
    ]
  }
];

export default function WebDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Web Development Company in Jodhpur, Rajasthan
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Leading web development services in Jodhpur with 500+ successful websites. Expert website design, 
                e-commerce development, and custom web applications starting from ₹7,000. Responsive, SEO-optimized 
                solutions for businesses across Rajasthan and India.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full">Custom Websites</span>
                <span className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full">E-commerce</span>
                <span className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full">Web Apps</span>
                <span className="bg-cyan-600/20 text-cyan-400 px-4 py-2 rounded-full">SEO Optimized</span>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Comprehensive Web Development Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                  <div className="text-blue-400 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Website Development Packages
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {packages.map((pkg, index) => (
                <div key={index} className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-6">{pkg.price}</div>
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="text-gray-300 flex items-center justify-center">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Technologies We Use for Web Development
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {technologies.map((tech, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg text-center border border-gray-600 hover:border-blue-500 transition-colors">
                    <span className="text-white font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Our Web Development Process
            </h2>
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Requirements Analysis</h3>
                  <p className="text-gray-300 text-sm">Understanding your business goals and project requirements</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Design & Wireframing</h3>
                  <p className="text-gray-300 text-sm">Creating intuitive designs and user experience wireframes</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Development</h3>
                  <p className="text-gray-300 text-sm">Coding your website with modern technologies and best practices</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Testing & QA</h3>
                  <p className="text-gray-300 text-sm">Thorough testing across devices and browsers for quality assurance</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Launch & Support</h3>
                  <p className="text-gray-300 text-sm">Website deployment and ongoing maintenance support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Website?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get a free consultation and quote for your web development project. 
              Let's create a website that drives results for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Free Quote
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
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
