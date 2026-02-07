import { redirect } from "next/navigation";
import Link from "next/link";
import {
    Home,
    Layers,
    Trophy,
    Settings,
    LogOut,
    Target,
    Zap
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    // Client-side authentication check would go here or via wrapper

    return (
        <div className="relative min-h-screen bg-black text-white font-sans selection:bg-orange-500/30 overflow-hidden">

            {/* Global Background Effects (Liquid Glass) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Grid */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />

                {/* Moving Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-zinc-900/40 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-orange-900/10 rounded-full blur-[100px]" />
            </div>

            {/* Floating Navigation (Left) */}
            <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-6">
                <NavIcon href="/dashboard" icon={<Home size={20} />} label="Home" />
                <NavIcon href="/dashboard/assignments" icon={<Layers size={20} />} label="Work" />
                <NavIcon href="/dashboard/referrals" icon={<Zap size={20} />} label="Growth" />
                <NavIcon href="/dashboard/portfolio" icon={<Trophy size={20} />} label="Portfolio" />
            </div>

            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-40 px-8 py-6 flex justify-between items-center pointer-events-none">
                <div className="pointer-events-auto">
                    <div className="text-xl font-black tracking-tighter text-white">
                        SHIVKARA <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">STUDENT</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Industry Simulation v1.0</div>
                </div>

                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-mono text-gray-300">SYSTEM ONLINE</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-900 to-black border border-white/20 flex items-center justify-center text-xs font-bold ring-2 ring-transparent hover:ring-orange-500/50 transition-all cursor-pointer">
                        VG
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 pt-32 pb-20 px-8 md:pl-32 max-w-7xl mx-auto">
                {children}
            </main>

        </div>
    );
}

const NavIcon = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
    <Link href={href} className="relative group">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 group-hover:border-orange-500/30 transition-all duration-300 shadow-[0_0_0_1px_rgba(255,255,255,0)] group-hover:shadow-[0_0_20px_-5px_rgba(249,115,22,0.3)]">
            {icon}
        </div>
        <span className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1 bg-black/80 border border-white/10 rounded-lg text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
            {label}
        </span>
    </Link>
)
