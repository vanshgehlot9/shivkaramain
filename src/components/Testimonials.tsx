"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, Plus, X, Loader2, Send, MessageSquare } from "lucide-react";
import { collection, query, orderBy, onSnapshot, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";
import SpotlightCard from "./ui/SpotlightCard";

// Initial static testimonials
const staticTestimonials = [
    {
        id: "static-1",
        name: "Rajesh Kumar",
        role: "CEO, TechFlow",
        content: "Shivkara Digital transformed our operations. Their ability to translate complex requirements into elegant code is unmatched.",
        rating: 5,
        static: true
    },
    {
        id: "static-2",
        name: "Priya Sharma",
        role: "Founder, DesignStudio",
        content: "The attention to UI detail paired with robust backend performance is rare. They delivered our app ahead of schedule.",
        rating: 5,
        static: true
    },
    {
        id: "static-3",
        name: "Amit Patel",
        role: "Director, RetailGiant",
        content: "Our e-commerce conversion rate doubled after the redesign. Their data-driven approach to UX is incredibly effective.",
        rating: 5,
        static: true
    },
    {
        id: "static-4",
        name: "Sarah Jenkins",
        role: "CTO, InnovateX",
        content: "Scalability was our main concern, and Shivkara nailed it. The architecture they built handles our traffic spikes effortlessly.",
        rating: 5,
        static: true
    },
    {
        id: "static-5",
        name: "David Chen",
        role: "VP Engineering, CloudScale",
        content: "Best dev shop we've worked with. Period. The code quality is top-tier.",
        rating: 5,
        static: true
    },
    {
        id: "static-6",
        name: "Elena Rodriguez",
        role: "Product Lead, FinSolve",
        content: "They understood our domain constraints perfectly. Secure, compliant, and fast.",
        rating: 5,
        static: true
    }
];

export default function Testimonials() {
    const [reviews, setReviews] = useState(staticTestimonials);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, COLLECTIONS.REVIEWS),
            orderBy("createdAt", "desc"),
            limit(20)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const firebaseReviews = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];
            setReviews([...firebaseReviews, ...staticTestimonials]);
        });

        return () => unsubscribe();
    }, []);

    const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
    const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

    return (
        <section id="testimonials" className="py-24 bg-black relative overflow-hidden border-t border-white/5">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />


            <div className="container mx-auto px-6 relative z-10 mb-16">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-green-500 font-mono text-xs tracking-widest uppercase">/// Live Feedback</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9]">
                            What They <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white">Say About Us</span>
                        </h2>
                    </motion.div>

                    <SpotlightCard className="p-1 rounded-full bg-gradient-to-r from-white/10 to-white/5">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-black hover:bg-white/5 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide text-sm transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4 text-shivkara-orange" />
                            Add Your Review
                        </button>
                    </SpotlightCard>
                </div>
            </div>

            {/* Marquee Rows */}
            <div className="relative flex flex-col gap-6 overflow-hidden">
                {/* Row 1 (Left) */}
                <div className="flex overflow-hidden group">
                    <motion.div
                        className="flex gap-6 min-w-full"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
                    >
                        {[...firstRow, ...firstRow].map((review, idx) => (
                            <ReviewCard key={`r1-${idx}`} review={review} />
                        ))}
                    </motion.div>
                </div>

                {/* Row 2 (Right) */}
                <div className="flex overflow-hidden group">
                    <motion.div
                        className="flex gap-6 min-w-full"
                        animate={{ x: ["-50%", "0%"] }}
                        transition={{ ease: "linear", duration: 45, repeat: Infinity }}
                    >
                        {[...secondRow, ...secondRow].map((review, idx) => (
                            <ReviewCard key={`r2-${idx}`} review={review} />
                        ))}
                    </motion.div>
                </div>
            </div>

            <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </section>
    );
}

function ReviewCard({ review }: { review: any }) {
    return (
        <div className="w-[350px] md:w-[450px] shrink-0 p-8 rounded-3xl bg-[#080808] border border-white/5 hover:border-shivkara-orange/30 transition-all duration-300 relative group overflow-hidden">
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-1">
                            {[...Array(review.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-shivkara-orange text-shivkara-orange" />
                            ))}
                        </div>
                        <Quote className="w-6 h-6 text-white/10 group-hover:text-white/20 transition-colors" />
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed font-light line-clamp-4">
                        "{review.content}"
                    </p>
                </div>

                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-white/5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white font-bold text-sm uppercase border border-white/5">
                        {review.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm leading-tight">{review.name}</h4>
                        <span className="text-gray-600 text-[10px] font-mono uppercase tracking-widest block mt-0.5">{review.role}</span>
                    </div>
                    {!review.static && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="Verified Real-time" />
                    )}
                </div>
            </div>
        </div>
    );
}

// Internal Review Modal Component
function ReviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDoc(collection(db, COLLECTIONS.REVIEWS), {
                name, role, content, rating,
                createdAt: serverTimestamp(),
                display: true
            });
            onClose();
            setName(""); setRole(""); setContent(""); setRating(5);
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-shivkara-orange to-purple-600" />

                        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>

                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Join the <br />Network</h2>
                        <p className="text-gray-400 text-sm mb-8">Your feedback shapes our future architecture.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-xs font-mono text-gray-500 uppercase tracking-widest pl-1 mb-2 block">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={`w-8 h-8 ${star <= (hoverRating || rating) ? "fill-shivkara-orange text-shivkara-orange" : "text-gray-800"}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Name"
                                    value={name} onChange={e => setName(e.target.value)} required
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none transition-colors"
                                />
                                <input
                                    placeholder="Role / Company"
                                    value={role} onChange={e => setRole(e.target.value)} required
                                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none transition-colors"
                                />
                            </div>

                            <textarea
                                placeholder="Your experience..."
                                value={content} onChange={e => setContent(e.target.value)} required rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-shivkara-orange outline-none transition-colors resize-none"
                            />

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Submit Review <Send className="w-4 h-4" /></>}
                            </button>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
