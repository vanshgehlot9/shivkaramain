"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#FF7A00] selection:text-white">
            <Navbar />

            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
                        Privacy <span className="text-[#FF7A00]">Policy</span>
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p>
                                At Shivkara Digital, we value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
                            <p className="mb-4">
                                We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF7A00]">
                                <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                                <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Use of Your Information</h2>
                            <p className="mb-4">
                                Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF7A00]">
                                <li>Create and manage your account.</li>
                                <li>Process your orders and payments.</li>
                                <li>Email you regarding your account or order.</li>
                                <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                                <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                                <li>Increase the efficiency and operation of the Site.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Disclosure of Your Information</h2>
                            <p>
                                We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#FF7A00]">
                                <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
                                <li><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Security of Your Information</h2>
                            <p>
                                We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                            <p>
                                If you have questions or comments about this Privacy Policy, please contact us at:
                            </p>
                            <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 inline-block">
                                <p className="font-bold text-white">Shivkara Digital</p>
                                <p>Email: info@shivkaradigital.com</p>
                                <p>Phone: +91 78772 18473</p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
