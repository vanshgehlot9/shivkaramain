"use client";

import { motion } from "framer-motion";
import SpotlightCard from "./ui/SpotlightCard";

const terms = [
    {
        term: "Microservices",
        definition: "An architectural style where an application is arranged as a collection of loosely coupled services."
    },
    {
        term: "CI/CD",
        definition: "Continuous Integration and Continuous Deployment. A method to frequently deliver apps to customers by automating stages of app development."
    },
    {
        term: "API First",
        definition: "A strategy where the API is treated as a first-class citizen, designed before the implementation of the application."
    },
    {
        term: "Serverless",
        definition: "A cloud computing execution model where the cloud provider runs the server, and dynamically manages the allocation of machine resources."
    },
    {
        term: "Headless CMS",
        definition: "A back-end only content management system that acts primarily as a content repository."
    },
    {
        term: "PWA",
        definition: "Progressive Web Apps. Web apps that use modern web capabilities to deliver an app-like experience to users."
    }
];

export default function TechGlossary() {
    return (
        <section className="py-24 bg-[#080808] border-t border-white/5">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <span className="text-shivkara-orange font-mono text-xs tracking-widest uppercase mb-4 block">/// Learn</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tighter leading-none">
                            Tech <span className="text-gray-600">Decoded</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {terms.map((item, index) => (
                        <SpotlightCard
                            key={index}
                            className="rounded-2xl bg-black"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative p-8 h-full z-10"
                            >
                                <h3 className="text-lg font-bold text-white mb-3 text-shivkara-orange">{item.term}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {item.definition}
                                </p>
                            </motion.div>
                        </SpotlightCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
