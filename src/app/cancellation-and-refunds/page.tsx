"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function CancellationAndRefunds() {
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
                        Cancellation & Refunds <span className="text-[#FF7A00]">Policy</span>
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p>
                                Thank you for shopping at Shivkara Digital. If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Interpretation and Definitions</h2>
                            <p className="mb-4">
                                The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF7A00]">
                                <li><strong>Company</strong> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Shivkara Digital.</li>
                                <li><strong>Service</strong> refers to the Website.</li>
                                <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Your Order Cancellation Rights</h2>
                            <p>
                                You are entitled to cancel Your Order within 7 days without giving any reason for doing so. The deadline for cancelling an Order is 7 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.
                            </p>
                            <p className="mt-4">
                                In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform us of your decision by:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#FF7A00]">
                                <li>By email: info@shivkaradigital.com</li>
                                <li>By phone number: +91 78772 18473</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Conditions for Returns</h2>
                            <p className="mb-4">
                                In order for the Goods to be eligible for a return, please make sure that:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF7A00]">
                                <li>The Goods were purchased in the last 7 days.</li>
                                <li>The Goods are in the original packaging.</li>
                                <li>The Goods were not used or damaged.</li>
                                <li>You have the receipt or proof of purchase.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Refund Process</h2>
                            <p>
                                We will reimburse You no later than 14 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
                            <p>
                                If you have any questions about our Returns and Refunds Policy, please contact us:
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
