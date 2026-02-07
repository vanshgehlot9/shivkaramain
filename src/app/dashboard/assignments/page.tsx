import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Link as LinkIcon, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export default function AssignmentsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">YOUR <span className="text-orange-500">MISSIONS.</span></h1>
                <p className="text-gray-400">Deliverables are graded on execution quality, naming conventions, and speed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Active Assignment */}
                <GlassCard className="p-8 border-orange-500/30">
                    <div className="flex justify-between items-start mb-6">
                        <div className="px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <Clock size={12} /> Live Mission
                        </div>
                        <div className="text-right">
                            <div className="text-white font-bold text-xl">02:45:00</div>
                            <div className="text-[10px] text-gray-500 uppercase font-mono">Time Remaining</div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">Landing Page V1</h2>
                    <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                        Replicate the "Saasify" landing page. Your file must be handoff-ready. <br />
                        Constraints: Auto-layout everywhere. Max 4 distinct colors. Variables for spacing.
                    </p>

                    <div className="bg-black/40 rounded-xl p-6 border border-white/10 mb-6">
                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Submission URL</label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="figma.com/file/..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white focus:border-orange-500 outline-none transition-colors text-sm font-mono"
                                />
                            </div>
                            <button className="px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors uppercase text-xs tracking-wider">
                                Ship It
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-3 flex items-center gap-1">
                            <AlertTriangle size={10} /> Make sure "Anyone with link" is set to "Viewer".
                        </p>
                    </div>
                </GlassCard>

                {/* History */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white px-2">Mission Log</h3>

                    <GlassCard className="p-6 opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-white">Figma Basics</span>
                            <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                                <CheckCircle size={10} /> Strong
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">Submission: figma.com/file/xyz...</p>

                        <div className="p-3 bg-white/5 rounded border border-white/5 text-sm text-gray-300 italic">
                            "Good use of constraints. Next time, try to name your layers more descriptively."
                            <a href="#" className="flex items-center gap-2 mt-3 text-orange-400 hover:text-orange-300 transition-colors not-italic">
                                <span className="bg-orange-500/20 p-1 rounded-full"><Clock size={12} /></span>
                                <span className="text-xs font-bold uppercase tracking-wider">Watch Video Feedback</span>
                            </a>
                            <div className="mt-2 text-[10px] text-gray-500 font-mono not-italic uppercase">— Faculty Feedback</div>
                        </div>
                    </GlassCard>

                    <GlassCard className="p-6 opacity-60">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-white">Moodboard Setup</span>
                            <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                                <CheckCircle size={10} /> Elite
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">Submission: figma.com/file/abc...</p>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
