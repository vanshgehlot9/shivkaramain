import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Users, Video, FileCheck, Clock } from "lucide-react";

export default function FacultyDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back. Here is today's operational overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Active Students" value="48" icon={<Users className="text-orange-500" />} />
                <StatCard label="Pending Reviews" value="12" icon={<FileCheck className="text-yellow-500" />} />
                <StatCard label="Upcoming Sessions" value="3" icon={<Video className="text-blue-500" />} />
                <StatCard label="Avg Attendance" value="92%" icon={<Clock className="text-green-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlassCard className="p-8 h-[400px]">
                    <h3 className="text-xl font-bold mb-6">Recent Submissions</h3>
                    <div className="space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-black border border-white/10" />
                                    <div>
                                        <div className="text-white text-sm font-medium">Student Name</div>
                                        <div className="text-xs text-gray-500">Assignment {i}</div>
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-1 rounded">PENDING</span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard className="p-8 h-[400px]">
                    <h3 className="text-xl font-bold mb-6">Upcoming Schedule</h3>
                    <div className="space-y-4">
                        <ScheduleItem title="Figma Variables Masterclass" time="Today, 5:00 PM" type="Live" />
                        <ScheduleItem title="Design System Review" time="Tomorrow, 11:00 AM" type="Async" />
                        <ScheduleItem title="Guest Lecture: Uber" time="Friday, 6:00 PM" type="Event" />
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}

const StatCard = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <GlassCard className="p-6 flex items-center justify-between" hoverEffect={false}>
        <div>
            <div className="text-gray-500 text-xs font-mono uppercase mb-1">{label}</div>
            <div className="text-3xl font-bold text-white">{value}</div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            {icon}
        </div>
    </GlassCard>
);

const ScheduleItem = ({ title, time, type }: { title: string, time: string, type: string }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-gray-400">
            <span>0{Math.floor(Math.random() * 9) + 1}</span>
            <span>FEB</span>
        </div>
        <div className="flex-1">
            <div className="text-white font-medium group-hover:text-orange-500 transition-colors">{title}</div>
            <div className="text-xs text-gray-500">{time}</div>
        </div>
        <div className="px-3 py-1 rounded-full bg-white/5 text-[10px] uppercase tracking-wider text-gray-400 font-bold border border-white/5">
            {type}
        </div>
    </div>
);
