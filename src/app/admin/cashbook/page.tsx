"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, Plus, Minus, ArrowUpRight, ArrowDownRight, Wallet, Loader2 } from "lucide-react";
import { getCashbook } from "@/lib/admin-api";

export default function CashbookPage() {
  const [loading, setLoading] = useState(true);
  const [cashbookData, setCashbookData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    currentBalance: 0,
    totalCashIn: 0,
    totalCashOut: 0,
  });

  useEffect(() => {
    fetchCashbook();
  }, []);

  const fetchCashbook = async () => {
    try {
      setLoading(true);
      const result = await getCashbook();
      if (result.success && result.data) {
        const dataArray = Array.isArray(result.data.data) ? result.data.data : [];
        setCashbookData(dataArray);

        setStats({
          currentBalance: result.data.currentBalance || 0,
          totalCashIn: result.data.totalCashIn || 0,
          totalCashOut: result.data.totalCashOut || 0,
        });
      } else {
        setCashbookData([]);
        setStats({
          currentBalance: 0,
          totalCashIn: 0,
          totalCashOut: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching cashbook:", error);
      setCashbookData([]);
      setStats({
        currentBalance: 0,
        totalCashIn: 0,
        totalCashOut: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Cashbook
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Real-time ledger of all cash transactions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-[#111111] border border-white/5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
            <Download size={16} />
            Export Ledger
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cash In */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ArrowUpRight size={80} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <ArrowUpRight size={18} />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Cash In</p>
            </div>
            <p className="text-3xl font-bold text-emerald-500 tabular-nums tracking-tight">
              ₹{stats.totalCashIn.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Cash Out */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group hover:border-red-500/20 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <ArrowDownRight size={80} className="text-red-500" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                <ArrowDownRight size={18} />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Cash Out</p>
            </div>
            <p className="text-3xl font-bold text-red-500 tabular-nums tracking-tight">
              ₹{stats.totalCashOut.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Balance */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FF7A00]/10 to-[#D93636]/5 border border-[#FF7A00]/20 relative overflow-hidden group hover:border-[#FF7A00]/40 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Wallet size={80} className="text-[#FF7A00]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-[#FF7A00] text-black shadow-lg shadow-[#FF7A00]/20">
                <Wallet size={18} />
              </div>
              <p className="text-xs font-bold text-[#FF7A00] uppercase tracking-wider">Net Balance</p>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
              ₹{stats.currentBalance.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF7A00] transition-colors" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full bg-[#111111] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#FF7A00]/50 focus:bg-white/5 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 bg-[#111111] border border-white/5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Cashbook Table */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00] mb-4" />
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Loading ledger...</p>
          </div>
        ) : cashbookData.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Cash In</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Cash Out</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {cashbookData.map((entry) => (
                  <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {entry.note}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-500 tabular-nums">
                      {entry.cashIn > 0 ? `+₹${entry.cashIn.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-red-500 tabular-nums">
                      {entry.cashOut > 0 ? `-₹${entry.cashOut.toLocaleString("en-IN")}` : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-white tabular-nums border-l border-white/5 bg-white/[0.01]">
                      ₹{entry.runningBalance?.toLocaleString("en-IN") || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
