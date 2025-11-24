"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, Activity, Calendar } from "lucide-react";
import Link from "next/link";
import { getDashboardStats } from "@/lib/admin-api";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netProfit: 0,
    cashInHand: 0,
    activeProjects: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const result = await getDashboardStats();
      if (result.success && result.data) {
        setStats({
          totalIncome: result.data.totalIncome || 0,
          totalExpense: result.data.totalExpense || 0,
          netProfit: result.data.netProfit || 0,
          cashInHand: result.data.cashInHand || 0,
          activeProjects: result.data.activeProjects || 0,
        });
        setRecentTransactions(result.data.recentTransactions || []);
        setMonthlyData(result.data.monthlyData || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-medium tracking-wide uppercase">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Financial overview and recent activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Income */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={80} className="text-[#FF7A00]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
                <TrendingUp size={20} />
              </div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Income</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white tabular-nums tracking-tight">
                ₹{stats.totalIncome.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
                <ArrowUpRight size={12} />
                12.5%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Total Expense */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={80} className="text-[#D93636]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#D93636]/10 text-[#D93636]">
                <TrendingDown size={20} />
              </div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Total Expense</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white tabular-nums tracking-tight">
                ₹{stats.totalExpense.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 text-[#D93636] bg-[#D93636]/10 px-2 py-1 rounded-md">
                <ArrowDownRight size={12} />
                8.2%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="group relative overflow-hidden rounded-2xl bg-[#111111] border border-white/5 p-6 hover:border-white/10 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={80} className="text-[#CCFF00]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#CCFF00]/10 text-[#CCFF00]">
                <DollarSign size={20} />
              </div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">Net Profit</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white tabular-nums tracking-tight">
                ₹{stats.netProfit.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
              <span className="flex items-center gap-1 text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-1 rounded-md">
                <ArrowUpRight size={12} />
                18.3%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </div>

        {/* Cash In Hand */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF7A00]/10 to-[#D93636]/5 border border-[#FF7A00]/20 p-6 hover:border-[#FF7A00]/40 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={80} className="text-[#FF7A00]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/20">
                <Wallet size={20} />
              </div>
              <span className="text-sm font-bold text-[#FF7A00] uppercase tracking-wide">Cash In Hand</span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-white tabular-nums tracking-tight">
                ₹{stats.cashInHand.toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium">
              <span className="text-gray-400">Active Projects:</span>
              <span className="text-white font-bold">{stats.activeProjects}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Monthly Chart */}
        <div className="lg:col-span-2 rounded-2xl bg-[#111111] border border-white/5 p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Income vs Expenses over time</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF7A00]" />
                <span className="text-gray-400">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#D93636]" />
                <span className="text-gray-400">Expense</span>
              </div>
            </div>
          </div>

          <div className="h-72 w-full">
            {monthlyData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                <Activity size={24} className="mb-2 opacity-50" />
                <span className="text-sm">No data available</span>
              </div>
            ) : (
              <div className="w-full h-full flex items-end justify-between gap-2 md:gap-4 px-2">
                {monthlyData.map((data, index) => {
                  const maxVal = Math.max(
                    ...monthlyData.map((d) => Math.max(d.income, d.expense))
                  );
                  const incomeHeight = maxVal > 0 ? (data.income / maxVal) * 100 : 0;
                  const expenseHeight = maxVal > 0 ? (data.expense / maxVal) * 100 : 0;

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1 md:gap-2 h-full relative">
                        {/* Income Bar */}
                        <div
                          className="w-full max-w-[24px] bg-[#FF7A00] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 relative"
                          style={{ height: `${incomeHeight}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl">
                            ₹{data.income.toLocaleString("en-IN")}
                          </div>
                        </div>
                        {/* Expense Bar */}
                        <div
                          className="w-full max-w-[24px] bg-[#D93636] rounded-t-sm opacity-80 group-hover:opacity-100 transition-all duration-300 relative"
                          style={{ height: `${expenseHeight}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none shadow-xl">
                            ₹{data.expense.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                        {data.month.substring(0, 3)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl bg-[#111111] border border-white/5 p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Activity</h2>
            <Link href="/admin/cashbook" className="text-xs font-bold text-[#FF7A00] hover:text-[#FF7A00]/80 uppercase tracking-wider">
              View All
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {recentTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <span className="text-sm">No recent transactions</span>
              </div>
            ) : (
              recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">
                        {transaction.note || (transaction.type === "income" ? "Income" : "Expense")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {transaction.date
                          ? new Date(transaction.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                          : "N/A"}
                      </p>
                    </div>
                    <div className={`text-right shrink-0 ${transaction.type === "income" || transaction.cashIn > 0 ? "text-[#FF7A00]" : "text-[#D93636]"
                      }`}>
                      <p className="text-sm font-black tabular-nums">
                        {(transaction.type === "income" || transaction.cashIn > 0) ? "+" : "-"}
                        ₹{(transaction.cashIn || transaction.cashOut || transaction.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

