import { Metadata } from 'next';
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { Smartphone, Apple, Shield, Zap, Users, Code2, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: 'Mobile App Development Company in Jodhpur | iOS & Android Apps',
  description: 'Leading mobile app development company in Jodhpur, Rajasthan. Expert iOS & Android app development services with 500+ successful apps. Flutter, React Native, Swift, Kotlin development.',
  keywords: [
    'mobile app development Jodhpur',
    'iOS app development Rajasthan',
    'Android app development company',
    'Flutter app development',
    'React Native development',
    'mobile app developers Jodhpur',
    'app development services Rajasthan',
    'custom mobile apps',
    'mobile application development'
  ],
  openGraph: {
    title: 'Mobile App Development Company in Jodhpur | iOS & Android Apps',
    description: 'Leading mobile app development company in Jodhpur, Rajasthan. Expert iOS & Android app development services with 500+ successful apps.',
    url: 'https://shivkara.com/services/mobile-app-development',
    siteName: 'Shivkara Technologies',
    images: [{
      url: 'https://shivkara.com/og-mobile-app-development.jpg',
      width: 1200,
      height: 630,
      alt: 'Mobile App Development Services in Jodhpur'
    }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile App Development Company in Jodhpur | iOS & Android Apps',
    description: 'Leading mobile app development company in Jodhpur, Rajasthan. Expert iOS & Android app development services with 500+ successful apps.',
    images: ['https://shivkara.com/og-mobile-app-development.jpg'],
  },
  alternates: {
    canonical: 'https://shivkara.com/services/mobile-app-development',
  },
};

const features = [
  {
    icon: <Apple className="w-8 h-8" />,
    title: "iOS App Development",
    description: "Native iOS apps using Swift and SwiftUI for superior performance and user experience."
  },
  {
    icon: <Smartphone className="w-8 h-8" />,
    title: "Android App Development", 
    description: "Native Android apps using Kotlin and Java for optimal device compatibility."
  },
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Cross-Platform Development",
    description: "Flutter and React Native apps for faster development and broader reach."
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "App Security",
    description: "Enterprise-grade security implementation with data encryption and secure APIs."
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Performance Optimization",
    description: "Optimized apps with fast loading times and smooth user interactions."
  },
  {
    icon: <Settings className="w-8 h-8" />,
    title: "App Maintenance",
    description: "Ongoing support, updates, and maintenance to keep your app running smoothly."
  }
];

const technologies = [
  "Swift", "SwiftUI", "Kotlin", "Java", "Flutter", "Dart", "React Native", 
  "Xamarin", "Firebase", "AWS", "Node.js", "MongoDB", "PostgreSQL"
];

export default function MobileAppDevelopmentPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Mobile App Development Company in Jodhpur, Rajasthan
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Leading mobile app development services in Jodhpur with 500+ successful iOS and Android apps. 
                Expert Flutter, React Native, Swift, and Kotlin development for businesses across Rajasthan and India.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <span className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full">iOS Development</span>
                <span className="bg-green-600/20 text-green-400 px-4 py-2 rounded-full">Android Development</span>
                <span className="bg-purple-600/20 text-purple-400 px-4 py-2 rounded-full">Cross-Platform</span>
                <span className="bg-cyan-600/20 text-cyan-400 px-4 py-2 rounded-full">Flutter</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Comprehensive Mobile App Development Services
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-700 p-6 rounded-xl border border-gray-600">
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 bg-gray-900">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Technologies We Use for Mobile App Development
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {technologies.map((tech, index) => (
                  <div key={index} className="bg-gray-800 p-4 rounded-lg text-center border border-gray-700 hover:border-blue-500 transition-colors">
                    <span className="text-white font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Our Mobile App Development Process
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Discovery & Planning</h3>
                  <p className="text-gray-300 text-sm">Understanding your requirements and creating detailed project roadmap</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Design & Prototyping</h3>
                  <p className="text-gray-300 text-sm">Creating intuitive UI/UX designs and interactive prototypes</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Development & Testing</h3>
                  <p className="text-gray-300 text-sm">Agile development with continuous testing and quality assurance</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Launch & Support</h3>
                  <p className="text-gray-300 text-sm">App store deployment and ongoing maintenance support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Build Your Mobile App?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Get a free consultation and quote for your mobile app development project. 
              Let's turn your idea into a successful mobile app.
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
