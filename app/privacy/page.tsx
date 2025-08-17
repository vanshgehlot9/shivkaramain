"use client";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Header currentPage="privacy" />
      <div className="min-h-screen bg-gradient-to-br from-very-light-pink via-white to-very-light-pink pt-32">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent mb-8 text-center">
              Privacy Policy
            </h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> August 17, 2025
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-6">
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Fill out contact forms on our website</li>
                <li>Request quotes or consultations</li>
                <li>Subscribe to our newsletter or blog updates</li>
                <li>Communicate with us via email or phone</li>
                <li>Apply for job positions</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send you project proposals and quotations</li>
                <li>Provide you with information about our services</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Service providers who assist us in operating our website and conducting business</li>
                <li>Legal authorities when required by law or to protect our rights</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-6">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes using SSL encryption for data transmission and secure servers for data storage.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-6">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can choose to disable cookies through your browser settings.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability where applicable</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Third-Party Services</h2>
              <p className="text-gray-700 mb-6">
                Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 mb-6">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your personal information in accordance with applicable data protection laws.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
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
      <Footer currentPage="privacy" />
    </>
  );
}
