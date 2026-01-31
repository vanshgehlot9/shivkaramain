"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

interface InvoiceDetails {
    id: string;
    invoiceNumber: string;
    clientName: string;
    total: number;
    status: string;
    items: any[];
    dueDate: string;
    type?: string;
    totalProjectValue?: number;
}

export default function PaymentPage() {
    const params = useParams();
    const invoiceId = params.invoiceId as string;

    const [invoice, setInvoice] = useState<InvoiceDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const res = await fetch(`/api/public/invoices/${invoiceId}`);
                const data = await res.json();
                if (data.success) setInvoice(data.data);
                else setError(data.error);
            } catch (err) {
                setError("Failed to load invoice.");
            } finally {
                setLoading(false);
            }
        };

        if (invoiceId) fetchInvoice();
    }, [invoiceId]);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const res = await fetch('/api/admin/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId })
            });
            const data = await res.json();

            if (!data.success) throw new Error(data.error);

            const options = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "Shivkara Digital",
                description: `Payment for ${invoice?.invoiceNumber}`,
                order_id: data.orderId,
                handler: function (response: any) {
                    alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
                    window.location.reload();
                },
                prefill: {
                    name: invoice?.clientName,
                },
                theme: { color: "#FF7A00" }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

        } catch (err: any) {
            alert("Payment initialization failed: " + err.message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center text-white gap-4">
            <Loader2 className="animate-spin text-shivkara-orange w-10 h-10" />
            <p className="text-gray-500 font-mono text-sm tracking-widest uppercase animate-pulse">Retrieving Invoice...</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-8 rounded-3xl max-w-md w-full text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Invoice Not Found</h2>
                <p className="text-sm opacity-80">{error}</p>
            </div>
        </div>
    );

    if (!invoice) return null;

    const isBookingInvoice = invoice.type === 'BOOKING_ADVANCE' || invoice.items.some(i => i.description.includes('Booking Advance'));
    const totalProjectValue = invoice.totalProjectValue || (isBookingInvoice ? Math.round(invoice.total / 0.3) : invoice.total);
    const remainingAmount = totalProjectValue - invoice.total;

    return (
        <main className="min-h-screen bg-[#030303] text-white font-sans selection:bg-shivkara-orange/30 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">

            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-shivkara-orange/5 to-purple-500/5 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-3xl bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[40px] overflow-hidden shadow-2xl relative z-10"
            >
                {/* Header Brand */}
                <div className="p-8 md:p-10 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-gradient-to-br from-shivkara-orange to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <span className="font-black text-white text-xl">S</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-white leading-none mb-1">Shivkara Digital</h1>
                            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Secure Payment Gateway</p>
                        </div>
                    </div>

                    <div className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest border flex items-center gap-2
                        ${invoice.status === 'paid'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            : 'bg-shivkara-orange/10 border-shivkara-orange/20 text-shivkara-orange'
                        }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${invoice.status === 'paid' ? 'bg-emerald-400' : 'bg-shivkara-orange animate-pulse'}`} />
                        {invoice.status === 'paid' ? 'Paid In Full' : 'Payment Pending'}
                    </div>
                </div>

                <div className="p-8 md:p-10 space-y-10">

                    {/* Invoice Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Invoice #</p>
                            <p className="font-mono text-lg text-white font-medium">{invoice.invoiceNumber}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Billed To</p>
                            <p className="font-bold text-lg text-white">{invoice.clientName}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Issue Date</p>
                            <p className="font-mono text-gray-300">{new Date().toLocaleDateString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Due Date</p>
                            <p className="font-mono text-shivkara-orange">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
                        </div>
                    </div>

                    {/* Booking/Progress Visualization */}
                    {isBookingInvoice && (
                        <div className="bg-white/[0.03] rounded-3xl p-8 border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                <CreditCard className="w-32 h-32 text-white" />
                            </div>

                            <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                                Project Timeline
                                <div className="h-px w-full bg-white/10" />
                            </h3>

                            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-8">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '30%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className={`absolute left-0 top-0 h-full ${invoice.status === 'paid' ? 'bg-emerald-500' : 'bg-gradient-to-r from-shivkara-orange to-red-500'} shadow-[0_0_20px_rgba(255,122,0,0.4)]`}
                                />
                                <div className="absolute top-0 bottom-0 w-0.5 bg-white/20 left-[30%]" />
                            </div>

                            <div className="flex justify-between items-end">
                                <div>
                                    <p className={`text-sm font-bold mb-1 ${invoice.status === 'paid' ? 'text-emerald-400' : 'text-shivkara-orange'}`}>
                                        {invoice.status === 'paid' ? 'Advance Received' : 'Due Now (30%)'}
                                    </p>
                                    <p className="text-3xl font-black text-white">₹{invoice.total.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-500 mb-1">On Completion (70%)</p>
                                    <p className="text-2xl font-bold text-gray-300">₹{remainingAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Total & Action */}
                    <div className="pt-8 border-t border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                            <div>
                                <p className="text-sm text-gray-400 mb-2">Total Payable Amount</p>
                                <div className="flex items-center gap-2 text-[10px] text-gray-600 uppercase tracking-wider font-bold bg-white/5 px-2 py-1 rounded border border-white/5 w-fit">
                                    <ShieldCheck size={12} className="text-emerald-500" />
                                    Secure & Encrypted
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                                    ₹{invoice.total.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {invoice.status !== 'paid' ? (
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="group relative w-full overflow-hidden bg-white text-black font-black uppercase tracking-widest py-6 rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-shivkara-orange via-white to-shivkara-orange opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                                {processing ? (
                                    <>
                                        <Loader2 className="animate-spin w-6 h-6" />
                                        <span>Processing Transaction...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-lg relative z-10">Pay Invoice Securely</span>
                                        <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold py-6 rounded-2xl flex items-center justify-center gap-3">
                                <div className="bg-emerald-500/20 rounded-full p-1.5">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="text-lg tracking-wide uppercase">Transaction Complete</span>
                            </div>
                        )}

                        <p className="text-center text-xs text-gray-600 mt-6 font-mono tracking-wider">
                            POWERED BY RAZORPAY • 256-BIT SSL ENCRYPTION • INSTANT VERIFICATION
                        </p>
                    </div>

                </div>
            </motion.div>
        </main>
    );
}
