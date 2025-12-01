"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

// You'll need to create a client-side fetch for invoice details
// For now, I'll mock the fetch or assume you have a way to get it.
// In a real app, you'd fetch from /api/invoices/[id] (public or protected)

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

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    if (error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">{error}</div>;
    if (!invoice) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Invoice not found</div>;

    const isBookingInvoice = invoice.type === 'BOOKING_ADVANCE' || invoice.items.some(i => i.description.includes('Booking Advance'));
    const totalProjectValue = invoice.totalProjectValue || (isBookingInvoice ? Math.round(invoice.total / 0.3) : invoice.total);
    const remainingAmount = totalProjectValue - invoice.total;

    return (
        <main className="min-h-screen bg-black text-white selection:bg-[#FF7A00] selection:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "circOut" }}
                className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10"
            >
                {/* Header Section */}
                <div className="p-8 border-b border-white/5 bg-white/5 backdrop-blur-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-8 w-8 bg-[#FF7A00] rounded-lg flex items-center justify-center">
                                <span className="font-bold text-black text-lg">S</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Shivkara Digital</span>
                        </div>
                        <p className="text-sm text-gray-400">Invoice #{invoice.invoiceNumber}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${invoice.status === 'paid' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-[#FF7A00]/10 border-[#FF7A00]/20 text-[#FF7A00]'}`}>
                        {invoice.status === 'paid' ? 'Paid' : 'Payment Pending'}
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Payment Schedule Visualization */}
                    {isBookingInvoice && (
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <CheckCircle className="w-24 h-24 text-white" />
                            </div>

                            <h3 className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-widest">Project Payment Schedule</h3>

                            {/* Progress Bar */}
                            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-6">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '30%' }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`absolute left-0 top-0 h-full ${invoice.status === 'paid' ? 'bg-green-500' : 'bg-[#FF7A00]'} shadow-[0_0_10px_rgba(255,122,0,0.5)]`}
                                />
                                {/* Marker for 30% */}
                                <div className="absolute top-0 bottom-0 w-0.5 bg-black/50 left-[30%]" />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <p className={`text-sm font-bold mb-1 ${invoice.status === 'paid' ? 'text-green-500' : 'text-[#FF7A00]'}`}>
                                        {invoice.status === 'paid' ? 'Advance Paid' : 'Due Now (30%)'}
                                    </p>
                                    <p className="text-2xl font-bold text-white">₹{invoice.total.toLocaleString()}</p>
                                </div>
                                <div className="text-right opacity-60">
                                    <p className="text-sm font-bold text-gray-400 mb-1">On Completion (70%)</p>
                                    <p className="text-2xl font-bold text-white">₹{remainingAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Total Project Value</span>
                                <span className="text-sm font-bold text-white">₹{totalProjectValue.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Invoice Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Billed To</p>
                            <p className="font-medium text-lg text-white">{invoice.clientName}</p>
                            {/* <p className="text-sm text-gray-400 mt-1">client@example.com</p> */}
                        </div>
                        <div className="md:text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Due Date</p>
                            <p className="font-medium text-lg text-white">{new Date(invoice.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                    </div>

                    {/* Total Amount Section */}
                    <div className="pt-8 border-t border-white/10">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-sm text-gray-400 mb-1">Total Payable Amount</p>
                                <p className="text-xs text-gray-600">Including all taxes & fees</p>
                            </div>
                            <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                ₹{invoice.total.toLocaleString()}
                            </p>
                        </div>

                        {invoice.status !== 'paid' ? (
                            <button
                                onClick={handlePayment}
                                disabled={processing}
                                className="group w-full bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-black font-bold py-5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]"
                            >
                                {processing ? (
                                    <Loader2 className="animate-spin w-6 h-6" />
                                ) : (
                                    <>
                                        <span className="text-lg">Pay Now Securely</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 font-bold py-5 rounded-xl flex items-center justify-center gap-3">
                                <div className="bg-green-500 rounded-full p-1">
                                    <CheckCircle className="w-4 h-4 text-black" />
                                </div>
                                <span className="text-lg">Payment Received Successfully</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white/5 p-4 text-center border-t border-white/5">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Secured by Razorpay • 256-bit SSL Encryption
                    </p>
                </div>
            </motion.div>
        </main>
    );
}
