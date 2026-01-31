"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search, Filter, Download, Plus, Minus, ArrowUpRight, ArrowDownRight,
  Wallet, Loader2, Calendar, User, Building2, Tag, ChevronDown, CheckCircle,
  TrendingUp, TrendingDown, Activity
} from "lucide-react";
import { getCashbook, getClients, apiRequest } from "@/lib/admin-api";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

// --- 3D Card Component ---
const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  const rotateX = useMotionTemplate`${mouseY.get() * -20}deg`;
  const rotateY = useMotionTemplate`${mouseX.get() * 20}deg`;

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ transformStyle: "preserve-3d", rotateX, rotateY }}
      className={`relative transform transition-all duration-200 ease-out ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default function CashbookPage() {
  const [loading, setLoading] = useState(true);
  const [cashbookData, setCashbookData] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [submitting, setSubmitting] = useState(false);

  const [stats, setStats] = useState({
    currentBalance: 0,
    totalCashIn: 0,
    totalCashOut: 0,
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: "",
    note: "",
    category: "",
    clientId: "",
    clientName: "",
    entityName: "",
  });

  const selectedClient = clients.find(c => c.id === formData.clientId);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [cashbookResult, clientsResult] = await Promise.all([
        getCashbook({ limit: 50 }),
        getClients()
      ]);

      if (cashbookResult.success && cashbookResult.data) {
        setCashbookData(cashbookResult.data.data || []);
        setStats({
          currentBalance: cashbookResult.data.currentBalance || 0,
          totalCashIn: cashbookResult.data.totalCashIn || 0,
          totalCashOut: cashbookResult.data.totalCashOut || 0,
        });
      }

      if (clientsResult.success && clientsResult.data) {
        setClients(clientsResult.data.data || []);
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      setFormData({
        ...formData,
        clientId: client.id,
        clientName: client.name,
        entityName: "",
      });
    } else {
      setFormData({ ...formData, clientId: "", clientName: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.note) {
      alert("Please fill in key fields.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiRequest('/cashbook', {
        method: 'POST',
        body: JSON.stringify({
          type: transactionType,
          date: formData.date,
          amount: parseFloat(formData.amount),
          note: formData.note,
          category: formData.category,
          clientId: formData.clientId || undefined,
          clientName: formData.clientName || undefined,
          entityName: formData.entityName || undefined,
        })
      });

      if (result.success) {
        setShowAddModal(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          amount: "",
          note: "",
          category: "",
          clientId: "",
          clientName: "",
          entityName: "",
        });
        fetchData();
      } else {
        alert("Failed to save: " + result.error);
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen text-white font-sans overflow-hidden perspective-1000">

      {/* --- Advanced Background --- */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        {/* Glowing Orbs */}
        <div className="absolute top-[-20%] left-[20%] w-[50vw] h-[50vw] bg-emerald-500/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[150px] animate-pulse-slow delay-1000" />

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-8 space-y-12">

        {/* --- Header Section --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="relative">
            {/* Decorative Line */}
            <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-emerald-500 to-transparent rounded-full opacity-50" />

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 filter drop-shadow-2xl"
            >
              CASH<span className="text-emerald-500">BOOK</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-mono text-sm tracking-widest uppercase flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Live Ledger System v2.0
            </motion.p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(16, 185, 129, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setTransactionType('income'); setShowAddModal(true); }}
              className="h-[56px] px-8 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-emerald-400 text-black border border-emerald-400/20 backdrop-blur-xl flex items-center gap-3 shadow-lg shadow-emerald-900/20 group"
            >
              <div className="p-1.5 rounded-full bg-black/20 group-hover:bg-black/10 transition-colors">
                <ArrowDownRight size={18} />
              </div>
              RECEIVE
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setTransactionType('expense'); setShowAddModal(true); }}
              className="h-[56px] px-8 rounded-2xl font-bold text-sm bg-[#0A0A0A] text-white border border-white/10 hover:border-red-500/50 backdrop-blur-xl flex items-center gap-3 shadow-lg group transition-all"
            >
              <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-red-500/20 group-hover:text-red-500 transition-colors">
                <ArrowUpRight size={18} />
              </div>
              PAY
            </motion.button>
          </div>
        </div>

        {/* --- 3D Stats Deck --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">

          {/* Current Balance */}
          <TiltCard className="md:col-span-1 h-full">
            <div className="h-full p-8 rounded-[2.5rem] bg-gradient-to-br from-[#121212] to-black border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Neon Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

              <div className="relative z-10 flex flex-col justify-between h-full space-y-8">
                <div className="flex justify-between items-start">
                  <div className="p-3.5 rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-inner">
                    <Wallet size={28} className="text-white" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Status</span>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      HEALTHY
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mb-2">Net Liquidity</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl text-gray-500 font-thin">₹</span>
                    <span className="text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                      {stats.currentBalance.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Metrics Grid */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Cash In */}
            <TiltCard className="h-full">
              <div className="h-full p-8 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
                <div className="absolute -right-8 -top-8 bg-emerald-500/20 w-32 h-32 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <TrendingUp size={20} />
                    </div>
                    <span className="font-bold text-sm text-gray-400 uppercase tracking-wider group-hover:text-emerald-400 transition-colors">Total Inflow</span>
                  </div>
                  <p className="text-4xl font-bold text-white tabular-nums tracking-tight group-hover:scale-105 transition-transform origin-left">
                    +₹{stats.totalCashIn.toLocaleString("en-IN")}
                  </p>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[75%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Cash Out */}
            <TiltCard className="h-full">
              <div className="h-full p-8 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group hover:border-red-500/30 transition-colors duration-500">
                <div className="absolute -right-8 -top-8 bg-red-500/20 w-32 h-32 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                      <TrendingDown size={20} />
                    </div>
                    <span className="font-bold text-sm text-gray-400 uppercase tracking-wider group-hover:text-red-400 transition-colors">Total Outflow</span>
                  </div>
                  <p className="text-4xl font-bold text-white tabular-nums tracking-tight group-hover:scale-105 transition-transform origin-left">
                    -₹{stats.totalCashOut.toLocaleString("en-IN")}
                  </p>
                  <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 w-[45%] shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* --- Ledger Feed --- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Activity size={20} className="text-gray-500" />
              Transaction Feed
            </h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Search size={18} />
              </button>
              <button className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <Filter size={18} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-40 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
              <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Syncing Blockchain...</p>
            </div>
          ) : cashbookData.length === 0 ? (
            <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500 font-mono text-sm">No signals detected.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cashbookData.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative bg-black/40 hover:bg-[#0F0F0F] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-300 grid grid-cols-12 gap-4 items-center hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] cursor-default"
                >
                  {/* Glow Overlay */}
                  <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-500 ${entry.type === 'income' ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />

                  {/* Icon */}
                  <div className="col-span-2 md:col-span-1 flex justify-center">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${entry.type === 'income'
                        ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-900/20 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gradient-to-br from-red-500/20 to-red-900/20 text-red-400 border border-red-500/20'
                      }`}>
                      {entry.type === 'income' ? <ArrowDownRight size={22} /> : <ArrowUpRight size={22} />}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="col-span-10 md:col-span-7 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-white font-bold text-base md:text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                        {entry.note}
                      </span>
                      {entry.type === 'income' ? (
                        <span className="text-[10px] font-bold text-emerald-500/80 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10">IN</span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-500/80 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/10">OUT</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(entry.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>

                      {entry.clientName && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400">
                          <User size={10} className="text-cyan-400" /> {entry.clientName}
                        </span>
                      )}

                      {entry.entityName && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-gray-400">
                          <Building2 size={10} className="text-purple-400" /> {entry.entityName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="col-span-12 md:col-span-4 flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                    <div className="text-right">
                      <p className={`text-xl font-black tabular-nums tracking-tight drop-shadow-lg ${entry.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {entry.type === 'income' ? '+' : '-'}₹{entry.cashIn > 0 ? entry.cashIn.toLocaleString("en-IN") : entry.cashOut.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right pl-6 border-l border-white/10 hidden md:block">
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-wider mb-0.5">Balance</p>
                      <p className="text-sm font-bold text-gray-300 tabular-nums">
                        ₹{entry.runningBalance?.toLocaleString("en-IN") || "-"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* --- Modal (Modernized) --- */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                className="w-full max-w-xl bg-[#0F0F0F] border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden"
              >
                {/* Modal Background Glow */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${transactionType === 'income' ? 'from-emerald-500 via-white to-emerald-500' : 'from-red-500 via-white to-red-500'
                  }`} />

                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className={`text-2xl font-black flex items-center gap-3 ${transactionType === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                        {transactionType === 'income' ? <ArrowDownRight size={28} /> : <ArrowUpRight size={28} />}
                        {transactionType === 'income' ? 'INCOMING' : 'OUTGOING'}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1 ml-10">Record a new transaction to the ledger.</p>
                    </div>
                    <button onClick={() => setShowAddModal(false)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                      <Loader2 size={20} className={submitting ? "animate-spin" : "hidden"} />
                      {!submitting && "✕"}
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Amount</label>
                      <div className="relative group">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl font-thin">₹</span>
                        <input
                          type="number"
                          required
                          value={formData.amount}
                          onChange={e => setFormData({ ...formData, amount: e.target.value })}
                          className="w-full h-16 bg-black border border-white/10 rounded-2xl pl-12 pr-4 text-3xl font-black text-white focus:outline-none focus:border-white/30 transition-all placeholder:text-gray-800 tabular-nums"
                          placeholder="0.00"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Link Client</label>
                        <div className="relative">
                          <select
                            value={formData.clientId}
                            onChange={(e) => handleClientChange(e.target.value)}
                            className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-sm text-gray-300 focus:border-white/20 appearance-none"
                          >
                            <option value="">-- No Client --</option>
                            {clients.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Date</label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={e => setFormData({ ...formData, date: e.target.value })}
                          className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-sm text-gray-300 focus:outline-none focus:border-white/20"
                        />
                      </div>
                    </div>

                    {selectedClient && selectedClient.outstandingBalance > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="px-4 py-3 bg-red-500/10 border-l-2 border-red-500 rounded-r-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span className="text-sm font-bold text-red-400">Dues Pending</span>
                        </div>
                        <span className="text-sm font-black text-red-400 tracking-wider">₹{selectedClient.outstandingBalance.toLocaleString("en-IN")}</span>
                      </motion.div>
                    )}

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Description</label>
                      <input
                        type="text"
                        required
                        value={formData.note}
                        onChange={e => setFormData({ ...formData, note: e.target.value })}
                        className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-sm text-gray-300 focus:outline-none focus:border-white/20"
                        placeholder="Transaction details..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full h-16 rounded-2xl text-black font-black text-lg tracking-wide shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${transactionType === 'income'
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-emerald-500/20'
                          : 'bg-gradient-to-r from-red-400 to-red-600 shadow-red-500/20 text-white'
                        }`}
                    >
                      {submitting ? "PROCESSING..." : "CONFIRM TRANSACTION"}
                      {!submitting && <CheckCircle size={20} />}
                    </button>

                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
