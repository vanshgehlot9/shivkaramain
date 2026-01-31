"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, Eye, Phone, Mail, Trash2, Plus, Users,
  AlertCircle, DollarSign, Loader2, X, Briefcase, ArrowUpRight,
  Building2, Wallet
} from "lucide-react";
import { getClients, getInvoices, deleteClient, createClient } from "@/lib/admin-api";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "@/components/admin/TiltCard";

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [clientInvoices, setClientInvoices] = useState<Record<string, any[]>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [summary, setSummary] = useState({
    totalClients: 0,
    totalOutstanding: 0,
    totalRevenue: 0,
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    gstNumber: "",
    status: "active"
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const result = await getClients();
      if (result.success && result.data) {
        const dataArray = Array.isArray(result.data.data) ? result.data.data : [];
        setClients(dataArray);

        setSummary(result.data.summary || {
          totalClients: 0,
          totalOutstanding: 0,
          totalRevenue: 0,
        });
      } else {
        setClients([]);
        setSummary({ totalClients: 0, totalOutstanding: 0, totalRevenue: 0 });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleClientLedger = async (clientId: string) => {
    if (selectedClient === clientId) {
      setSelectedClient(null);
      return;
    }

    setSelectedClient(clientId);

    if (!clientInvoices[clientId]) {
      try {
        const result = await getInvoices({ clientId });
        if (result.success && result.data) {
          setClientInvoices(prev => ({
            ...prev,
            [clientId]: result.data?.data || []
          }));
        }
      } catch (error) {
        console.error("Error fetching client invoices:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
      try {
        const result = await deleteClient(id);
        if (result.success) {
          fetchClients();
        } else {
          alert("Failed to delete client: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("An error occurred while deleting the client");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields (Name, Email, Phone)");
      return;
    }

    try {
      setSubmitting(true);
      const result = await createClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      });

      if (result.success) {
        setShowCreateForm(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          address: "",
          gstNumber: "",
          status: "active"
        });
        fetchClients();
      } else {
        alert("Failed to create client: " + result.error);
      }
    } catch (error) {
      console.error("Error creating client:", error);
      alert("An error occurred while creating the client");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter clients
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-screen text-white font-sans overflow-hidden perspective-1000">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] opacity-30 animate-pulse-glow" />
        <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-blue-600/5 rounded-full blur-[100px] opacity-20 animate-float" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-8 space-y-12">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="relative">
            <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-500 to-transparent rounded-full opacity-50" />
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-2 filter drop-shadow-2xl"
            >
              CLIENTS
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 font-mono text-sm tracking-widest uppercase flex items-center gap-3"
            >
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
              Relationship Management
            </motion.p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateForm(true)}
              className="h-[56px] px-8 rounded-2xl font-bold text-sm bg-cyan-500 text-black border border-cyan-400/20 backdrop-blur-xl flex items-center gap-3 shadow-lg shadow-cyan-900/20 group transition-all"
            >
              <div className="p-1.5 rounded-full bg-black/10 group-hover:bg-black/20 transition-colors">
                <Plus size={18} />
              </div>
              ADD NEW CLIENT
            </motion.button>
          </div>
        </div>

        {/* Stats 3D Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
          <TiltCard className="h-full">
            <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Users size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Clients</p>
                </div>
                <p className="text-4xl lg:text-5xl font-black text-white">{summary.totalClients}</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                    <AlertCircle size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Outstanding</p>
                </div>
                <p className="text-4xl lg:text-5xl font-black text-red-400 tracking-tight">₹{summary.totalOutstanding.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </TiltCard>

          <TiltCard className="h-full">
            <div className="h-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group hover:bg-white/10 transition-colors duration-500">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Wallet size={24} />
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
                </div>
                <p className="text-4xl lg:text-5xl font-black text-emerald-400 tracking-tight">₹{summary.totalRevenue.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </TiltCard>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity duration-500" />
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl flex items-center overflow-hidden h-14">
            <Search className="ml-6 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search clients by name, company, or email..."
              className="w-full bg-transparent border-none px-4 text-sm text-white placeholder:text-gray-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Clients List */}
        <div className="space-y-4">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 space-y-4">
              <Loader2 size={32} className="animate-spin text-cyan-400" />
              <p className="text-xs font-mono uppercase tracking-widest">Syncing Client Data...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center bg-white/5 border border-dashed border-white/10 rounded-3xl text-gray-500">
              <Users size={48} className="opacity-20 mb-4" />
              <p className="text-sm font-medium">No records found.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredClients.map((client, index) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-[#0A0A0A]/60 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden hover:border-cyan-500/30 transition-all duration-300 group"
                >
                  <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 relative">
                    {/* Accent Line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 opacity-50 group-hover:opacity-100 transition-opacity" />

                    {/* Client Info */}
                    <div className="flex-1 flex gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-2xl font-black text-white shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                          {client.name.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0A0A0A] ${client.outstandingBalance > 0 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                      </div>

                      <div className="flex flex-col justify-center">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">
                          {client.name}
                          {client.company && (
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-cyan-400 font-bold uppercase tracking-wide border border-white/5 flex items-center gap-1">
                              <Building2 size={10} />
                              {client.company}
                            </span>
                          )}
                        </h3>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium">
                          <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                            <Mail size={14} />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                            <Phone size={14} />
                            {client.phone || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financials & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pl-22 lg:pl-0 border-t lg:border-t-0 border-white/5 pt-6 lg:pt-0">
                      <div className="flex gap-8">
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Due</p>
                          <p className={`text-xl font-black tabular-nums tracking-tight ${(client.outstandingBalance || 0) > 0 ? "text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "text-gray-500"
                            }`}>
                            ₹{(client.outstandingBalance || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Lifetime</p>
                          <p className="text-xl font-black tabular-nums tracking-tight text-emerald-400">
                            ₹{(client.totalRevenue || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleClientLedger(client.id)}
                          className={`
                                      flex-1 sm:flex-none px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2 border shadow-lg
                                      ${selectedClient === client.id
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-cyan-900/20"
                              : "bg-white/5 text-gray-400 border-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30"
                            }
                                    `}
                        >
                          <Eye size={14} />
                          {selectedClient === client.id ? "CLOSE" : "LEDGER"}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(client.id)}
                          className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 text-gray-500 transition-colors shadow-lg"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Ledger */}
                  <AnimatePresence>
                    {selectedClient === client.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 bg-black/40"
                      >
                        <div className="p-6 md:p-8">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                              <ArrowUpRight size={14} /> Transaction History
                            </h4>
                          </div>

                          <div className="rounded-2xl border border-white/5 overflow-hidden">
                            <table className="w-full text-sm text-left">
                              <thead className="bg-white/5 text-xs text-gray-400 uppercase font-bold tracking-widest">
                                <tr>
                                  <th className="px-6 py-4">Invoice #</th>
                                  <th className="px-6 py-4">Date</th>
                                  <th className="px-6 py-4 text-right">Amount</th>
                                  <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {!clientInvoices[client.id] ? (
                                  <tr><td colSpan={4} className="p-8 text-center text-gray-500"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
                                ) : clientInvoices[client.id].length === 0 ? (
                                  <tr><td colSpan={4} className="p-8 text-center text-gray-500 text-xs font-mono">No invoices found.</td></tr>
                                ) : (
                                  clientInvoices[client.id].map(inv => (
                                    <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                                      <td className="px-6 py-4 font-mono font-bold text-white">{inv.invoiceNumber || inv.id.slice(0, 8)}</td>
                                      <td className="px-6 py-4 text-gray-400">{new Date(inv.date).toLocaleDateString("en-IN")}</td>
                                      <td className="px-6 py-4 text-right font-bold tabular-nums text-white">₹{inv.total.toLocaleString("en-IN")}</td>
                                      <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                            inv.status === 'partially_paid' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                              'bg-red-500/10 text-red-400 border-red-500/20'
                                          }`}>
                                          <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'paid' ? 'bg-emerald-400' :
                                              inv.status === 'partially_paid' ? 'bg-yellow-400' :
                                                'bg-red-400'
                                            }`} />
                                          {inv.status.replace('_', ' ')}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Create Client Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                className="w-full max-w-2xl bg-[#0F0F0F] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
              >
                <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-cyan-500/5">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <Users size={24} className="text-cyan-400" />
                    NEW CLIENT
                  </h2>
                  <button onClick={() => setShowCreateForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Client Name <span className="text-cyan-500">*</span></label>
                      <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="e.g. John Doe" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email <span className="text-cyan-500">*</span></label>
                      <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="email@company.com" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Phone <span className="text-cyan-500">*</span></label>
                      <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="+91 90000 00000" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Company</label>
                      <input type="text" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-cyan-500/50" placeholder="Acme Inc." />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Address</label>
                    <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full h-24 bg-black border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none" placeholder="Billing address..." />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <button type="submit" disabled={submitting} className="w-full h-14 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-lg font-black tracking-wide shadow-lg shadow-cyan-900/20 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98]">
                      {submitting ? "SAVING..." : "CREATE CLIENT"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
