"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
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
                        Terms & <span className="text-[#FF7A00]">Conditions</span>
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p>
                                Welcome to Shivkara Digital. These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Shivkara Digital ("we," "us" or "our"), concerning your access to and use of our website and services.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
                            <p>
                                By accessing the Site, you have read, understood, and agreed to be bound by all of these Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly prohibited from using the Site and you must discontinue use immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Intellectual Property Rights</h2>
                            <p>
                                Unless otherwise indicated, the Site and our services are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. User Representations</h2>
                            <p className="mb-4">
                                By using the Site, you represent and warrant that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF7A00]">
                                <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
                                <li>You are not a minor in the jurisdiction in which you reside.</li>
                                <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
                                <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Prohibited Activities</h2>
                            <p>
                                You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Payment and Refunds</h2>
                            <p>
                                We accept various forms of payment including credit cards, debit cards, and UPI. You agree to provide current, complete, and accurate purchase and account information for all purchases made via the Site. You further agree to promptly update account and payment information, including email address, payment method, and payment card expiration date, so that we can complete your transactions and contact you as needed.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                            <p>
                                In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Contact Us</h2>
                            <p>
                                In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
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
