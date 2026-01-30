"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  Banknote,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardStats } from "@/lib/admin-api";

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
      label: "Total Income",
      value: `₹${(dashboardData?.totalIncome || 0).toLocaleString("en-IN")}`,
      change: "+0%", // Needs separate API support for trend calculation in future
      isPositive: true,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    {
      label: "Total Expense",
      value: `₹${(dashboardData?.totalExpense || 0).toLocaleString("en-IN")}`,
      change: "-0%",
      isPositive: false,
      icon: ArrowDownRight,
      color: "text-red-500",
      bg: "bg-red-500/10"
    },
    {
      label: "Net Profit",
      value: `₹${(dashboardData?.netProfit || 0).toLocaleString("en-IN")}`,
      change: "+0%",
      isPositive: true,
      icon: Banknote,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      label: "Cash in Hand",
      value: `₹${(dashboardData?.cashInHand || 0).toLocaleString("en-IN")}`,
      change: `Active Projects: ${dashboardData?.activeProjects || 0}`,
      isPositive: null,
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-1">Dashboard</h2>
          <p className="text-gray-400">Financial overview and recent activity.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0A0A0A] border border-white/10 px-4 py-2 rounded-xl text-sm font-mono text-gray-400">
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className={`absolute top-0 right-0 p-3 ${stat.bg} rounded-bl-3xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>

            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">{stat.label}</div>
            <div className="text-3xl font-black text-white tracking-tight mb-4">{stat.value}</div>

            <div className="flex items-center gap-2 text-xs font-bold">
              {stat.isPositive !== null && (
                <span className={`${stat.isPositive ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"} px-2 py-1 rounded`}>
                  {stat.change}
                </span>
              )}
              {stat.isPositive === null && (
                <span className="text-gray-400">{stat.change}</span>
              )}
              {stat.isPositive !== null && <span className="text-gray-500">vs last month</span>}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 relative min-h-[400px]">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
              <p className="text-gray-500 text-sm">Income vs Expenses over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-shivkara-orange" /> Income
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" /> Expense
              </div>
            </div>
          </div>

          {/* Chart Bars from Data */}
          <div className="absolute bottom-8 left-8 right-8 top-32 flex items-end justify-between gap-4">
            {dashboardData?.monthlyData?.slice().reverse().map((data: any, i: number) => {
              const maxVal = Math.max(...(dashboardData?.monthlyData?.map((d: any) => Math.max(d.income, d.expense)) || [100]));
              const incomePercent = (data.income / maxVal) * 100;
              const expensePercent = (data.expense / maxVal) * 100;

              return (
                <div key={i} className="flex-1 flex flex-col justify-end gap-2 h-full group relative">
                  {/* Expense Bar */}
                  <div className="absolute bottom-6 w-full flex gap-1 items-end justify-center h-full px-1">
                    <div
                      className="w-1/2 bg-red-500/20 rounded-t-sm transition-all duration-500 group-hover:bg-red-500"
                      style={{ height: `${Math.max(expensePercent, 2)}%` }}
                      title={`Expense: ₹${data.expense}`}
                    />
                    <div
                      className="w-1/2 bg-shivkara-orange/20 rounded-t-sm transition-all duration-500 group-hover:bg-shivkara-orange"
                      style={{ height: `${Math.max(incomePercent, 2)}%` }}
                      title={`Income: ₹${data.income}`}
                    />
                  </div>
                  <div className="text-center text-[10px] text-gray-500 uppercase font-bold mt-2 z-10 w-full">
                    {data.month.split(' ')[0]}
                  </div>
                </div>
              );
            })}
            {(!dashboardData?.monthlyData || dashboardData.monthlyData.length === 0) && (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#080808] border border-white/5 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-white">Recent Activity</h3>
            <button className="text-xs font-black text-shivkara-orange uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {dashboardData?.recentTransactions?.map((item: any, i: number) => (
              <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 flex justify-between items-center group hover:border-white/10 transition-all">
                <div>
                  <div className="font-bold text-white text-sm mb-1 line-clamp-1">{item.note || item.description || "Transaction"}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className={`font-bold font-mono text-sm ${item.type === 'income' || item.cashIn > 0 ? 'text-shivkara-orange' : 'text-red-500'}`}>
                  {item.type === 'income' || item.cashIn > 0 ? '+' : '-'}₹{(item.amount || item.cashIn || item.cashOut || 0).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
            {(!dashboardData?.recentTransactions || dashboardData.recentTransactions.length === 0) && (
              <div className="text-center text-gray-500 text-sm py-4">
                No recent activity
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
