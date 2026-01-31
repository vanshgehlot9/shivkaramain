"use client";

import { useState, useEffect } from "react";
import {
  Activity, Users, Smartphone, Globe, ArrowUpRight,
  Calendar, Monitor, BarChart3, Clock, MousePointer2, FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { getAnalytics } from "@/lib/admin-api";
import { TiltCard } from "@/components/admin/TiltCard";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - dateRange);

      const result = await getAnalytics({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <TiltCard className="h-full">
        <div className="relative p-6 rounded-3xl bg-white/5 border border-white/10 overflow-hidden group">
          <div className={`absolute -right-6 -top-6 w-24 h-24 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all`} />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
              <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
              <Icon size={24} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <ArrowUpRight size={14} /> Live
            </span>
            <span>Real-time tracking</span>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );

  return (
    <div className="min-h-screen text-white font-sans p-6 pb-20">

      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 mb-2">
              TRAFFIC
            </h1>
            <p className="text-gray-400 flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              Live Analytics Dashboard
            </p>
          </div>

          {/* Time Filter */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setDateRange(days)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${dateRange === days
                  ? "bg-white/10 text-white shadow-lg"
                  : "text-gray-500 hover:text-white"
                  }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Views"
            value={data?.overview?.totalPageViews || 0}
            icon={MousePointer2}
            color="blue"
            delay={0.1}
          />
          <StatCard
            title="Visitors"
            value={data?.overview?.uniqueVisitors || 0}
            icon={Users}
            color="purple"
            delay={0.2}
          />
          <StatCard
            title="Bounce Rate"
            value={data?.overview?.bounceRate || "0%"}
            icon={Activity}
            color="rose"
            delay={0.3}
          />
          <StatCard
            title="Avg. Pages"
            value={data?.overview?.avgPageViewsPerVisitor || 0}
            icon={FileText}
            color="emerald"
            delay={0.4}
          />
        </div>

        {/* Charts & Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Chart Area (Visualized as Bars) */}
          <div className="lg:col-span-2 space-y-6">
            <TiltCard className="h-full">
              <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <BarChart3 className="text-blue-400" />
                  Traffic Trend
                </h3>

                <div className="h-64 flex items-end justify-between gap-2">
                  {data?.overview?.dailyBreakdown?.slice(-14).map((day: any, i: number) => {
                    const height = Math.max(10, Math.min(100, (day.pageViews / (Math.max(...data.overview.dailyBreakdown.map((d: any) => d.pageViews)) || 1)) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: i * 0.05, duration: 1, type: "spring" }}
                          className="w-full bg-gradient-to-t from-blue-600/20 to-blue-400/80 rounded-t-lg relative group-hover:from-blue-600/40 group-hover:to-blue-400 transition-colors"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                            {day.pageViews} Views
                          </div>
                        </motion.div>
                        <span className="text-[10px] text-gray-500 rotate-0 truncate w-full text-center">
                          {new Date(day.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    );
                  }) || (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No trend data available
                      </div>
                    )}
                </div>
              </div>
            </TiltCard>

            {/* Top Pages */}
            <TiltCard>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Globe className="text-purple-400" />
                  Top Pages
                </h3>
                <div className="space-y-4">
                  {data?.pages?.topPages?.slice(0, 5).map((page: any, i: number) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-gray-500 w-4">0{i + 1}</span>
                        <div className="h-2 w-2 rounded-full bg-purple-500/50" />
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{page.path}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 rounded-full"
                            style={{ width: `${(page.views / (data.pages.topPages[0].views || 1)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-white w-12 text-right">{page.views}</span>
                      </div>
                    </div>
                  )) || <p className="text-gray-500">No page data</p>}
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Col: Devices & Sources */}
          <div className="space-y-6">
            {/* Device Stats */}
            <TiltCard>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Smartphone className="text-pink-400" />
                  Devices
                </h3>
                <div className="space-y-6">
                  {['Desktop', 'Mobile', 'Tablet'].map((device) => {
                    const key = device.toLowerCase();
                    const percent = data?.devices?.percentages?.[key] || 0;
                    return (
                      <div key={device} className="relative">
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="text-gray-400">{device}</span>
                          <span className="font-bold">{percent}%</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full rounded-full ${device === 'Desktop' ? 'bg-pink-500' :
                              device === 'Mobile' ? 'bg-blue-500' : 'bg-emerald-500'
                              }`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TiltCard>

            {/* Top Sources */}
            <TiltCard>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ArrowUpRight className="text-emerald-400" />
                  Sources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data?.sources?.sources?.map((source: any, i: number) => (
                    <div key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-300 flex items-center gap-2">
                      <span className="capitalize">{source.source}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {source.visitors}
                      </span>
                    </div>
                  )) || <p className="text-gray-500">No source data</p>}
                </div>
              </div>
            </TiltCard>

            {/* Locations */}
            <TiltCard>
              <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Globe className="text-amber-400" />
                  Locations
                </h3>
                <div className="space-y-3">
                  {data?.locations?.locations?.slice(0, 4).map((loc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{loc.country}</span>
                      <span className="font-bold text-white">{loc.visitors}</span>
                    </div>
                  )) || <p className="text-gray-500">No location data</p>}
                </div>
              </div>
            </TiltCard>

          </div>
        </div>

      </div>
    </div>
  );
}
