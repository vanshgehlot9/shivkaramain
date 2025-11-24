"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function CookiesPolicy() {
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
                        Cookies <span className="text-[#FF7A00]">Policy</span>
                    </h1>

                    <div className="space-y-8 text-gray-300 leading-relaxed">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <p className="mb-4">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            <p>
                                This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. What are Cookies?</h2>
                            <p>
                                Cookies are small text files that are placed on your computer or mobile device by websites that you visit. They are widely used in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
                            <p className="mb-4">
                                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 marker:text-[#FF7A00]">
                                <li><strong>Essential Cookies:</strong> These cookies are essential to provide You with services available through the Website and to enable You to use some of its features.</li>
                                <li><strong>Functionality Cookies:</strong> These cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference.</li>
                                <li><strong>Analytics Cookies:</strong> These cookies collect information about how you use our website, for instance which pages you go to most often. This data may be used to help optimize our website and make it easier for you to navigate.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Disabling Cookies</h2>
                            <p>
                                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore it is recommended that you do not disable cookies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Third Party Cookies</h2>
                            <p>
                                In some special cases we also use cookies provided by trusted third parties. The following section details which third party cookies you might encounter through this site.
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4 marker:text-[#FF7A00]">
                                <li>This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience.</li>
                                <li>We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. More Information</h2>
                            <p>
                                Hopefully that has clarified things for you and as was previously mentioned if there is something that you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
                            </p>
                            <p className="mt-4">
                                However, if you are still looking for more information, you can contact us:
                            </p>
                            <div className="mt-4 p-6 rounded-2xl bg-white/5 border border-white/10 inline-block">
                                <p className="font-bold text-white">Shivkara Digital</p>
                                <p>Email: info@shivkaradigital.com</p>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
