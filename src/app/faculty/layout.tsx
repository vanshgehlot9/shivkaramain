import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { adminApp } from "@/lib/firebase-admin-config";
import { isFaculty } from "@/lib/auth-utils";
import {
    LayoutDashboard,
    Calendar,
    CheckCircle,
    Users,
    Settings,
    LogOut
} from "lucide-react";

// Server-side auth check
async function checkAccess() {
    // In a real app with Middleware, we'd handle this differently.
    // For now, we will assume client-side auth handles the token, 
    // but we should verify session if using cookies.
    // Since this is a new path, we'll verify via a server action or client-side context usually.
    // However, Next.js Layouts are Server Components.

    // Checking headers for mock/dev purposes or session cookies if implemented.
    // NOTE: For this implementation, we will perform a client-side redirection wrapper 
    // or assume session cookies are present. 
    // Given the existing Admin uses `AdminWrapper.tsx` (Client Component), 
    // we will follow a similar pattern for RBAC to be safe.

    return true;
}

export default async function FacultyLayout({ children }: { children: React.ReactNode }) {
    // We'll wrap in a client-side protector similar to AdminWrapper
    // But for now, let's build the UI structure.

    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">

            {/* Sidebar */}
            <aside className="w-64 fixed inset-y-0 left-0 border-r border-white/10 bg-black/50 backdrop-blur-xl z-50 flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="text-xl font-bold tracking-tighter text-white">
                        SHIVKARA <span className="text-orange-500">FACULTY</span>
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-1">OPERATIONS OS</div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <NavItem href="/faculty" icon={<LayoutDashboard size={18} />} label="Overview" />
                    <div className="h-px bg-white/5 my-2 mx-2" />
                    <NavItem href="/faculty/sessions" icon={<Calendar size={18} />} label="Sessions & Meets" />
                    <NavItem href="/faculty/grading" icon={<CheckCircle size={18} />} label="Review & Grading" />
                    <NavItem href="/faculty/students" icon={<Users size={18} />} label="Students" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-sm">
                        <LogOut size={16} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none fixed" />

                <div className="relative z-10 p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors group"
        >
            <span className="group-hover:text-orange-500 transition-colors">{icon}</span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    )
}
