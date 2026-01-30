"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Lock, Loader2, RefreshCw, Mail, Phone, Package, DollarSign } from "lucide-react";

export default function AdminInquiries() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState("");
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === "shivkara123") { // Simple hardcoded PIN
            setIsAuthenticated(true);
            fetchInquiries();
        } else {
            alert("Invalid PIN");
        }
    };

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/inquiries');
            const data = await res.json();
            setInquiries(data.inquiries);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-8 h-8 text-shivkara-orange" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-6">Admin Access</h2>
                    <input
                        type="password"
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white text-center tracking-widest text-xl mb-6 focus:outline-none focus:border-shivkara-orange transition-colors"
                        placeholder="Enter PIN"
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Unlock Dashboard
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">Lead Dashboard</h1>
                        <p className="text-gray-400">Manage incoming price inquiries and project requests.</p>
                    </div>
                    <button
                        onClick={fetchInquiries}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh Data
                    </button>
                </div>

                {loading && inquiries.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-shivkara-orange" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {inquiries.length === 0 ? (
                            <div className="text-center py-20 bg-[#0A0A0A] rounded-3xl border border-white/5">
                                <p className="text-gray-500">No inquiries found yet.</p>
                            </div>
                        ) : (
                            inquiries.map((inquiry) => (
                                <div key={inquiry.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-white/10 transition-colors">
                                    <div className="flex flex-col md:flex-row justify-between gap-6">
                                        {/* Contact Info */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-white">{inquiry.name}</h3>
                                                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">
                                                    {format(new Date(inquiry.date), "MMM d, h:mm a")}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-gray-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" /> {inquiry.email}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4" /> {inquiry.phone}
                                                </div>
                                            </div>
                                            {inquiry.details && (
                                                <div className="mt-4 p-4 bg-white/[0.02] rounded-xl border border-white/5 text-sm text-gray-300">
                                                    "{inquiry.details}"
                                                </div>
                                            )}
                                        </div>

                                        {/* Project Details */}
                                        <div className="md:w-80 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8">
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Package</div>
                                                    <div className="flex items-center gap-2 text-shivkara-orange font-bold">
                                                        <Package className="w-4 h-4" />
                                                        {inquiry.package}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Estimated Budget</div>
                                                    <div className="flex items-center gap-2 text-white font-mono text-lg">
                                                        <DollarSign className="w-4 h-4 text-green-500" />
                                                        ₹{inquiry.price.toLocaleString()}
                                                    </div>
                                                </div>
                                                {inquiry.addons && inquiry.addons.length > 0 && (
                                                    <div>
                                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Add-ons</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {inquiry.addons.map((addon: string, i: number) => (
                                                                <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-400">
                                                                    {addon}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
