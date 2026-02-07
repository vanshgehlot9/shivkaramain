"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, MessageSquare, Star, CheckCircle, XCircle } from "lucide-react";

export default function GradingPage() {
    const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Grading Console</h1>
                <p className="text-gray-400">Review Figma deliverables. Internal scores are hidden from students.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of Submissions */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono uppercase text-gray-500 mb-2">
                        <span>Queue (12)</span>
                        <span>Sort: Oldest</span>
                    </div>

                    {[1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            onClick={() => setSelectedSubmission(i)}
                            className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedSubmission === i ? 'bg-orange-500/10 border-orange-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-white">Student Name {i}</div>
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-400">2h ago</span>
                            </div>
                            <div className="text-sm text-gray-400 mb-3">Assignment: Landing Page V1</div>
                            <div className="flex gap-2">
                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                                    Figma
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grading Work Area */}
                <div className="lg:col-span-2">
                    <GlassCard className="h-full min-h-[600px] p-8 relative flex flex-col">
                        {selectedSubmission ? (
                            <>
                                <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/10">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Landing Page V1</h2>
                                        <div className="text-gray-400 text-sm mt-1">Submitted by Student Name {selectedSubmission}</div>
                                    </div>
                                    <a href="#" className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                                        <ExternalLink size={16} /> Open Figma
                                    </a>
                                </div>

                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Internal Score (0-10)</label>
                                        <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-mono text-xl focus:border-orange-500 outline-none transition-colors" placeholder="-" />
                                        <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1">
                                            <XCircle size={10} /> HIDDEN FROM STUDENT
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Public Rating</label>
                                        <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white appearance-none outline-none focus:border-orange-500 cursor-pointer">
                                            <option>Select Rating...</option>
                                            <option>Needs Improvement</option>
                                            <option>Standard</option>
                                            <option>Strong</option>
                                            <option>Elite (Top 1%)</option>
                                        </select>
                                        <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1">
                                            <CheckCircle size={10} /> VISIBLE TO STUDENT
                                        </p>
                                    </div>
                                </div>

                                <div className="flex-1 mb-8">
                                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Qualitative Feedback</label>
                                    <textarea className="w-full h-[200px] bg-black/40 border border-white/10 rounded-xl p-4 text-white resize-none focus:border-orange-500 outline-none" placeholder="Enter detailed feedback here..." />
                                </div>

                                <div className="mb-8">
                                    <label className="block text-xs font-mono uppercase text-gray-500 mb-2">Media Feedback (Optional)</label>
                                    <input
                                        type="url"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white resize-none focus:border-orange-500 outline-none"
                                        placeholder="Paste Loom, Google Drive, or YouTube link..."
                                    />
                                    <p className="text-[10px] text-gray-500 mt-2">Provide a Loom video or voice note for detailed feedback.</p>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button className="px-6 py-3 rounded-full border border-white/10 text-white hover:bg-white/5 font-bold transition-colors">
                                        Save Draft
                                    </button>
                                    <button className="px-8 py-3 rounded-full bg-orange-600 text-white font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-orange-900/20">
                                        Submit Grade
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                                <MessageSquare size={48} className="mb-4 opacity-20" />
                                <p>Select a submission to start grading</p>
                            </div>
                        )}
                    </GlassCard>
                </div>
            </div>
        </div>
    );
}
