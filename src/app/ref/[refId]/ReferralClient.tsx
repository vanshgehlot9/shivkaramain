'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2, ArrowRight, X, Phone, Mail, User, Grid, Code2, Copy, Smartphone, Scan, Clock } from 'lucide-react';
import { createBootcampOrder } from './checkout-action';
import { cancelInvoice } from './cancel-action';

// Tilt Card Component
function TiltCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`relative transition-all duration-300 hover:scale-[1.02] ${className}`}>
            {children}
        </div>
    );
}

interface ReferralClientProps {
    status: 'loading' | 'success' | 'error';
    referrerName?: string;
    code: string;
    message?: string;
    bootcamp?: {
        id: string;
        name: string;
        price: number;
    } | null;
}

export default function ReferralClient({ status, referrerName, code, message, bootcamp }: ReferralClientProps) {
    const [processing, setProcessing] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [orderDetails, setOrderDetails] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

    // Countdown timer effect
    useEffect(() => {
        if (!showPayment || timeLeft <= 0) return;

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
    }, [showPayment, timeLeft]);

    // Reset timer when switching to payment step
    useEffect(() => {
        if (showPayment) {
            setTimeLeft(300);
        }
    }, [showPayment]);

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
        setShowPayment(false);
        setOrderDetails(null);
        setTimeLeft(300);
    }, [orderDetails]);

    // Timer expiry effect
    useEffect(() => {
        if (showPayment && timeLeft === 0) {
            handleCancelPayment();
        }
    }, [timeLeft, showPayment, handleCancelPayment]);

    // Warn before page unload
    useEffect(() => {
        if (!showPayment) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "Your payment session will be cancelled if you leave. Are you sure?";
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [showPayment]);

    // Default fallback if no bootcamp active (safety)
    const activeBootcamp = bootcamp || {
        id: 'spunk-2025',
        name: 'Full Stack Web Development (SPUNK 2025)',
        price: 7800
    };

    const discountPercent = 5;
    const discountAmount = Math.round((activeBootcamp.price * discountPercent) / 100);
    const finalPrice = activeBootcamp.price - discountAmount;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const order = await createBootcampOrder({
                ...formData,
                refId: code
            });

            if (order.success) {
                setOrderDetails(order);
                setShowPayment(true);
            } else {
                alert('Failed to initialize payment: ' + order.error);
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    // Placeholder UPI ID - Replace with actual ID provided by user later
    const UPI_ID = "vanshgehlot9@ybl";
    const UPI_NAME = "Shivkara Digital";

    if (status === 'error') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="text-red-500 w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold">Invalid Referral Code</h1>
                    <p className="text-gray-400">{message}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-sans overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1),rgba(0,0,0,1))]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] opacity-30 animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[100px] opacity-20" />
            </div>

            <main className="relative z-10 container mx-auto px-4 py-8 lg:py-16 flex flex-col items-center justify-center min-h-screen">

                <AnimatePresence mode="wait">
                    {!showPayment ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center"
                        >
                            {/* Left Column: Product Info */}
                            <div className="space-y-8 text-center lg:text-left">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium tracking-wide">
                                    REFERRAL ACTIVATED
                                </span>

                                <div className="space-y-2">
                                    <h1 className="text-4xl lg:text-6xl font-black tracking-tighter leading-[1.1]">
                                        Unlock Your <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                            Creative Potential
                                        </span>
                                    </h1>
                                    <p className="text-lg text-gray-400 max-w-md mx-auto lg:mx-0">
                                        Join the elite bootcamp with a special discount courtesy of <span className="text-white font-bold">{referrerName}</span>.
                                    </p>
                                </div>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm lg:max-w-md">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-gray-400">Regular Price</span>
                                        <span className="text-gray-400 line-through">₹{activeBootcamp.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-6 text-xl">
                                        <span className="font-bold text-white">Your Price</span>
                                        <div className="text-right">
                                            <span className="block font-black text-cyan-400">₹{finalPrice.toLocaleString()}</span>
                                            <span className="text-xs text-green-500 font-medium">You save ₹{discountAmount.toLocaleString()} via {code}</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Check size={14} className="text-cyan-500" /> Lifetime Access
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check size={14} className="text-cyan-500" /> Live Mentorship
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check size={14} className="text-cyan-500" /> Certificate
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Check size={14} className="text-cyan-500" /> Portfolio Building
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Checkout Form */}
                            <div className="w-full max-w-md mx-auto">
                                <div className="bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

                                    <h2 className="text-xl font-bold mb-6 relative z-10">Secure Enrollment</h2>

                                    <form onSubmit={handleCheckout} className="space-y-4 relative z-10">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-3 text-gray-500" size={16} />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.firstName}
                                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm placeholder-gray-600"
                                                        placeholder="John"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm placeholder-gray-600"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 text-gray-500" size={16} />
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm placeholder-gray-600"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 text-gray-500" size={16} />
                                                <input
                                                    required
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-sm placeholder-gray-600"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-xl shadow-cyan-900/20"
                                        >
                                            {processing ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={18} />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Pay ₹{finalPrice.toLocaleString()} & Join
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-center text-[10px] text-gray-500 pt-2">
                                            Secure Payment Gateway • Instant Access
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="payment"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full max-w-md mx-auto bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 backdrop-blur-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={handleCancelPayment}
                                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-gray-400 hover:text-white transition-colors z-10"
                            >
                                <X size={18} />
                            </button>
                            <div className="text-center mb-8">
                                <div className="mx-auto w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
                                    <Scan className="text-cyan-400 w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Complete Payment</h2>
                                <p className="text-gray-400 text-sm">Scan QR or use UPI to pay</p>
                                {/* Timer */}
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4 ${timeLeft <= 60 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                                    <Clock size={16} />
                                    <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                                    <span className="text-xs opacity-70">remaining</span>
                                </div>
                                <div className="mt-4 text-3xl font-black text-white">₹{orderDetails?.amount.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">Order ID: {orderDetails?.invoiceId}</div>
                            </div>

                            <div className="space-y-6">
                                {/* QR Code Placeholder */}
                                <div className="bg-white p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center shadow-lg overflow-hidden">
                                    <img src="/IMG_9994.jpg" alt="Scan QR Code" className="w-full h-full object-cover" />
                                </div>

                                {/* UPI ID */}
                                <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/10">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                                        <p className="font-mono text-cyan-400">{UPI_ID}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(UPI_ID)}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>

                                {/* UPI App Links */}
                                <div className="grid grid-cols-3 gap-3">
                                    <a href={`tez://upi/pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${orderDetails?.amount}&cu=INR`} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                                        <Smartphone size={20} className="text-blue-400" />
                                        <span className="text-[10px] text-gray-300">GPay</span>
                                    </a>
                                    <a href={`phonepe://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${orderDetails?.amount}&cu=INR`} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                                        <Smartphone size={20} className="text-purple-400" />
                                        <span className="text-[10px] text-gray-300">PhonePe</span>
                                    </a>
                                    <a href={`paytmmp://pay?pa=${UPI_ID}&pn=${UPI_NAME}&am=${orderDetails?.amount}&cu=INR`} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                                        <Smartphone size={20} className="text-cyan-400" />
                                        <span className="text-[10px] text-gray-300">Paytm</span>
                                    </a>
                                </div>
                                {/* Verification Message */}
                                <div className="p-4 bg-green-500/5 rounded-xl border border-green-500/20 text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Check size={16} className="text-green-500" />
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
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-500/50 placeholder-gray-600"
                                    />
                                    <p className="text-[10px] text-gray-500 text-left pl-1">Found in your payment app under transaction details</p>
                                </div>

                                {/* Contact Support */}
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-xs text-gray-400 mb-2">Need help with your payment?</p>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                                        <a href="mailto:support@shivkaradigital.com" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                                            <Mail size={14} />
                                            <span>support@shivkaradigital.com</span>
                                        </a>
                                        <a href="tel:+919876543210" className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors">
                                            <Phone size={14} />
                                            <span>+91 98765 43210</span>
                                        </a>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCancelPayment}
                                    className="w-full text-sm text-gray-500 hover:text-white py-2 transition-colors"
                                >
                                    Cancel Transaction
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Footer */}
                <footer className="mt-16 text-center text-gray-600 text-xs">
                    <p>© 2025 Shivkara Digital. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
}
