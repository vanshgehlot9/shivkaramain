"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp, ArrowDownRight, ArrowUpRight, Wallet, Activity,
  Zap, MoreHorizontal, Calendar, Bell, Shield, Cpu, Users, Layers
} from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardStats } from "@/lib/admin-api";
import RevenueChart from "./RevenueChart";
import { TiltCard } from "@/components/admin/TiltCard";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const result = await getDashboardStats();
      if (result.success && result.data) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "TOTAL INCOME",
      value: dashboardData?.totalIncome || 0,
      change: "+12.5%",
      isPositive: true,
      icon: TrendingUp,
      color: "emerald",
      gradient: "from-emerald-500/20 to-teal-500/5"
    },
    {
      label: "TOTAL EXPENSE",
      value: dashboardData?.totalExpense || 0,
      change: "-2.4%",
      isPositive: false,
      icon: ArrowDownRight,
      color: "red",
      gradient: "from-red-500/20 to-orange-500/5"
    },
    {
      label: "NET PROFIT",
      value: dashboardData?.netProfit || 0,
      change: "+8.2%",
      isPositive: true,
      icon: Wallet,
      color: "blue",
      gradient: "from-blue-500/20 to-indigo-500/5"
    },
    {
      label: "CASH FLOW",
      value: dashboardData?.cashInHand || 0,
      change: "Stable",
      isPositive: null,
      icon: Zap,
      color: "amber",
      gradient: "from-amber-500/20 to-yellow-500/5"
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-shivkara-orange/20 border-t-shivkara-orange rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={20} className="text-shivkara-orange animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[2000px] mx-auto animate-in fade-in zoom-in duration-500">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
            COMMAND <span className="text-transparent bg-clip-text bg-gradient-to-r from-shivkara-orange to-amber-500">CENTER</span>
          </h1>
          <div className="flex items-center gap-3 text-sm font-mono text-gray-500">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEM OPTIMAL
            </span>
            <span>//</span>
            <span>LAST SYNC: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all text-sm font-bold text-gray-300 hover:text-white group">
            <Calendar size={16} className="text-shivkara-orange group-hover:scale-110 transition-transform" />
            <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </button>
        </div>
      </div>

      {/* BENTO GRID LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Stats Row */}
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="col-span-1"
          >
            <TiltCard>
              <div className="relative h-full bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 rounded-3xl p-6 overflow-hidden group hover:border-white/10 transition-colors">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5 text-${stat.color}-400`}>
                      <stat.icon size={20} />
                    </div>
                    {stat.isPositive !== null && (
                      <span className={`text-xs font-bold font-mono px-2 py-1 rounded bg-black/20 ${stat.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    <h3 className="text-3xl font-black text-white tracking-tight">₹{stat.value.toLocaleString('en-IN')}</h3>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}

        {/* Main Revenue Chart (Span 2 cols on XL, Full on Mobile) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-2 xl:col-span-3 min-h-[400px] bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-32 bg-shivkara-orange/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Financial Performance</h3>
              <p className="text-xs text-gray-500 font-mono mt-1">REAL-TIME DATA STREAM</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-[#ff7a00] shadow-[0_0_8px_#ff7a00]" /> Income
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Expense
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <RevenueChart
              data={dashboardData?.monthlyData?.slice().reverse().map((d: any) => ({
                label: d.month,
                income: d.income,
                expense: d.expense
              })) || []}
            />
          </div>
        </motion.div>

        {/* Quick Actions / System Status (Span 1 col) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-1 xl:col-span-1 flex flex-col gap-6"
        >
          {/* System Health */}
          <div className="bg-[#0a0a0a]/80 border border-white/5 rounded-3xl p-6 flex-1 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-50" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">System Health</h3>
                <Activity size={18} className="text-blue-400 animate-pulse" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Server Load</span>
                    <span className="text-blue-400">24%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[24%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Database</span>
                    <span className="text-emerald-400">Optimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[98%]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 relative z-10">
              <div className="flex items-center gap-3 text-xs text-green-400 font-mono">
                <Shield size={12} />
                <span>ALL SYSTEMS SECURERE</span>
              </div>
            </div>
          </div>

          {/* Quick Action Mini Card */}
          <div className="bg-gradient-to-br from-shivkara-orange to-orange-600 rounded-3xl p-6 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-orange-500/20">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold opacity-80 uppercase mb-1">Quick Action</p>
                <h3 className="text-lg font-black leading-tight">Generate Report</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Zap size={20} fill="currentColor" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity (Full Width Bottom) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-1 md:col-span-2 xl:col-span-4 bg-[#0a0a0a]/60 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                <Layers size={18} />
              </div>
              <h3 className="font-bold text-white">Recent Transactions</h3>
            </div>
            <button className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>

          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {dashboardData?.recentTransactions?.slice(0, 6).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                  <div className={`
                                         w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                         ${item.type === 'income' || item.cashIn > 0
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'}
                                     `}>
                    {item.type === 'income' || item.cashIn > 0 ? <TrendingUp size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-300 group-hover:text-white truncate transition-colors">
                      {item.note || item.description || "Transaction"}
                    </p>
                    <p className="text-[10px] text-gray-600 font-mono">
                      {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`font-mono text-xs font-bold ${item.type === 'income' || item.cashIn > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {item.type === 'income' || item.cashIn > 0 ? '+' : '-'}₹{(item.amount || item.cashIn || item.cashOut || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {(!dashboardData?.recentTransactions || dashboardData.recentTransactions.length === 0) && (
              <div className="py-12 flex flex-col items-center justify-center text-gray-600">
                <Activity size={32} className="mb-2 opacity-20" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
