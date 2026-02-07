import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Share2, Lock, Unlock, Copy, Zap, Gift } from "lucide-react";

// Mock Data
const REFERRAL_COUNT = 12;
const PROGRESS_PERCENT = 40; // towards next tier

export default function ReferralsPage() {
    return (
        <div className="space-y-12">
            <header className="max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4">GROWTH <br /><span className="text-orange-600">ENGINE.</span></h1>
                <p className="text-xl text-gray-400 font-light leading-relaxed">
                    Unlock performance boosts and tuition waivers by building the community.
                    We track active contributors, not just signups.
                </p>
            </header>

            {/* Status Bar */}
            <GlassCard className="p-8 md:p-12 relative overflow-visible">
                <div className="absolute top-0 right-0 p-[200px] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-2">Total Activation Count</div>
                        <div className="text-7xl font-black text-white tabular-nums tracking-tighter">
                            {REFERRAL_COUNT}
                        </div>
                        <div className="mt-6 flex flex-col gap-2">
                            <div className="flex justify-between text-xs font-mono text-gray-400">
                                <span>CURRENT TIER: PERFORMANCE BOOST</span>
                                <span>NEXT: ACCESS UPGRADE (3 LEFT)</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-orange-600 to-amber-500 w-[60%]" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-6 border border-white/10 backdrop-blur-md">
                        <div className="text-xs text-gray-400 mb-4 uppercase font-bold">Your Unique Invite Link</div>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-gray-300 font-mono text-sm truncate">
                                shivkara.com/invite/student-882
                            </div>
                            <button className="px-4 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center">
                                <Copy size={16} />
                            </button>
                        </div>
                        <div className="mt-4 flex gap-2">
                            <button className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#25D366]/20 border border-[#25D366]/30 rounded hover:bg-[#25D366]/30 transition-colors">
                                WhatsApp
                            </button>
                            <button className="flex-1 py-2 text-xs font-bold uppercase tracking-wider text-white bg-[#0088cc]/20 border border-[#0088cc]/30 rounded hover:bg-[#0088cc]/30 transition-colors">
                                Telegram
                            </button>
                        </div>
                    </div>
                </div>
            </GlassCard>

            {/* Tiers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TierCard
                    level="01"
                    title="Performance Boost"
                    req="10 Referrals"
                    unlocked={REFERRAL_COUNT >= 10}
                    features={["₹500 Fee Reduction", "Priority Evaluation"]}
                />
                <TierCard
                    level="02"
                    title="Access Upgrade"
                    req="15 Referrals"
                    unlocked={REFERRAL_COUNT >= 15}
                    features={["100% Fee Waived", "Admin Dashboard Access"]}
                    highlight
                />
                <TierCard
                    level="03"
                    title="Elite Track"
                    req="25 Referrals"
                    unlocked={REFERRAL_COUNT >= 25}
                    features={["Paid Project Role", "Shivkara Swag Kit"]}
                />
            </div>
        </div>
    );
}

const TierCard = ({ level, title, req, unlocked, features, highlight }: any) => (
    <GlassCard className={`p-8 h-full flex flex-col relative ${unlocked ? 'border-orange-500/30 bg-orange-500/5' : 'opacity-60 grayscale'}`}>
        <div className="flex justify-between items-start mb-6">
            <span className="text-xl font-black text-white/20">/{level}</span>
            {unlocked ? <Unlock className="text-orange-500" size={20} /> : <Lock className="text-gray-600" size={20} />}
        </div>

        <h3 className={`text-2xl font-bold mb-2 ${unlocked ? 'text-white' : 'text-gray-400'}`}>{title}</h3>
        <div className="text-sm font-mono text-orange-500 mb-8 uppercase tracking-widest">{req}</div>

        <ul className="space-y-3 mt-auto">
            {features.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className={`w-1.5 h-1.5 rounded-full ${unlocked ? 'bg-orange-500' : 'bg-gray-600'}`} />
                    {f}
                </li>
            ))}
        </ul>
    </GlassCard>
)
