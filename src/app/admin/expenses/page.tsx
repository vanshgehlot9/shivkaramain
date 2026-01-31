"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, Plus, Calendar, AlertCircle, Trash2,
  Loader2, DollarSign, X, TrendingDown, Tag
} from "lucide-react";
import { getExpenses, createExpense, deleteExpense } from "@/lib/admin-api";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";

export default function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, count: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    entityName: "",
    category: "",
    amount: "",
    paymentMode: "bank_transfer",
    billProofUrl: "",
    description: "" // Add description field
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await getExpenses({ limit: 100 }) as any;
      if (result.success && result.data) {
        setExpenses(result.data);
        setStats({
          total: result.total || 0,
          count: result.count || 0
        });
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.entityName) return;

    setSubmitting(true);
    try {
      const result = await createExpense({
        ...formData,
        purpose: formData.entityName, // Map entityName to purpose
        amount: parseFloat(formData.amount)
      });

      if (result.success) {
        setShowAddModal(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          entityName: "",
          category: "",
          amount: "",
          paymentMode: "bank_transfer",
          billProofUrl: "",
          description: ""
        });
        fetchData();
      } else {
        alert("Failed: " + result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const result = await deleteExpense(id);
      if (result.success) fetchData();
    } catch (err) { console.error(err); }
  }

  const filteredExpenses = expenses.filter(exp => {
    const searchLower = searchTerm.toLowerCase();
    const name = (exp.purpose || exp.entityName || '').toLowerCase();
    const category = (exp.category || '').toLowerCase();
    return name.includes(searchLower) || category.includes(searchLower);
  });

  return (
    <div className="relative w-full min-h-screen text-white font-sans overflow-hidden perspective-1000">

      {/* Background Ambience - Red Theme */}
      <div className="fixed inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[-20%] right-[20%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-rose-600/5 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-8 space-y-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="relative">
            <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-red-500 to-transparent rounded-full opacity-50" />
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 filter drop-shadow-2xl"
            >
              EXPENSES
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-mono text-sm tracking-widest uppercase flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Cost Management
            </motion.p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="h-[56px] px-8 rounded-2xl font-bold text-sm bg-red-500 text-white border border-red-400/20 backdrop-blur-xl flex items-center gap-3 shadow-lg shadow-red-900/20 group transition-all"
          >
            <div className="p-1.5 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors">
              <Plus size={18} />
            </div>
            ADD EXPENSE
          </motion.button>
        </div>

        {/* 3D Stats Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
          <TiltCard className="h-full">
            <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
                    <DollarSign size={28} />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Expenses</p>
                </div>
                <p className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
                  ₹{stats.total.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl group-hover:bg-orange-500/30 transition-all" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400">
                    <TrendingDown size={28} />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Transactions</p>
                </div>
                <p className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                  {stats.count}
                </p>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Search */}
        <div className="relative max-w-xl group">
          <div className="absolute inset-0 bg-red-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
          <div className="relative flex items-center bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden h-14">
            <Search className="ml-6 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none"
              placeholder="Search expense records..."
            />
          </div>
        </div>

        {/* List */}
        <div className="space-y-4">
          {loading ? (
            <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-red-500 w-8 h-8" /></div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No expense records found.</div>
          ) : (
            <div className="grid gap-3">
              {filteredExpenses.map((exp, i) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-[#0A0A0A]/60 hover:bg-[#111] border border-white/5 hover:border-red-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-6 transition-all duration-300"
                >
                  <div className="absolute left-0 top-4 bottom-4 w-1 bg-red-500 rounded-r-full" />

                  <div className="flex-1 pl-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">{exp.purpose || exp.entityName || "Expense"}</h3>
                    <div className="text-xs text-gray-500 font-mono flex flex-wrap items-center gap-2 mt-1">
                      <span className="bg-white/5 px-2 py-0.5 rounded text-gray-400 flex items-center gap-1">
                        <Tag size={10} /> {exp.category}
                      </span>
                      <span>•</span>
                      <span>{new Date(exp.date).toLocaleDateString("en-IN")}</span>
                      {exp.description && (
                        <>
                          <span>•</span>
                          <span className="italic">{exp.description}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <p className="text-xl font-black text-red-400 tracking-tight tabular-nums">
                      -₹{exp.amount.toLocaleString("en-IN")}
                    </p>
                    <div className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wide border border-red-500/10">
                      {exp.paymentMode.replace('_', ' ')}
                    </div>
                    <button onClick={() => handleDelete(exp.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg bg-[#0F0F0F] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-red-500/10">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <DollarSign className="text-red-400" /> ADD EXPENSE
                  </h2>
                  <button onClick={() => setShowAddModal(false)}><X className="text-gray-500" /></button>
                </div>
                <form onSubmit={handleCreate} className="p-8 space-y-6">
                  <div className="space-y-4">
                    <input type="text" placeholder="Entity Name" className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:border-red-500" value={formData.entityName} onChange={e => setFormData({ ...formData, entityName: e.target.value })} required />

                    <div className="grid grid-cols-2 gap-4">
                      <select className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:border-red-500 appearance-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required>
                        <option value="" disabled>Select Category</option>
                        <option value="office">Office</option>
                        <option value="marketing">Marketing</option>
                        <option value="salary">Salary</option>
                        <option value="utilities">Utilities</option>
                        <option value="software">Software</option>
                        <option value="travel">Travel</option>
                        <option value="other">Other</option>
                      </select>
                      <input type="date" className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:border-red-500" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                    </div>

                    <input type="number" placeholder="Amount" className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:border-red-500 font-bold" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required />

                    <input type="text" placeholder="Description (Optional)" className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:border-red-500" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    <select className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white focus:border-red-500" value={formData.paymentMode} onChange={e => setFormData({ ...formData, paymentMode: e.target.value })}>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="upi">UPI</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                    </select>
                  </div>
                  <button type="submit" disabled={submitting} className="w-full h-14 bg-red-500 hover:bg-red-400 text-white font-black rounded-xl shadow-lg shadow-red-900/20 transition-all">
                    {submitting ? "SAVING..." : "CONFIRM EXPENSE"}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
