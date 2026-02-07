"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, ArrowRight, User, Mail, Phone, Scan, Copy, Smartphone, CheckCircle, AlertCircle, Clock, ShieldAlert } from "lucide-react";
import { createBootcampOrder } from "@/app/ref/[refId]/checkout-action";
import { cancelInvoice } from "@/app/ref/[refId]/cancel-action";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    bootcampConfig?: {
        id: string;
        name: string;
        price: number;
    };
    referralCode?: string;
}

export default function CheckoutModal({ isOpen, onClose, bootcampConfig, referralCode = "" }: CheckoutModalProps) {
    const [step, setStep] = useState<"form" | "payment">("form");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    // Countdown timer effect
    useEffect(() => {
        if (step !== "payment" || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [step, timeLeft]);

    // Reset timer when switching to payment step
    useEffect(() => {
        if (step === "payment") {
            setTimeLeft(300);
        }
    }, [step]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle payment session cancellation
    const handleCancelPayment = useCallback(async () => {
        if (orderDetails?.invoiceId) {
            await cancelInvoice(orderDetails.invoiceId);
        }
        setStep("form");
        setOrderDetails(null);
        setTimeLeft(300);
    }, [orderDetails]);

    // Handle close with security check
    const handleSecureClose = async () => {
        if (step === "payment" && orderDetails?.invoiceId) {
            await handleCancelPayment();
        }
        onClose();
    };

    // Timer expiry effect
    useEffect(() => {
        if (step === "payment" && timeLeft === 0) {
            handleCancelPayment();
        }
    }, [timeLeft, step, handleCancelPayment]);

    // Warn before page unload
    useEffect(() => {
        if (step !== "payment") return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "Your payment session will be cancelled if you leave. Are you sure?";
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [step]);

    // Default configuration (Matches Design Lab) if not provided
    const defaultConfig = {
        id: "shivkara-design-lab",
        name: "Shivkara Design Lab",
        price: 1500
    };

    const config = bootcampConfig || defaultConfig;

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });

    // Payment Details (Synced with ReferralClient)
    const UPI_ID = "vanshgehlot9@ybl";
    const UPI_NAME = "Shivkara Digital";
    const QR_IMAGE = "/IMG_9994.jpg";

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            const order = await createBootcampOrder({
                ...formData,
                refId: referralCode // Pass empty string if no referral
            });

            if (order.success) {
                setOrderDetails(order);
                setStep("payment");
            } else {
                setError(order.error || "Failed to initialize payment");
            }
        } catch (err: any) {
            console.error("Checkout error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setProcessing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleSecureClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] cursor-pointer"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[101] flex items-start sm:items-center justify-center p-2 sm:p-4 pointer-events-none overflow-y-auto">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-[#0a0a0a] border border-white/10 w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl pointer-events-auto relative my-4 sm:my-0 max-h-[95vh] overflow-y-auto"
                        >
                            {/* Close Button - Sticky */}
                            <div className="sticky top-0 z-20 flex justify-end p-3 sm:p-4 bg-gradient-to-b from-[#0a0a0a] to-transparent">
                                <button
                                    onClick={handleSecureClose}
                                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Header Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-shivkara-orange via-orange-500 to-yellow-500" />

                            <div className="px-6 pb-6 sm:px-8 sm:pb-8 -mt-4">
                                {step === "form" ? (
                                    <>
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-bold text-white mb-2">Secure Your Spot</h2>
                                            <p className="text-gray-400 text-sm">
                                                Enter your details to reserve your seat for the <span className="text-white font-medium">{config.name}</span>.
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                                                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                                <span>{error}</span>
                                            </div>
                                        )}

                                        <form onSubmit={handleCheckout} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">First Name</label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-3 text-gray-500" size={16} />
                                                        <input
                                                            required
                                                            type="text"
                                                            value={formData.firstName}
                                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/50 transition-all text-sm placeholder-gray-600"
                                                            placeholder="John"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.lastName}
                                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/50 transition-all text-sm placeholder-gray-600"
                                                        placeholder="Doe"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/50 transition-all text-sm placeholder-gray-600"
                                                        placeholder="john@example.com"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 text-gray-500" size={16} />
                                                    <input
                                                        required
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-shivkara-orange/50 focus:ring-1 focus:ring-shivkara-orange/50 transition-all text-sm placeholder-gray-600"
                                                        placeholder="+91 98765 43210"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <div className="flex justify-between items-center mb-4 text-sm">
                                                    <span className="text-gray-400">Total Payable</span>
                                                    <div className="text-right">
                                                        <span className="block text-2xl font-black text-white">₹{config.price.toLocaleString()}</span>
                                                        {referralCode && <span className="text-xs text-green-500">Discount applied via {referralCode}</span>}
                                                    </div>
                                                </div>

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full bg-white text-black font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-xl hover:bg-gray-200"
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={18} />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Proceed to Payment
                                                            <ArrowRight size={18} />
                                                        </>
                                                    )}
                                                </button>
                                                <p className="text-center text-[10px] text-gray-500 pt-3">
                                                    Secure Payment Gateway • Instant Access
                                                </p>
                                            </div>
                                        </form>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className="mx-auto w-16 h-16 bg-shivkara-orange/10 rounded-full flex items-center justify-center mb-6">
                                            <Scan className="text-shivkara-orange w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Complete Payment</h2>
                                        <p className="text-gray-400 text-sm mb-6">Scan QR or use UPI to pay</p>

                                        <div className="mb-8">
                                            {/* Timer */}
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${timeLeft <= 60 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-shivkara-orange/10 text-shivkara-orange border border-shivkara-orange/20'}`}>
                                                <Clock size={16} />
                                                <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                                                <span className="text-xs opacity-70">remaining</span>
                                            </div>
                                            <div className="text-3xl font-black text-white mb-1">₹{orderDetails?.amount.toLocaleString()}</div>
                                            <div className="text-xs text-gray-500 font-mono">ID: {orderDetails?.invoiceId}</div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* QR Code */}
                                            <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg overflow-hidden relative group">
                                                <img src={QR_IMAGE} alt="Scan QR Code" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                    <Scan className="text-black/50 w-8 h-8" />
                                                </div>
                                            </div>

                                            {/* UPI ID */}
                                            <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10">
                                                <div className="text-left pl-2">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">UPI ID</p>
                                                    <p className="font-mono text-shivkara-orange text-sm">{UPI_ID}</p>
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(UPI_ID)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                                    title="Copy UPI ID"
                                                >
                                                    <Copy size={16} />
                                                </button>
                                            </div>

                                            {/* UPI App Links */}
                                            <div className="grid grid-cols-3 gap-3">
                                                <a href={`tez://upi/pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${orderDetails?.amount}&cu=INR`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                                                    <Smartphone size={18} className="text-blue-400" />
                                                    <span className="text-[10px] text-gray-300">GPay</span>
                                                </a>
                                                <a href={`phonepe://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${orderDetails?.amount}&cu=INR`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                                                    <Smartphone size={18} className="text-purple-400" />
                                                    <span className="text-[10px] text-gray-300">PhonePe</span>
                                                </a>
                                                <a href={`paytmmp://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${orderDetails?.amount}&cu=INR`} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                                                    <Smartphone size={18} className="text-cyan-400" />
                                                    <span className="text-[10px] text-gray-300">Paytm</span>
                                                </a>
                                            </div>

                                            {/* Verification Message */}
                                            <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/20 text-left">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle size={16} className="text-green-500" />
                                                    <span className="text-green-400 font-bold text-sm">Payment verified within 10 mins</span>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">
                                                    After you complete the payment, we'll verify it and send your Student ID and portal login details to your registered email.
                                                </p>
                                            </div>

                                            {/* UTR Input */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] text-gray-500 uppercase tracking-wider block text-left pl-1">UTR / Transaction Reference (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your 12-digit UTR number for faster verification"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-shivkara-orange/50 placeholder-gray-600"
                                                />
                                                <p className="text-[10px] text-gray-500 text-left pl-1">Found in your payment app under transaction details</p>
                                            </div>

                                            {/* Contact Support */}
                                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                                <p className="text-xs text-gray-400 mb-2">Need help with your payment?</p>
                                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                                                    <a href="mailto:support@shivkaradigital.com" className="flex items-center gap-2 text-shivkara-orange hover:text-orange-400 transition-colors">
                                                        <Mail size={14} />
                                                        <span>support@shivkaradigital.com</span>
                                                    </a>
                                                    <a href="tel:+919876543210" className="flex items-center gap-2 text-shivkara-orange hover:text-orange-400 transition-colors">
                                                        <Phone size={14} />
                                                        <span>+91 98765 43210</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )
            }
        </AnimatePresence >
    );
}
