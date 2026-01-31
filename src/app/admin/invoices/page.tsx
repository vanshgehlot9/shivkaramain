"use client";

import { useState, useEffect } from "react";
import {
  Plus, Search, Filter, FileText, CheckCircle, Clock, AlertCircle,
  Loader2, MoreVertical, Download, Mail, Trash2, ChevronDown, Check
} from "lucide-react";
import { getInvoices, getClients, createInvoice, updateInvoice, apiRequest } from "@/lib/admin-api";
import { Invoice, Client } from "@/types/admin";
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

export default function InvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Create/Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +15 days
    items: [{ description: "", quantity: 1, rate: 0 }],
    status: "draft"
  });

  const [stats, setStats] = useState({
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
    overdueAmount: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesResult, clientsResult] = await Promise.all([
        getInvoices({ limit: 100 }), // Get last 100
        getClients()
      ]);

      if (invoicesResult.success && invoicesResult.data) {
        setInvoices(invoicesResult.data.data || []);

        // Calculate Stats locally for now or use API provided stats
        // API returns total, paid, pending. We can derive overdue manually or from API if available
        // Let's rely on API stats mostly but maybe refine overdue
        const apiStats = invoicesResult.data.stats;

        // Calculate Overdue manually
        const overdue = (invoicesResult.data.data || [])
          .filter((inv: Invoice) => inv.status === 'overdue' || (inv.status === 'sent' && new Date(inv.dueDate) < new Date()))
          .reduce((sum: number, inv: Invoice) => sum + (inv.total || 0), 0);

        setStats({
          totalAmount: apiStats.totalAmount || 0,
          paidAmount: apiStats.paidAmount || 0,
          pendingAmount: apiStats.pendingAmount || 0,
          overdueAmount: overdue,
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

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId || !formData.date || formData.items.some(i => !i.description || i.rate <= 0)) {
      alert("Please fill all required fields correctly.");
      return;
    }

    setSubmitting(true);
    try {
      const client = clients.find(c => c.id === formData.clientId);
      const result = await createInvoice({
        clientId: formData.clientId,
        clientName: client?.name || "Unknown",
        date: formData.date,
        dueDate: formData.dueDate,
        items: formData.items,
        status: formData.status
      });

      if (result.success) {
        setShowModal(false);
        setFormData({
          clientId: "",
          clientName: "",
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: [{ description: "", quantity: 1, rate: 0 }],
          status: "draft"
        });
        fetchData();
      } else {
        alert("Failed: " + result.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error creating invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: "", quantity: 1, rate: 0 }] });
  };

  const removeItem = (index: number) => {
    if (formData.items.length === 1) return;
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    // @ts-ignore
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const markAsPaid = async (id: string) => {
    if (!confirm("Mark this invoice as PAID? This will record a transaction in Income.")) return;
    try {
      const result = await updateInvoice(id, { status: "paid" });
      if (result.success) fetchData();
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const deleteInvoice = async (id: string) => {
    if (!confirm("Are you sure? This will delete the invoice and linked transactions.")) return;
    try {
      // Using generic apiRequest for delete since wrapper might not exist yet or I prefer direct
      const result = await apiRequest(`/invoices?id=${id}`, { method: 'DELETE' });
      if (result.success) fetchData();
      else alert("Failed: " + result.error);
    } catch (err) {
      console.error(err);
    }
  }

  // Filter Logic
  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relative w-full min-h-screen text-white font-sans overflow-hidden perspective-1000">

      {/* --- Advanced Background --- */}
      <div className="fixed inset-0 z-0 bg-black">
        {/* Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />

        {/* Glowing Orbs - Blue/Purple for Invoices */}
        <div className="absolute top-[-20%] right-[20%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-600/10 rounded-full blur-[150px] animate-pulse-slow delay-1000" />

        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-8 space-y-12">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="relative">
            <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-blue-500 to-transparent rounded-full opacity-50" />
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 filter drop-shadow-2xl"
            >
              INVOICES
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-mono text-sm tracking-widest uppercase flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Billing Command Center
            </motion.p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="h-[56px] px-8 rounded-2xl font-bold text-sm bg-blue-600 text-white border border-blue-400/20 backdrop-blur-xl flex items-center gap-3 shadow-lg shadow-blue-900/20 group transition-all"
          >
            <div className="p-1.5 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
              <Plus size={18} />
            </div>
            CREATE NEW
          </motion.button>
        </div>

        {/* 3D Stats Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {[
            { label: "Total Invoiced", value: stats.totalAmount, color: "text-white", bg: "bg-white/5", icon: FileText, border: "border-white/10" },
            { label: "Paid", value: stats.paidAmount, color: "text-emerald-400", bg: "bg-emerald-500/5", icon: CheckCircle, border: "border-emerald-500/20" },
            { label: "Pending", value: stats.pendingAmount, color: "text-blue-400", bg: "bg-blue-500/5", icon: Clock, border: "border-blue-500/20" },
            { label: "Overdue", value: stats.overdueAmount, color: "text-red-400", bg: "bg-red-500/5", icon: AlertCircle, border: "border-red-500/20" },
          ].map((stat, i) => (
            <TiltCard key={i} className="h-full">
              <div className={`h-full p-6 rounded-3xl ${stat.bg} border ${stat.border} backdrop-blur-xl relative overflow-hidden group hover:bg-opacity-20 transition-all duration-500`}>
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-3xl opacity-20 ${stat.color.replace('text-', 'bg-')}`} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                      <stat.icon size={18} />
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                  </div>
                  <p className={`text-2xl md:text-3xl font-black ${stat.color} tabular-nums tracking-tight`}>
                    ₹{stat.value.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-[#0A0A0A]/60 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-md">
          {/* Toolbar */}
          <div className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md group">
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity duration-500" />
              <div className="relative flex items-center bg-[#050505] border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 transition-colors">
                <Search className="ml-4 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none py-3 px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                  placeholder="Search by Invoice # or Client..."
                />
              </div>
            </div>

            <div className="flex gap-2">
              {['all', 'draft', 'sent', 'paid', 'overdue'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === s
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="h-64 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={32} className="animate-spin text-blue-500" />
                <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Fetching Invoices...</p>
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500">
                <FileText size={48} className="opacity-20 mb-4" />
                <p>No invoices found matching your criteria.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-white/[0.02]">
                    <th className="px-6 py-4">Invoice #</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Date & Due</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInvoices.map((inv, idx) => (
                    <motion.tr
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        {inv.invoiceNumber}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xs font-bold text-gray-300">
                            {inv.clientName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-300">{inv.clientName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span className="text-gray-300">{new Date(inv.date).toLocaleDateString("en-IN")}</span>
                          <span className={`font-mono mt-0.5 ${new Date(inv.dueDate) < new Date() && inv.status !== 'paid' ? 'text-red-400' : 'text-gray-500'
                            }`}>Due: {new Date(inv.dueDate).toLocaleDateString("en-IN")}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-white">₹{inv.total.toLocaleString("en-IN")}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            inv.status === 'overdue' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                              inv.status === 'sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-gray-500/10 text-gray-400 border-gray-500/20'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-400' :
                              inv.status === 'overdue' ? 'bg-red-400' :
                                inv.status === 'sent' ? 'bg-blue-400' : 'bg-gray-400'
                            }`} />
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {inv.status !== 'paid' && (
                            <button onClick={() => markAsPaid(inv.id!)} title="Mark Paid" className="p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-500 hover:scale-110 transition-all">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button title="Delete" onClick={() => deleteInvoice(inv.id!)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-500 hover:scale-110 transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* --- Create Modal --- */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                className="w-full max-w-4xl bg-[#0F0F0F] border border-white/10 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                  <h2 className="text-xl font-black text-white flex items-center gap-3">
                    <FileText className="text-blue-500" /> NEW INVOICE
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateInvoice} className="flex-1 overflow-y-auto p-8 space-y-8">
                  {/* Client & Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Client</label>
                      <div className="relative">
                        <select
                          value={formData.clientId}
                          onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                          className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-sm text-gray-300 focus:border-blue-500/50 appearance-none"
                        >
                          <option value="">Select Client</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Invoice Date</label>
                      <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-sm text-gray-300" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Due Date</label>
                      <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="w-full h-12 bg-[#050505] border border-white/10 rounded-xl px-4 text-sm text-gray-300" />
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">Line Items</label>
                      <button type="button" onClick={addItem} className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        <Plus size={12} /> ADD ITEM
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-start">
                          <div className="flex-1">
                            <input placeholder="Description" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)} className="w-full h-10 bg-[#050505] border border-white/10 rounded-lg px-3 text-sm text-white" />
                          </div>
                          <div className="w-20">
                            <input type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value))} className="w-full h-10 bg-[#050505] border border-white/10 rounded-lg px-3 text-sm text-white" />
                          </div>
                          <div className="w-32">
                            <input type="number" placeholder="Rate" value={item.rate} onChange={e => updateItem(i, 'rate', parseFloat(e.target.value))} className="w-full h-10 bg-[#050505] border border-white/10 rounded-lg px-3 text-sm text-white" />
                          </div>
                          <div className="w-32 h-10 flex items-center justify-end font-mono text-sm font-bold text-gray-400">
                            ₹{(item.quantity * item.rate).toLocaleString()}
                          </div>
                          <button type="button" onClick={() => removeItem(i)} className="p-2 text-gray-600 hover:text-red-500">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Total Amount</p>
                        <p className="text-3xl font-black text-white tabular-nums">
                          ₹{formData.items.reduce((s, i) => s + (i.quantity * i.rate), 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </form>

                <div className="p-6 border-t border-white/5 bg-[#050505] shrink-0">
                  <button
                    onClick={handleCreateInvoice}
                    disabled={submitting}
                    className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold tracking-wide shadow-lg shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {submitting ? "GENERATING..." : "CREATE INVOICE"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
