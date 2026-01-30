"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
  Lock,
  Menu,
  X,
  TrendingUp,
  ArrowDownRight,
  BookOpen,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Handle Authentication
  useEffect(() => {
    // Bypass auth check for login page
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
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Users, label: "Leads", href: "/admin/leads" },
    { icon: Wallet, label: "Income", href: "/admin/income" },
    { icon: ArrowDownRight, label: "Expenses", href: "/admin/expenses" },
    { icon: Briefcase, label: "Clients", href: "/admin/clients" },
    { icon: BookOpen, label: "Cashbook", href: "/admin/cashbook" },
    { icon: FileText, label: "Invoices", href: "/admin/invoices" },
    { icon: BarChart3, label: "Reports", href: "/admin/reports" },
    { icon: TrendingUp, label: "Traffic Analytics", href: "/admin/analytics" },
    // Certificate Verification System
    { icon: BookOpen, label: "Bootcamps", href: "/admin/bootcamps" },
    { icon: Users, label: "Students", href: "/admin/students" },
    { icon: FileText, label: "Certificates", href: "/admin/certificates" },
  ];

  // If on login page, just render it without the admin shell
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-shivkara-orange/30 border-t-shivkara-orange rounded-full animate-spin" />
      </div>
    );
  }

  // If not authenticated (and not on login page), we don't render anything 
  // because the useEffect will trigger the redirect. 
  // But just in case, we return null or the loading spinner.
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-shivkara-orange text-black rounded-full flex items-center justify-center shadow-lg"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed lg:sticky top-0 left-0 w-[240px] h-screen bg-[#080808] border-r border-white/5 flex flex-col z-40"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-shivkara-orange flex items-center justify-center font-bold text-black">S</div>
                <div>
                  <h1 className="font-bold text-lg leading-none">Shivkara</h1>
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest">Digital</span>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <div className="px-4 py-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">Menu</div>
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                      ? "bg-white/5 text-white border border-white/10"
                      : "text-gray-400 hover:text-white hover:bg-white/[0.02]"
                      }`}
                  >
                    <item.icon size={18} className={isActive ? "text-shivkara-orange" : ""} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-shivkara-orange" />}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all text-left"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Log Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden w-full max-w-[1600px] mx-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
