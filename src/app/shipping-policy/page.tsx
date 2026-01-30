"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ShippingPolicy() {
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
                        Shipping <span className="text-[#FF7A00]">Policy</span>
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p>
                                This Shipping Policy describes Our policies and procedures on the shipping of goods purchased on Our Service.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Processing Time</h2>
                            <p className="mb-4">
                                All orders are processed within 2-3 business days. Orders are not shipped or delivered on weekends or holidays.
                            </p>
                            <p>
                                If We are experiencing a high volume of orders, shipments may be delayed by a few days. Please allow additional days in transit for delivery. If there will be a significant delay in shipment of Your Order, We will contact You via email or telephone.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Shipping Rates & Delivery Estimates</h2>
                            <p className="mb-4">
                                Shipping charges for Your Orders will be calculated and displayed at checkout.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF7A00]">
                                <li><strong>Standard Shipping:</strong> 5-7 business days.</li>
                                <li><strong>Express Shipping:</strong> 2-3 business days.</li>
                            </ul>
                            <p className="mt-4 text-sm text-gray-400">
                                * Delivery delays can occasionally occur.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Shipment Confirmation & Order Tracking</h2>
                            <p>
                                You will receive a Shipment Confirmation email once Your Order has shipped containing your tracking number(s). The tracking number will be active within 24 hours.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Customs, Duties and Taxes</h2>
                            <p>
                                Shivkara Digital is not responsible for any customs and taxes applied to Your Order. All fees imposed during or after shipping are the responsibility of the customer (tariffs, taxes, etc.).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Damages</h2>
                            <p>
                                Shivkara Digital is not liable for any products damaged or lost during shipping. If You received Your Order damaged, please contact the shipment carrier to file a claim.
                            </p>
                            <p className="mt-2">
                                Please save all packaging materials and damaged goods before filing a claim.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Us</h2>
                            <p>
                                If you have any questions about our Shipping Policy, please contact us:
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
