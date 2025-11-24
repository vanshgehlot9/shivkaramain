"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Users,
  FileText,
  BarChart3,
  Globe,
  Menu,
  X,
  LogOut,
  ChevronRight
} from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/income", icon: TrendingUp, label: "Income" },
  { href: "/admin/expenses", icon: TrendingDown, label: "Expenses" },
  { href: "/admin/cashbook", icon: BookOpen, label: "Cashbook" },
  { href: "/admin/clients", icon: Users, label: "Clients" },
  { href: "/admin/invoices", icon: FileText, label: "Invoices" },
  { href: "/admin/leads", icon: Users, label: "Leads" },
  { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  { href: "/admin/analytics", icon: Globe, label: "Traffic Analytics" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (!currentUser && pathname !== "/admin/login") {
        router.push("/admin/login");
      } else if (currentUser && pathname === "/admin/login") {
        router.push("/admin");
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/admin/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Verifying Access...</p>
        </div>
      </div>
    );
  }

  // If on login page, render only children (the login form)
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If not authenticated (and not on login page - though the effect should handle redirect), don't render content
  if (!user) {
    return null;
  }

  return (
    <div className="admin-dashboard min-h-screen bg-[#050505] text-[#F1EFEA] selection:bg-[#FF7A00] selection:text-black font-sans">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF7A00]/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#D93636]/5 blur-[150px] rounded-full" />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#FF7A00] to-[#D93636] rounded-lg flex items-center justify-center">
              <span className="font-black text-black text-lg">S</span>
            </div>
            <h1 className="text-lg font-bold tracking-tight">
              Shivkara Admin
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-0 h-screen w-72 bg-[#050505]/95 backdrop-blur-xl border-r border-white/5
            transform transition-transform duration-300 z-40 flex flex-col
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          {/* Logo/Brand */}
          <div className="px-8 py-8 mb-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF7A00] to-[#D93636] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                <span className="font-black text-black text-xl">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight leading-none">
                  Shivkara
                </h1>
                <span className="text-xs font-medium text-gray-500 tracking-widest uppercase">
                  Digital
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
            <div className="mb-4 px-4 text-xs font-bold text-gray-600 uppercase tracking-widest">
              Menu
            </div>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                        group flex items-center justify-between px-4 py-3.5 rounded-xl
                        transition-all duration-200 text-sm font-medium
                        ${isActive
                          ? "bg-white/10 text-white shadow-inner border border-white/5"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          size={20}
                          className={`transition-colors ${isActive ? "text-[#FF7A00]" : "text-gray-500 group-hover:text-gray-300"}`}
                        />
                        {item.label}
                      </div>
                      {isActive && (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] shadow-[0_0_8px_rgba(255,122,0,0.5)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Profile / Logout */}
          <div className="p-4 border-t border-white/5 bg-black/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 text-sm font-medium group"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                <LogOut size={14} />
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs font-bold text-white">{user?.email || "Admin User"}</div>
                <div className="text-[10px] text-gray-500">Sign out</div>
              </div>
              <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400" />
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-w-0">
          {/* Mobile Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className="min-h-screen p-4 lg:p-8 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


