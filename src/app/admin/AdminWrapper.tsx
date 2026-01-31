"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
    LayoutDashboard,
    Users,
    FileText,
    BarChart3,
    Wallet,
    LogOut,
    Menu,
    X,
    TrendingUp,
    ArrowDownRight,
    BookOpen,
    Briefcase,
    Sparkles,
    ShieldCheck,
    Bell,
    Search,
    Command,
    ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Handle Authentication
    useEffect(() => {
        if (pathname === "/admin/login") {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                router.push("/admin/login");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, router]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const sidebarItems = [
        {
            section: "OVERVIEW", items: [
                { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
                { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
                { icon: BarChart3, label: "Reports", href: "/admin/reports" },
            ]
        },
        {
            section: "FINANCE", items: [
                { icon: Wallet, label: "Income", href: "/admin/income" },
                { icon: ArrowDownRight, label: "Expenses", href: "/admin/expenses" },
                { icon: FileText, label: "Invoices", href: "/admin/invoices" },
                { icon: BookOpen, label: "Cashbook", href: "/admin/cashbook" },
            ]
        },
        {
            section: "MANAGEMENT", items: [
                { icon: Users, label: "Leads", href: "/admin/leads" },
                { icon: Briefcase, label: "Clients", href: "/admin/clients" },
                { icon: Users, label: "Students", href: "/admin/students" },
            ]
        },
        {
            section: "ACADEMIC", items: [
                { icon: Sparkles, label: "Bootcamps", href: "/admin/bootcamps" },
                { icon: ShieldCheck, label: "Certificates", href: "/admin/certificates" },
            ]
        }
    ];

    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="relative min-h-screen bg-black text-white font-sans selection:bg-white/20">

            {/* Background - Clean & Deep (No dirty noise) */}
            <div className="fixed inset-0 z-0 bg-[#050505]" />

            <div className="relative z-10 flex h-screen overflow-hidden">

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-200 transition-all active:scale-95"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Sidebar */}
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    )}

                    {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
                        <motion.aside
                            key="sidebar"
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`
                                fixed lg:relative h-full 
                                ${isCollapsed ? 'w-[80px]' : 'w-[260px]'} 
                                bg-[#0a0a0a] border-r border-white/[0.06] 
                                flex flex-col z-50 transition-all duration-300 ease-in-out
                                ${!isSidebarOpen ? 'hidden lg:flex' : 'flex'}
                            `}
                        >
                            {/* Header */}
                            <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                                <Link href="/" className="flex items-center gap-3 group">
                                    {!isCollapsed ? (
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8">
                                                <Image src="/shivkara-logo.png" alt="Logo" fill className="object-contain" />
                                            </div>
                                            <span className="font-bold text-lg tracking-tight">Shivkara</span>
                                        </div>
                                    ) : (
                                        <div className="relative w-8 h-8">
                                            <Image src="/shivkara-logo.png" alt="Logo" fill className="object-contain" />
                                        </div>
                                    )}
                                </Link>
                                {!isCollapsed && (
                                    <button
                                        onClick={() => setIsCollapsed(true)}
                                        className="p-1.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors lg:block hidden"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Collapsed Expand Button */}
                            {isCollapsed && (
                                <button
                                    onClick={() => setIsCollapsed(false)}
                                    className="mx-auto mb-4 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Menu size={20} />
                                </button>
                            )}

                            {/* Search (Only when expanded) */}
                            {!isCollapsed && (
                                <div className="px-5 mb-6">
                                    <div className="relative group">
                                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-white transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="w-full bg-[#111] border border-white/5 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-white/10 focus:bg-[#161616] transition-all"
                                        />
                                        <div className="absolute right-2 top-2 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-gray-500 font-mono">
                                            ⌘K
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Nav Items */}
                            <nav className="flex-1 overflow-y-auto px-3 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {sidebarItems.map((group, i) => (
                                    <div key={i}>
                                        {!isCollapsed && (
                                            <h3 className="px-3 text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-2 font-mono">
                                                {group.section}
                                            </h3>
                                        )}
                                        <div className="space-y-1">
                                            {group.items.map((item) => {
                                                const isActive = pathname === item.href;
                                                return (
                                                    <Link
                                                        key={item.href}
                                                        href={item.href}
                                                        className={`
                                                            group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                                                            ${isActive
                                                                ? "bg-white text-black font-semibold shadow-lg shadow-white/5"
                                                                : "text-gray-400 hover:text-white hover:bg-white/5"}
                                                            ${isCollapsed ? 'justify-center' : ''}
                                                        `}
                                                        title={isCollapsed ? item.label : undefined}
                                                    >
                                                        <item.icon size={18} className={`${isActive ? "text-black" : "text-gray-400 group-hover:text-white"} transition-colors`} />
                                                        {!isCollapsed && (
                                                            <span>{item.label}</span>
                                                        )}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </nav>

                            {/* User Profile Footer */}
                            <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                                <div className={`flex items-center gap-3 p-2 rounded-xl transition-colors hover:bg-white/5 cursor-pointer ${isCollapsed ? 'justify-center' : ''}`}>
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                                        {user.email?.[0].toUpperCase()}
                                    </div>
                                    {!isCollapsed && (
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">Administrator</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    )}
                                    {!isCollapsed && (
                                        <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 transition-colors">
                                            <LogOut size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content Viewport */}
                <main className="flex-1 overflow-auto bg-[#050505] relative w-full">
                    {/* Sticky Header inside Main to allow scroll */}
                    <header className="sticky top-0 z-30 h-16 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="text-white font-medium capitalize">{pathname.split('/').filter(Boolean)[1] || 'Dashboard'}</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-500 tracking-wide">SYSTEM ONLINE</span>
                            </div>
                            <div className="w-[1px] h-5 bg-white/10" />
                            <button className="relative text-gray-400 hover:text-white transition-colors">
                                <Bell size={18} />
                                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />
                            </button>
                        </div>
                    </header>

                    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto min-h-[calc(100vh-64px)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
