"use client";

import { useState, useEffect } from "react";
import {
    Users, Search, Filter, Phone, Mail, MapPin,
    MessageSquare, Calendar, Trash2, Loader2, ArrowUpRight
} from "lucide-react";
import { getLeads } from "@/lib/admin-api";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";

export default function LeadsPage() {
    const [loading, setLoading] = useState(true);
    const [leads, setLeads] = useState<any[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            setLoading(true);
            const result = await getLeads();
            if (result.success && result.data) {
                setLeads(result.data);
                setFilteredLeads(result.data);
            }
        } catch (error) {
            console.error("Error fetching leads:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = leads;
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(l =>
                l.name.toLowerCase().includes(lower) ||
                l.email.toLowerCase().includes(lower) ||
                l.phone?.includes(searchTerm)
            );
        }
        // Filter logic can be extended here if leads have status
        setFilteredLeads(result);
    }, [searchTerm, leads]);

    return (
        <div className="relative w-full min-h-screen text-white font-sans overflow-hidden perspective-1000">

            {/* Background Ambience - Purple/Teal Theme */}
            <div className="fixed inset-0 z-0 bg-black">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
                <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-teal-600/5 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
            </div>

            <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-8 space-y-12">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div className="relative">
                        <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-violet-500 to-transparent rounded-full opacity-50" />
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 filter drop-shadow-2xl"
                        >
                            LEADS
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-400 font-mono text-sm tracking-widest uppercase flex items-center gap-3"
                        >
                            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
                            Inquiry Pipeline
                        </motion.p>
                    </div>
                </div>

                {/* 3D Stats Deck */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
                    <TiltCard className="h-full">
                        <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
                            <div className="absolute -right-8 -top-8 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/30 transition-all" />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-violet-500/10 text-violet-400">
                                        <Users size={28} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Inquiries</p>
                                </div>
                                <p className="text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                                    {leads.length}
                                </p>
                            </div>
                        </div>
                    </TiltCard>

                    <TiltCard className="h-full">
                        <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
                            <div className="absolute -right-8 -top-8 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/30 transition-all" />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                {/* Placeholder for Conversion Rate or other metric */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-400">
                                        <ArrowUpRight size={28} />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Today</p>
                                </div>
                                <p className="text-6xl font-black text-white tracking-tighter">
                                    {leads.filter(l => new Date(l.createdAt).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                        </div>
                    </TiltCard>
                </div>

                {/* Search */}
                <div className="relative max-w-xl group">
                    <div className="absolute inset-0 bg-violet-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
                    <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden h-14">
                        <Search className="ml-6 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent border-none px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                            placeholder="Search leads by name, email, phone..."
                        />
                    </div>
                </div>

                {/* List */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        <div className="col-span-full h-64 flex items-center justify-center"><Loader2 className="animate-spin text-violet-500 w-8 h-8" /></div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-500">No leads found.</div>
                    ) : (
                        filteredLeads.map((lead, i) => (
                            <motion.div
                                key={lead.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-[#0A0A0A]/60 hover:bg-[#111] border border-white/5 hover:border-violet-500/30 rounded-[2rem] p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-900/10"
                            >
                                <div className="absolute top-4 right-4 w-2 h-2 bg-violet-500 rounded-full animate-pulse" />

                                <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors mb-1">{lead.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                        <Calendar size={12} />
                                        {new Date(lead.createdAt).toLocaleDateString("en-IN")}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a href={`mailto:${lead.email}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-violet-500/10 hover:text-violet-400 text-sm text-gray-300 transition-all">
                                        <Mail size={16} />
                                        <span className="truncate">{lead.email}</span>
                                    </a>
                                    {lead.phone && (
                                        <a href={`tel:${lead.phone}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-teal-500/10 hover:text-teal-400 text-sm text-gray-300 transition-all">
                                            <Phone size={16} />
                                            <span>{lead.phone}</span>
                                        </a>
                                    )}
                                    {lead.company && (
                                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 text-sm text-gray-300">
                                            <MapPin size={16} />
                                            <span>{lead.company} {lead.budget ? `(${lead.budget})` : ''}</span>
                                        </div>
                                    )}
                                </div>

                                {lead.message && (
                                    <div className="mt-2 p-4 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-400 italic">
                                        "{lead.message}"
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
