"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { services } from "@/lib/data";

export default function ServicesSection() {
  return (
    <motion.section
      id="services"
      className="py-12 sm:py-20 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
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
        </motion.div>
        
        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg relative`}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center"
                  >
                    {<service.icon className="w-6 h-6" />}
                  </motion.div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900">{service.title}</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{service.description}</p>
                
                <ul className="space-y-2 sm:space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={feature} 
                      className="flex items-start space-x-2 sm:space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * featureIndex, duration: 0.5 }}
                    >
                      <div className="bg-indigo-50 rounded-full p-1 mt-0.5">
                        <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-700 flex-shrink-0" />
                      </div>
                      <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-700 to-indigo-600 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
