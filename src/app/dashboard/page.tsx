import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/MagneticButton";
import { Play, Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";

export default function StudentDashboard() {
    return (
        <div className="space-y-12">
            {/* Hero Welcome */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-orange-600/20 border border-orange-600/30 text-orange-500 text-[10px] uppercase font-bold tracking-widest">
                            Week 02
                        </span>
                        <span className="text-gray-500 text-xs uppercase font-mono tracking-widest">Phase 1: Foundations</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                        READY TO <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">DEPLOY.</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-right hidden md:block">
                        <div className="text-xs text-gray-500 font-mono uppercase">Next Live Session</div>
                        <div className="text-white font-bold">Today, 5:00 PM</div>
                    </div>
                    <button className="h-12 w-12 rounded-full bg-orange-600 hover:bg-orange-500 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-orange-500/20 animate-pulse">
                        <Play size={20} fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Journey Map */}
                <div className="lg:col-span-2 space-y-6">
                    <GlassCard className="p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Calendar size={20} className="text-gray-500" /> Journey Map
                        </h3>

                        <div className="space-y-0">
                            <JourneyItem
                                status="completed"
                                title="Induction & Setup"
                                desc="Tools, Accounts, Manifesto"
                                date="Jan 28"
                            />
                            <JourneyItem
                                status="active"
                                title="Figma Variables"
                                desc="Tokens, Modes, Logic"
                                date="Today"
                            />
                            <JourneyItem
                                status="locked"
                                title="Design Systems I"
                                desc="Atomic Design, Scalability"
                                date="Feb 5"
                            />
                            <JourneyItem
                                status="locked"
                                title="Auto-Layout Drill"
                                desc="Speed execution test"
                                date="Feb 8"
                            />
                        </div>
                    </GlassCard>
                </div>

                {/* Right: Assignments Due */}
                <div className="space-y-6">
                    <GlassCard className="p-8 h-full bg-orange-500/5 border-orange-500/20">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white mb-1">Pending Missions</h3>
                            <p className="text-xs text-gray-500 font-mono uppercase">Critical Deliverables</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-bold text-white">Landing Page V1</span>
                                    <span className="text-[10px] text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-400/20 font-bold uppercase">Due 2h</span>
                                </div>
                                <p className="text-xs text-gray-400 mb-4">Replicate the provided SaaS landing page using only auto-layout frames.</p>
                                <button className="w-full py-2 bg-white text-black font-bold text-xs uppercase tracking-wider rounded hover:bg-gray-200 transition-colors">
                                    Submit Figma Link
                                </button>
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 opacity-60">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-bold text-white">Component Lib</span>
                                    <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10 font-bold uppercase">Feb 6</span>
                                </div>
                                <p className="text-xs text-gray-400">Build a button component with 3 variants and 4 states.</p>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}

const JourneyItem = ({ status, title, desc, date }: any) => {
    const isActive = status === 'active';
    const isCompleted = status === 'completed';

    return (
        <div className={`relative pl-8 pb-8 border-l ${isCompleted ? 'border-green-500' : isActive ? 'border-orange-500' : 'border-white/10'} last:pb-0`}>
            <div className={`absolute -left-[9px] top-0 w-[18px] h-[18px] rounded-full border-4 border-black ${isCompleted ? 'bg-green-500' : isActive ? 'bg-orange-500' : 'bg-gray-800'}`} />

            <div className={`flex justify-between items-start ${status === 'locked' ? 'opacity-40' : ''}`}>
                <div>
                    <h4 className={`font-bold ${isActive ? 'text-white' : 'text-gray-300'}`}>{title}</h4>
                    <p className="text-sm text-gray-500">{desc}</p>
                </div>
                <div className="text-xs font-mono text-gray-500 bg-white/5 px-2 py-1 rounded">
                    {date}
                </div>
            </div>
        </div>
    )
}
