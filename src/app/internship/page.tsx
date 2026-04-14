"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock3, Rocket, Send } from "lucide-react";

const domains = ["UI/UX Design", "Full Stack Development", "Generative AI", "Digital Marketing", "Power BI"];
const timelines = ["45 Days", "60 Days"];

export default function InternshipPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        domain: domains[0],
        timeline: timelines[0],
        collegeOrCompany: "",
        city: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const updateField = (key: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/internship", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to submit");
            }

            setStatus("success");
            setForm({
                name: "",
                email: "",
                phone: "",
                domain: domains[0],
                timeline: timelines[0],
                collegeOrCompany: "",
                city: "",
                message: "",
            });
        } catch (error) {
            console.error("Internship submit failed:", error);
            setStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-black min-h-screen text-white selection:bg-shivkara-orange selection:text-black">
            <Navbar />

            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-15 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-shivkara-orange/10 border border-shivkara-orange/30 text-shivkara-orange text-xs font-bold uppercase tracking-wider mb-6">
                                <Rocket className="w-3.5 h-3.5" />
                                Summer Internship 2026
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight mb-5">
                                Internship Program Details
                            </h1>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Learn with production teams, work on real projects, and build a strong portfolio.
                            </p>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                                    <Calendar className="w-4 h-4 text-shivkara-orange" />
                                    Batch Start: April 2026 onwards
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                                    <Clock3 className="w-4 h-4 text-shivkara-orange" />
                                    Timeline Options: 45 Days / 60 Days
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                                    <CheckCircle2 className="w-4 h-4 text-shivkara-orange" />
                                    Includes mentorship, live tasks, certificate, and review sessions
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10"
                        >
                            <h2 className="text-2xl font-black mb-6">Apply for Internship</h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    value={form.name}
                                    onChange={(e) => updateField("name", e.target.value)}
                                    placeholder="Full Name"
                                    required
                                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none"
                                />
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    placeholder="Email Address"
                                    required
                                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none"
                                />
                                <input
                                    value={form.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    placeholder="Phone Number"
                                    required
                                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none"
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <select
                                        value={form.domain}
                                        onChange={(e) => updateField("domain", e.target.value)}
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-shivkara-orange outline-none"
                                    >
                                        {domains.map((d) => (
                                            <option key={d} value={d} className="bg-black">{d}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={form.timeline}
                                        onChange={(e) => updateField("timeline", e.target.value)}
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white focus:border-shivkara-orange outline-none"
                                    >
                                        {timelines.map((t) => (
                                            <option key={t} value={t} className="bg-black">{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        value={form.collegeOrCompany}
                                        onChange={(e) => updateField("collegeOrCompany", e.target.value)}
                                        placeholder="College / Company"
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none"
                                    />
                                    <input
                                        value={form.city}
                                        onChange={(e) => updateField("city", e.target.value)}
                                        placeholder="City"
                                        className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none"
                                    />
                                </div>

                                <textarea
                                    value={form.message}
                                    onChange={(e) => updateField("message", e.target.value)}
                                    placeholder="Tell us your background and goals"
                                    rows={4}
                                    className="w-full rounded-xl bg-black/40 border border-white/10 px-4 py-3 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none resize-none"
                                />

                                {status === "success" && (
                                    <p className="text-sm text-green-400">Application submitted successfully.</p>
                                )}
                                {status === "error" && (
                                    <p className="text-sm text-red-400">Failed to submit. Please try again.</p>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full rounded-xl bg-white text-black font-bold py-3 hover:bg-shivkara-orange hover:text-white transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? "Submitting..." : "Submit Application"}
                                    {!isSubmitting && <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
