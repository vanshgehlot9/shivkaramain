import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import MagneticButton from "@/components/MagneticButton";
import { Video, Calendar, Plus, Link as LinkIcon, ExternalLink } from "lucide-react";

export default function SessionsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Sessions</h1>
                    <p className="text-gray-400">Manage live classes and Google Meet coordinates.</p>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-bold transition-all text-sm">
                    <Plus size={16} /> Create Session
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <GlassCard className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-gray-400 text-xs uppercase font-mono">
                            <tr>
                                <th className="p-6 font-semibold">Session Name</th>
                                <th className="p-6 font-semibold">Date & Time</th>
                                <th className="p-6 font-semibold">Meet Link</th>
                                <th className="p-6 font-semibold">Status</th>
                                <th className="p-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <SessionRow
                                name="Figma Variables Masterclass"
                                date="Feb 2, 2026 • 5:00 PM"
                                link="meet.google.com/abc-xyz-def"
                                status="Upcoming"
                            />
                            <SessionRow
                                name="Design System Architecture"
                                date="Feb 5, 2026 • 6:30 PM"
                                link="meet.google.com/qwe-rty-uio"
                                status="Scheduled"
                            />
                            <SessionRow
                                name="Auto-Layout Drill"
                                date="Jan 30, 2026 • 4:00 PM"
                                link="-"
                                status="Completed"
                            />
                        </tbody>
                    </table>
                </GlassCard>
            </div>
        </div>
    );
}

const SessionRow = ({ name, date, link, status }: any) => (
    <tr className="hover:bg-white/5 transition-colors group">
        <td className="p-6">
            <div className="font-medium text-white group-hover:text-orange-500 transition-colors">{name}</div>
        </td>
        <td className="p-6 text-gray-400 text-sm font-mono">{date}</td>
        <td className="p-6">
            {link !== "-" ? (
                <a href={`https://${link}`} target="_blank" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-max">
                    <Video size={12} /> {link}
                </a>
            ) : (
                <span className="text-gray-600 text-sm">-</span>
            )}
        </td>
        <td className="p-6">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${status === 'Upcoming' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                status === 'Completed' ? 'bg-gray-500/10 text-gray-500 border border-gray-500/20' :
                    'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                }`}>
                {status}
            </span>
        </td>
        <td className="p-6 text-right">
            <button className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg">
                <ExternalLink size={16} />
            </button>
        </td>
    </tr>
);
