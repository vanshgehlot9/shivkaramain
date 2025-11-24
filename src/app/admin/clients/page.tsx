"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, ChevronRight, Phone, Mail, Trash2, Plus, Users, AlertCircle, DollarSign, Loader2, X, Building, MapPin, FileText } from "lucide-react";
import { getClients, getInvoices, deleteClient, createClient } from "@/lib/admin-api";

export default function ClientsPage() {
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);
  const [clientInvoices, setClientInvoices] = useState<Record<string, any[]>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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
        setSummary({
          totalClients: 0,
          totalOutstanding: 0,
          totalRevenue: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]);
      setSummary({
        totalClients: 0,
        totalOutstanding: 0,
        totalRevenue: 0,
      });
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Clients
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Manage your client relationships and balances.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-black rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Plus size={16} />
            Add Client
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Clients */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} className="text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-white/10 text-white">
                <Users size={18} />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Clients</p>
            </div>
            <p className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {summary.totalClients}
            </p>
          </div>
        </div>

        {/* Outstanding */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group hover:border-red-500/20 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertCircle size={80} className="text-[#D93636]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-[#D93636]/10 text-[#D93636]">
                <AlertCircle size={18} />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Outstanding</p>
            </div>
            <p className="text-3xl font-bold text-[#D93636] tabular-nums tracking-tight">
              ₹{summary.totalOutstanding.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div className="p-6 rounded-2xl bg-[#111111] border border-white/5 relative overflow-hidden group hover:border-[#FF7A00]/20 transition-colors">
          <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <DollarSign size={80} className="text-[#FF7A00]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-[#FF7A00]/10 text-[#FF7A00]">
                <DollarSign size={18} />
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-[#FF7A00] tabular-nums tracking-tight">
              ₹{summary.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Create Client Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111111] border border-white/10 rounded-3xl shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#111111]/95 backdrop-blur border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Add New Client</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                    placeholder="Enter client name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                    placeholder="client@example.com"
                  />
                </div>
              </div>

              {/* Phone & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider flex items-center gap-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                    placeholder="Company name (optional)"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-24 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00] resize-none"
                  placeholder="Enter full address (optional)"
                />
              </div>

              {/* GST Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">
                  GST Number
                </label>
                <input
                  type="text"
                  value={formData.gstNumber}
                  onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                  placeholder="GST Number (optional)"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 bg-[#FF7A00] text-black font-bold rounded-xl hover:bg-[#FF7A00]/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                  Add Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#FF7A00] transition-colors" />
          <input
            type="text"
            placeholder="Search by client name, phone, email..."
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

      {/* Clients List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00] mb-4" />
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500 bg-[#111111] border border-white/5 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Users size={24} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">No clients found</p>
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300"
            >
              {/* Client Header */}
              <div className="p-6 border-b border-white/5">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-lg font-bold text-white">
                        {client.name.charAt(0)}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {client.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 ml-13 pl-13">
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                        <Phone size={14} />
                        <span className="font-medium">{client.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
                        <Mail size={14} />
                        <span className="font-medium">{client.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="flex gap-8">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">
                          Outstanding
                        </p>
                        <p className={`text-xl font-bold tabular-nums ${(client.outstandingBalance || 0) > 0 ? "text-[#D93636]" : "text-[#CCFF00]"
                          }`}>
                          ₹{(client.outstandingBalance || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">
                          Total Paid
                        </p>
                        <p className="text-xl font-bold tabular-nums text-[#FF7A00]">
                          ₹{(client.totalRevenue || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => toggleClientLedger(client.id)}
                        className={`
                          flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border
                          ${selectedClient === client.id
                            ? "bg-white text-black border-white"
                            : "bg-black text-white border-white/10 hover:bg-white/5"
                          }
                        `}
                      >
                        <Eye size={16} />
                        {selectedClient === client.id ? "Hide History" : "View History"}
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="p-2.5 rounded-xl bg-black border border-white/10 hover:bg-[#D93636]/10 hover:border-[#D93636] hover:text-[#D93636] text-gray-400 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Ledger Dropdown */}
              {selectedClient === client.id && (
                <div className="p-6 bg-black/20 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                  <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-wider">
                    Transaction History
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-white/5">
                    <table className="w-full">
                      <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Invoice ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 bg-[#0A0A0A]">
                        {!clientInvoices[client.id] ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
                              Loading invoices...
                            </td>
                          </tr>
                        ) : clientInvoices[client.id].length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 text-sm">
                              No invoices found for this client.
                            </td>
                          </tr>
                        ) : (
                          clientInvoices[client.id].map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-4 py-3 text-sm font-bold text-white">
                                {invoice.invoiceNumber || invoice.id}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium text-gray-400">
                                {new Date(invoice.date).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-white">
                                ₹{invoice.total.toLocaleString("en-IN")}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${invoice.status === "paid"
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    : invoice.status === "partially_paid"
                                      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                      : "bg-red-500/10 text-red-500 border-red-500/20"
                                    }`}
                                >
                                  {invoice.status.replace('_', ' ')}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
