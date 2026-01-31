"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2, ArrowRight } from "lucide-react";

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialPlan?: any;
}

export default function BookingModal({ isOpen, onClose, initialPlan }: BookingModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [invoiceId, setInvoiceId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        service: initialPlan ? initialPlan.name : "WEBSITE",
        budget: "",
        message: ""
    });

    // Update form data when initialPlan changes
    React.useEffect(() => {
        if (initialPlan) {
            setFormData(prev => ({ ...prev, service: initialPlan.name }));
        }
    }, [initialPlan]);

    const services = [
        { id: "Starter", label: "Starter (₹6k)", price: "₹6,000", rawPrice: 6000 },
        { id: "Professional", label: "Professional (₹15k)", price: "₹15,000", rawPrice: 15000 },
        { id: "Business", label: "Business (₹25k)", price: "₹25,000", rawPrice: 25000 },
        { id: "Premium", label: "Premium (₹70k)", price: "₹70,000", rawPrice: 70000 },
        { id: "Enterprise", label: "Enterprise (₹1L+)", price: "₹1,00,000+", rawPrice: 100000 },
        { id: "WEBSITE", label: "Custom Project", price: "Custom Quote", rawPrice: 0 },
    ];

    const getAdvanceAmount = () => {
        if (initialPlan && initialPlan.rawPrice) {
            return Math.round(initialPlan.rawPrice * 0.30);
        }
        const selectedService = services.find(s => s.id === formData.service);
        if (selectedService && selectedService.rawPrice > 0) {
            return Math.round(selectedService.rawPrice * 0.30);
        }
        return 4000; // Default fallback for custom/unknown
    };

    const advanceAmount = getAdvanceAmount();

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Create Booking Order
            const res = await fetch('/api/public/book-project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    amount: advanceAmount, // Send calculated advance
                    totalValue: initialPlan?.rawPrice || services.find(s => s.id === formData.service)?.rawPrice || 0
                })
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            // Store invoice ID for redirection
            if (data.invoiceId) setInvoiceId(data.invoiceId);

            // 2. Open Razorpay
            const options = {
                key: data.keyId,
                amount: data.amount, // 400000 paise
                currency: "INR",
                name: "Shivkara Digital",
                description: `Booking Advance (${formData.service})`,
                order_id: data.orderId,
                handler: function (response: any) {
                    setStep(3); // Success Step
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#FF7A00" }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            alert("Booking failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#111111]">
                            <div>
                                <h2 className="text-xl font-bold text-white">Start Your Project</h2>
                                <p className="text-xs text-white/60">Secure your slot with a 30% advance</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">Name</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF7A00] outline-none"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-white/60 mb-1 block">Phone</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF7A00] outline-none"
                                                placeholder="+91..."
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/60 mb-1 block">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#FF7A00] outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-white/60 mb-1 block">Service Plan</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {services.slice(0, 6).map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => setFormData({ ...formData, service: s.id })}
                                                    className={`p-3 rounded-xl border text-left transition-all ${formData.service === s.id ? 'bg-[#FF7A00]/10 border-[#FF7A00] text-white' : 'bg-white/5 border-transparent text-white/60 hover:bg-white/10'}`}
                                                >
                                                    <div className="font-bold text-sm">{s.label}</div>
                                                    <div className="text-xs opacity-60">{s.price}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!formData.name || !formData.email || !formData.phone}
                                        className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 text-center py-4">
                                    <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-2xl p-6">
                                        <p className="text-sm text-[#FF7A00] font-bold uppercase tracking-wider mb-2">Booking Advance (30%)</p>
                                        <h3 className="text-4xl font-black text-white mb-1">₹{advanceAmount.toLocaleString()}</h3>
                                        <p className="text-xs text-white/60">
                                            Total Project Value: ₹{initialPlan?.rawPrice?.toLocaleString() || services.find(s => s.id === formData.service)?.rawPrice?.toLocaleString() || "Custom"}
                                        </p>
                                    </div>

                                    <div className="text-left space-y-3 text-sm text-white/80 bg-white/5 p-4 rounded-xl">
                                        <div className="flex justify-between">
                                            <span>Service Plan</span>
                                            <span className="font-bold text-white">{formData.service}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Client</span>
                                            <span className="font-bold text-white">{formData.name}</span>
                                        </div>
                                        <div className="pt-3 border-t border-white/10 text-xs text-white/40">
                                            By proceeding, you agree that this 30% booking advance is non-refundable and secures your project slot. The remaining 70% is due upon project completion.
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full py-4 bg-[#FF7A00] text-black font-bold rounded-xl hover:bg-[#FF7A00]/90 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : `Pay ₹${advanceAmount.toLocaleString()} & Start`}
                                    </button>

                                    <button onClick={() => setStep(1)} className="text-xs text-white/40 hover:text-white">Back to details</button>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h3>
                                    <p className="text-white/60 mb-8">
                                        We have received your advance. You can now view your project dashboard and invoice details.
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        {invoiceId && (
                                            <button
                                                onClick={() => window.location.href = `/pay/${invoiceId}`}
                                                className="w-full py-4 bg-[#FF7A00] text-black font-bold rounded-xl hover:bg-[#FF7A00]/90 transition-colors flex items-center justify-center gap-2"
                                            >
                                                View Invoice & Dashboard <ArrowRight className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={onClose}
                                            className="px-8 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
