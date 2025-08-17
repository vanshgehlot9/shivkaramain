"use client";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TermsPage() {
  return (
    <>
      <Header currentPage="terms" />
      <div className="min-h-screen bg-gradient-to-br from-very-light-pink via-white to-very-light-pink pt-32">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent mb-8 text-center">
              Terms of Service
            </h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> August 17, 2025
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using the services provided by Shivkara Digitals ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Description</h2>
              <p className="text-gray-700 mb-4">
                Shivkara Digitals provides:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Custom software development services</li>
                <li>Mobile application development</li>
                <li>Web design and development</li>
                <li>Digital transformation consulting</li>
                <li>IT support and maintenance services</li>
                <li>Cloud solutions and deployment</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Project Agreements</h2>
              <p className="text-gray-700 mb-6">
                All software development projects are governed by separate project agreements that detail specific terms, deliverables, timelines, and payment schedules. These terms serve as the general framework for our business relationship.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Payment schedules are defined in individual project agreements</li>
                <li>Late payments may incur additional charges as specified in project contracts</li>
                <li>All prices are in Indian Rupees (INR) unless otherwise specified</li>
                <li>Refunds are subject to the terms outlined in specific project agreements</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                Upon full payment for services rendered, clients receive ownership rights to the custom software developed specifically for them. However, Shivkara Digitals retains rights to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>General methodologies and know-how used in development</li>
                <li>Reusable code components and frameworks developed by us</li>
                <li>Any pre-existing intellectual property incorporated into the project</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Confidentiality</h2>
              <p className="text-gray-700 mb-6">
                We respect and protect our clients' confidential information. We will not disclose any proprietary or confidential information shared during the course of our business relationship without explicit consent, except as required by law.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Warranties and Disclaimers</h2>
              <p className="text-gray-700 mb-6">
                While we strive to deliver high-quality software solutions, we provide our services "as is" without any warranties beyond those specified in individual project agreements. We disclaim all implied warranties including merchantability and fitness for a particular purpose.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                Our liability for any claims arising from our services shall not exceed the total amount paid by the client for the specific project in question. We shall not be liable for any indirect, incidental, or consequential damages.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Support and Maintenance</h2>
              <p className="text-gray-700 mb-6">
                Post-delivery support and maintenance services are available under separate agreements. The scope and duration of included support are specified in individual project contracts.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Force Majeure</h2>
              <p className="text-gray-700 mb-6">
                We shall not be held responsible for any failure or delay in performance due to circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, government actions, or global pandemics.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
              <p className="text-gray-700 mb-6">
                Either party may terminate a project agreement with written notice as specified in the individual contract. Termination procedures and any applicable penalties are outlined in project-specific agreements.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms or our services shall be subject to the jurisdiction of courts in Jodhpur, Rajasthan.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these terms at any time. Updated terms will be posted on our website with the revision date. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> info@shivkaradigital.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +91 9521699090
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Shivkara Digitals, Jodhpur, Rajasthan, India
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer currentPage="terms" />
    </>
  );
}
