"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Loader2, Search, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";
import { getInternshipApplications, updateInternshipApplicationStatus } from "@/lib/admin-api";

type ApplicationStatus = "pending" | "approved" | "declined";

interface InternshipApplication {
    id: string;
    name: string;
    email: string;
    phone: string;
    domain: string;
    timeline: string;
    collegeOrCompany?: string;
    city?: string;
    message?: string;
    status: ApplicationStatus;
    createdAt: string;
}

export default function AdminInternshipPage() {
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState<InternshipApplication[]>([]);
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchApplications(1, "");
    }, []);

    const fetchApplications = async (pageNum: number = 1, searchQuery: string = "") => {
        try {
            setLoading(true);
            setPage(pageNum);
            const result = await getInternshipApplications(pageNum, 20, searchQuery) as any;
            if (result.success && result.data) {
                setApplications(result.data as InternshipApplication[]);
                if (result.pagination) {
                    setPagination(result.pagination);
                }
            }
        } catch (error) {
            console.error("Error fetching internship applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (searchTimeout) clearTimeout(searchTimeout);
        setSearchTimeout(
            setTimeout(() => {
                fetchApplications(1, value);
            }, 300)
        );
    };

    const updateStatus = async (id: string, status: ApplicationStatus) => {
        try {
            setUpdatingId(id);
            const result = await updateInternshipApplicationStatus(id, status);
            if (result.success) {
                setApplications((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
            }
        } catch (error) {
            console.error("Error updating application status:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const statusClasses: Record<ApplicationStatus, string> = {
        pending: "bg-amber-500/10 border-amber-500/30 text-amber-300",
        approved: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
        declined: "bg-red-500/10 border-red-500/30 text-red-300",
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">INTERNSHIP APPLICATIONS</h1>
                <p className="text-gray-400 mt-2">Approve or decline internship students directly from here.</p>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-xl">
                    <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by student, email, domain..."
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-shivkara-orange"
                    />
                </div>
                <div className="text-sm text-gray-400">
                    Showing {applications.length} of {pagination.total}
                </div>
            </div>

            {loading ? (
                <div className="h-48 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 animate-spin text-shivkara-orange" />
                </div>
            ) : applications.length === 0 ? (
                <div className="p-10 rounded-3xl border border-white/10 bg-white/[0.03] text-gray-400">No internship applications found.</div>
            ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {applications.map((item: InternshipApplication, index: number) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                        >
                            <TiltCard>
                                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{item.name}</h3>
                                            <p className="text-sm text-gray-400">{item.email}</p>
                                        </div>
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border font-mono ${statusClasses[item.status || "pending"]}`}>
                                            {item.status || "pending"}
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-300 space-y-1">
                                        <p><span className="text-gray-500">Phone:</span> {item.phone}</p>
                                        <p><span className="text-gray-500">Domain:</span> {item.domain}</p>
                                        <p><span className="text-gray-500">Timeline:</span> {item.timeline}</p>
                                        {(item.collegeOrCompany || item.city) && (
                                            <p><span className="text-gray-500">Profile:</span> {[item.collegeOrCompany, item.city].filter(Boolean).join(" • ")}</p>
                                        )}
                                        {item.message && (
                                            <p className="text-gray-400 italic pt-1">"{item.message}"</p>
                                        )}
                                    </div>

                                    <div className="pt-2 flex items-center gap-3">
                                        <button
                                            onClick={() => updateStatus(item.id, item.status === "approved" ? "pending" : "approved")}
                                            disabled={updatingId === item.id}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors disabled:opacity-50 ${
                                                item.status === "approved"
                                                    ? "bg-emerald-500/30 border-emerald-500/60 text-emerald-200 hover:bg-emerald-500/20"
                                                    : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25"
                                            }`}
                                        >
                                            {updatingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            {item.status === "approved" ? "Approved" : "Approve"}
                                        </button>
                                        <button
                                            onClick={() => updateStatus(item.id, item.status === "declined" ? "pending" : "declined")}
                                            disabled={updatingId === item.id}
                                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors disabled:opacity-50 ${
                                                item.status === "declined"
                                                    ? "bg-red-500/30 border-red-500/60 text-red-200 hover:bg-red-500/20"
                                                    : "bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25"
                                            }`}
                                        >
                                            {updatingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserX className="w-4 h-4" />}
                                            {item.status === "declined" ? "Declined" : "Decline"}
                                        </button>
                                        <div className="ml-auto text-xs text-gray-500 inline-flex items-center gap-1.5">
                                            <Clock3 className="w-3 h-3" />
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-IN") : "-"}
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>
                {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => fetchApplications(page - 1, search)}
                            disabled={page === 1 || loading}
                            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                                const pageNum = page > 3 ? page - 2 + i : i + 1;
                                if (pageNum > pagination.pages) return null;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => fetchApplications(pageNum, search)}
                                        className={`px-3 py-1 rounded-lg text-sm ${
                                            pageNum === page
                                                ? "bg-shivkara-orange text-white"
                                                : "bg-white/10 text-gray-300 hover:bg-white/20"
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            onClick={() => fetchApplications(page + 1, search)}
                            disabled={page === pagination.pages || loading}
                            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                        <div className="text-sm text-gray-400 ml-4">
                            Page {page} of {pagination.pages}
                        </div>
                    </div>
                )}
                </>
            )}
        </div>
    );
}
