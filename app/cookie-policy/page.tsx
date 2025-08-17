"use client";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function CookiePolicyPage() {
  return (
    <>
      <Header currentPage="cookie-policy" />
      <div className="min-h-screen bg-gradient-to-br from-very-light-pink via-white to-very-light-pink pt-32">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-lavender to-pink bg-clip-text text-transparent mb-8 text-center">
              Cookie Policy
            </h1>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> August 17, 2025
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies?</h2>
              <p className="text-gray-700 mb-6">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                Shivkara Digitals uses cookies to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li>Ensure our website functions properly</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze website traffic and user behavior</li>
                <li>Improve our website performance and user experience</li>
                <li>Provide personalized content and recommendations</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies collect information about how visitors use our website, such as which pages are visited most often. This data helps us optimize our website performance.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Functionality Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies allow the website to remember choices you make and provide enhanced, more personalized features.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics Cookies</h3>
              <p className="text-gray-700 mb-6">
                We use analytics cookies to understand how visitors interact with our website. This includes Google Analytics cookies that help us analyze website traffic and user behavior patterns.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                Our website may also use third-party cookies from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Firebase:</strong> For application analytics and crash reporting</li>
                <li><strong>Social Media Platforms:</strong> For social sharing functionality</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-gray-700 mb-4">
                You have several options for managing cookies:
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Block all cookies</li>
                <li>Allow only first-party cookies</li>
                <li>Delete existing cookies</li>
                <li>Receive notifications when cookies are being set</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browser-Specific Instructions</h3>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 mb-2">
                  <strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
                </p>
                <p className="text-gray-700">
                  <strong>Edge:</strong> Settings → Site permissions → Cookies and site data
                </p>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Impact of Disabling Cookies</h2>
              <p className="text-gray-700 mb-6">
                Please note that disabling certain cookies may affect the functionality of our website. Some features may not work properly or may not be available if you choose to disable cookies.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie Retention</h2>
              <p className="text-gray-700 mb-6">
                The duration cookies remain on your device varies depending on their type:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain until their expiry date or until you delete them</li>
                <li><strong>Analytics Cookies:</strong> Typically expire after 2 years</li>
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies, please contact us:
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
      <Footer currentPage="cookie-policy" />
    </>
  );
}
