"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Users,
  Eye,
  Monitor,
  Smartphone,
  TrendingUp,
  BarChart3,
  Loader2,
  Tablet,
  ArrowUpRight,
  Clock,
  MousePointerClick
} from "lucide-react";
import { getAnalytics } from "@/lib/admin-api";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({
    overview: {
      totalPageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      avgSessionDuration: 0,
    },
    topPages: [],
    trafficSources: [],
    deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
  });

  useEffect(() => {
    fetchAllAnalytics();
  }, []);

  const fetchAllAnalytics = async () => {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Last 30 days

      const [overview, pages, sources, devices] = await Promise.all([
        getAnalytics({ metric: 'overview', startDate, endDate }),
        getAnalytics({ metric: 'pages', startDate, endDate }),
        getAnalytics({ metric: 'sources', startDate, endDate }),
        getAnalytics({ metric: 'devices', startDate, endDate }),
      ]);

      setAnalyticsData({
        overview: overview.data || { totalPageViews: 0, uniqueVisitors: 0, bounceRate: 0, avgSessionDuration: 0 },
        topPages: Array.isArray(pages.data) ? pages.data : [],
        trafficSources: Array.isArray(sources.data) ? sources.data : [],
        deviceBreakdown: devices.data || { desktop: 0, mobile: 0, tablet: 0 },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalyticsData({
        overview: { totalPageViews: 0, uniqueVisitors: 0, bounceRate: 0, avgSessionDuration: 0 },
        topPages: [],
        trafficSources: [],
        deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
      });
    } finally {
      setLoading(false);
    }
  };

  const totalDevices = (analyticsData.deviceBreakdown.desktop || 0) + (analyticsData.deviceBreakdown.mobile || 0) + (analyticsData.deviceBreakdown.tablet || 0);
  const desktopPercentage = totalDevices ? Math.round(((analyticsData.deviceBreakdown.desktop || 0) / totalDevices) * 100) : 0;
  const mobilePercentage = totalDevices ? Math.round(((analyticsData.deviceBreakdown.mobile || 0) / totalDevices) * 100) : 0;
  const tabletPercentage = totalDevices ? Math.round(((analyticsData.deviceBreakdown.tablet || 0) / totalDevices) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 font-bold uppercase tracking-widest text-sm animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Traffic Analytics</h1>
          <p className="text-white/60">Visitor statistics and insights for the last 30 days</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Live Data</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Visitors",
            value: analyticsData.overview.uniqueVisitors.toLocaleString("en-IN"),
            subtext: "Unique IPs",
            icon: Users,
            color: "text-[#5EB4FF]",
            bg: "bg-[#5EB4FF]/10",
            trend: "+12.5%"
          },
          {
            label: "Page Views",
            value: analyticsData.overview.totalPageViews.toLocaleString("en-IN"),
            subtext: "Total Hits",
            icon: Eye,
            color: "text-[#FF7A00]",
            bg: "bg-[#FF7A00]/10",
            trend: "+8.2%"
          },
          {
            label: "Bounce Rate",
            value: `${analyticsData.overview.bounceRate}%`,
            subtext: "Single Page Sessions",
            icon: MousePointerClick,
            color: "text-[#CCFF00]",
            bg: "bg-[#CCFF00]/10",
            trend: "-2.4%"
          },
          {
            label: "Avg. Duration",
            value: `${Math.round(analyticsData.overview.avgSessionDuration / 60)}m ${Math.round(analyticsData.overview.avgSessionDuration % 60)}s`,
            subtext: "Per Session",
            icon: Clock,
            color: "text-[#9D4EDD]",
            bg: "bg-[#9D4EDD]/10",
            trend: "+5.1%"
          }
        ].map((stat, index) => (
          <div key={index} className="group p-6 rounded-2xl bg-[#111111]/50 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="w-3 h-3" />
                <span className="text-[10px] font-bold">{stat.trend}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/60 font-medium mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{stat.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Breakdown */}
        <div className="bg-[#111111]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Device Breakdown</h2>
            <p className="text-sm text-white/40">User device distribution</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center mb-8">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="128" cy="128" r="100" fill="none" stroke="#1a1a1a" strokeWidth="24" />
                <circle
                  cx="128" cy="128" r="100" fill="none" stroke="#5EB4FF" strokeWidth="24"
                  strokeDasharray={`${(desktopPercentage / 100) * 628} 628`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <circle
                  cx="128" cy="128" r="100" fill="none" stroke="#9D4EDD" strokeWidth="24"
                  strokeDasharray={`${(mobilePercentage / 100) * 628} 628`}
                  strokeDashoffset={-((desktopPercentage / 100) * 628)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{totalDevices.toLocaleString("en-IN")}</span>
                <span className="text-xs font-bold text-white/40 uppercase tracking-wider mt-1">Total Devices</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#5EB4FF]" />
                <Monitor className="w-4 h-4 text-white/60" />
                <span className="text-xs font-bold text-white/60 uppercase">Desktop</span>
              </div>
              <span className="text-xl font-bold text-white">{desktopPercentage}%</span>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#9D4EDD]" />
                <Smartphone className="w-4 h-4 text-white/60" />
                <span className="text-xs font-bold text-white/60 uppercase">Mobile</span>
              </div>
              <span className="text-xl font-bold text-white">{mobilePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Traffic Channels */}
        <div className="lg:col-span-2 bg-[#111111]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-1">Traffic Channels</h2>
            <p className="text-sm text-white/40">Where your visitors are coming from</p>
          </div>

          <div className="space-y-6">
            {!Array.isArray(analyticsData.trafficSources) || analyticsData.trafficSources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/40">
                <BarChart3 className="w-12 h-12 mb-4 opacity-20" />
                <p>No traffic source data available</p>
              </div>
            ) : (
              analyticsData.trafficSources.map((channel: any, index: number) => {
                const total = analyticsData.trafficSources.reduce((sum: number, c: any) => sum + c.count, 0);
                const percentage = Math.round((channel.count / total) * 100);
                const maxVisitors = Math.max(...analyticsData.trafficSources.map((c: any) => c.count));
                const barWidth = (channel.count / maxVisitors) * 100;
                const colors = ["bg-[#5EB4FF]", "bg-[#FF7A00]", "bg-[#CCFF00]", "bg-[#9D4EDD]"];
                const textColors = ["text-[#5EB4FF]", "text-[#FF7A00]", "text-[#CCFF00]", "text-[#9D4EDD]"];

                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white uppercase tracking-wide">
                        {channel.source}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${textColors[index % textColors.length]}`}>
                          {channel.count.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-medium text-white/40">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-1000 ease-out group-hover:brightness-110`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Landing Pages */}
      <div className="bg-[#111111]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-1">Top Landing Pages</h2>
          <p className="text-sm text-white/40">Most visited pages on your site</p>
        </div>

        <div className="space-y-4">
          {!Array.isArray(analyticsData.topPages) || analyticsData.topPages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
              <Globe className="w-12 h-12 mb-4 opacity-20" />
              <p>No page view data available</p>
            </div>
          ) : (
            analyticsData.topPages.map((page: any, index: number) => {
              const maxViews = Math.max(...analyticsData.topPages.map((p: any) => p.views));
              const barWidth = (page.views / maxViews) * 100;

              return (
                <div key={index} className="group p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/60">
                        {index + 1}
                      </span>
                      <span className="text-sm font-mono text-white/80 group-hover:text-white transition-colors">
                        {page.path}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-[#5EB4FF]">
                      {page.views.toLocaleString("en-IN")} <span className="text-white/40 text-xs font-normal">views</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5EB4FF] to-[#0056b3] rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
