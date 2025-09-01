"use client";
import { Check } from 'lucide-react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
}

const services: Service[] = [
  {
    icon: <Check className="w-8 h-8" />,
    title: "Custom Software Development",
    description: "Tailored software solutions designed to meet your specific business requirements and drive growth.",
    features: ["Enterprise Applications", "Custom APIs", "Database Design", "System Integration"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <Check className="w-8 h-8" />,
    title: "Mobile App Development",
    description: "Native and cross-platform mobile applications that enhance customer engagement and business efficiency.",
    features: ["iOS & Android Apps", "Cross-platform Solutions", "App Maintenance", "Performance Optimization"],
    color: "from-blue-600 to-indigo-600"
  },
  {
    icon: <Check className="w-8 h-8" />,
    title: "Web Design & Development",
    description: "Professional websites and web applications that establish your brand and convert visitors to customers.",
    features: ["Responsive Design", "E-commerce Solutions", "CMS Development", "SEO Optimization"],
    color: "from-teal-500 to-blue-500"
  },
  {
    icon: <Check className="w-8 h-8" />,
    title: "Digital Transformation",
    description: "Comprehensive digital solutions to modernize your business processes and improve operational efficiency.",
    features: ["Process Automation", "Cloud Migration", "Legacy System Updates", "Digital Strategy"],
    color: "from-orange-500 to-red-500"
  },
  {
    icon: <Check className="w-8 h-8" />,
    title: "IT Consulting & Support",
    description: "Expert technology consulting and ongoing support to ensure your digital solutions perform optimally.",
    features: ["Technology Assessment", "System Maintenance", "24/7 Support", "Security Audits"],
    color: "from-indigo-600 to-blue-600"
  },
  {
    icon: <Check className="w-8 h-8" />,
    title: "Business Solutions",
    description: "End-to-end business solutions including CRM, ERP, and custom management systems.",
    features: ["CRM Implementation", "ERP Systems", "Business Intelligence", "Workflow Automation"],
    color: "from-teal-500 to-cyan-500"
  }
];

export default function Services() {
  return (
    <section id="services" className="py-12 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-indigo-700 rounded-full"></div>
            <span className="text-indigo-700 text-sm font-semibold tracking-wide">OUR SERVICES</span>
            <div className="w-2 h-2 bg-indigo-700 rounded-full"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Comprehensive <span className="text-indigo-700">Solutions</span> for Your Business
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer end-to-end software solutions tailored to meet your specific business requirements and drive meaningful digital transformation.
          </p>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group relative"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="h-1 bg-gradient-to-r from-blue-700 to-indigo-600 w-0 group-hover:w-full transition-all duration-700 ease-out absolute bottom-0 left-0 right-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
