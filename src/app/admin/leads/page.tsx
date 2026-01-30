"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, RefreshCw, Mail, Phone, Package, DollarSign, Search, Filter } from "lucide-react";

export default function LeadsPage() {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

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

    useEffect(() => {
        fetchInquiries();
    }, []);

    const filteredInquiries = inquiries.filter(i =>
        i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">Leads</h2>
                    <p className="text-gray-400 text-sm">Manage incoming price inquiries and project requests.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-shivkara-orange/50 transition-colors"
                        />
                    </div>
                    <button
                        onClick={fetchInquiries}
                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* List */}
            {loading && inquiries.length === 0 ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-shivkara-orange" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredInquiries.length === 0 ? (
                        <div className="text-center py-20 bg-[#080808] rounded-3xl border border-white/5 border-dashed">
                            <p className="text-gray-500 text-sm">No inquiries found matching your search.</p>
                        </div>
                    ) : (
                        filteredInquiries.map((inquiry) => (
                            <div key={inquiry.id} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all group">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    {/* Contact Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center font-bold text-white">
                                                    {inquiry.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white leading-tight">{inquiry.name}</h3>
                                                    <div className="text-xs text-gray-500">{format(new Date(inquiry.date), "MMM d, h:mm a")}</div>
                                                </div>
                                            </div>
                                            <span className="md:hidden text-xs bg-shivkara-orange/10 text-shivkara-orange px-2 py-1 rounded font-bold uppercase">
                                                New
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-gray-400 text-sm ml-13 pl-13 md:pl-0 md:ml-12">
                                            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                                                <Mail className="w-3.5 h-3.5" /> {inquiry.email}
                                            </div>
                                            <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
                                                <Phone className="w-3.5 h-3.5" /> {inquiry.phone}
                                            </div>
                                        </div>

                                        {inquiry.details && (
                                            <div className="mt-4 md:ml-12 p-3 bg-white/[0.02] rounded-xl border border-white/5 text-sm text-gray-300 italic">
                                                "{inquiry.details}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Project Details */}
                                    <div className="md:w-64 md:border-l border-white/5 md:pl-6 flex flex-col justify-center">
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Package</div>
                                                <div className="text-xs bg-white/5 px-2 py-0.5 rounded text-gray-300">{inquiry.category}</div>
                                            </div>
                                            <div className="font-bold text-white flex items-center gap-2">
                                                <Package className="w-4 h-4 text-shivkara-orange" />
                                                {inquiry.package}
                                            </div>
                                            <div className="pt-2 border-t border-white/5 flex justify-between items-center">
                                                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Budget</div>
                                                <div className="font-mono font-bold text-green-500">₹{inquiry.price.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
