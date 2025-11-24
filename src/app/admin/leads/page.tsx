"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Mail, Phone, Calendar, User } from "lucide-react";
import { getLeads } from "@/lib/admin-api";

export default function LeadsPage() {
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const result = await getLeads();
            if (result.success && result.data) {
                setLeads(result.data);
            } else {
                setLeads([]);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
            setLeads([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
    );

    return (
        <div className="p-6 lg:p-8 min-h-screen space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Leads</h1>
                    <p className="text-white/60">Manage and track your website leads</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="rounded-3xl bg-[#111111]/50 backdrop-blur-xl border border-white/5 overflow-hidden">
                {/* Controls Bar */}
                <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row gap-6 justify-between items-center">
                    {/* Search & Filter */}
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        <div className="relative flex-1 lg:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF7A00]/50 transition-colors"
                            />
                        </div>
                        <button className="p-2.5 bg-black/20 border border-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Budget</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Contact Info</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
                                            <p className="text-sm font-medium animate-pulse">Loading leads...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 rounded-full bg-white/5">
                                                <User className="w-8 h-8 opacity-50" />
                                            </div>
                                            <p className="text-sm font-medium">No leads found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4D00] flex items-center justify-center text-black font-bold text-xs">
                                                    {lead.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-white group-hover:text-[#FF7A00] transition-colors">
                                                    {lead.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/80">
                                            {lead.company || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/80">
                                            {lead.budget || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-white/80">
                                                    <Mail className="w-3 h-3 text-white/40" />
                                                    {lead.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-white/60">
                                                    <Phone className="w-3 h-3 text-white/40" />
                                                    {lead.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3 text-white/40" />
                                                {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-blue-500/10 text-blue-500 border-blue-500/20">
                                                {lead.status || 'New'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
