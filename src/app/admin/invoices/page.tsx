"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  QrCode,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Trash2,
  Save,
  Loader2
} from "lucide-react";
import { getInvoices, createInvoice, getClients } from "@/lib/admin-api";
import Image from "next/image";
import { useReactToPrint } from 'react-to-print';
import { getRecommendedPaymentTerm, generateMilestoneBreakdown, generateBookingBreakdown, PAYMENT_CONFIG, ServiceType } from "@/lib/payment-config";
import { Link as LinkIcon, Copy, Bookmark } from "lucide-react";

export default function InvoicesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<"minimal" | "bold" | "editorial">("editorial");
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${selectedInvoice}`,
  });

  const handleDownloadPDF = () => {
    // For PDF download, we'll use the browser's print-to-PDF feature
    // This is more reliable than html2canvas
    if (invoiceRef.current) {
      handlePrint();
      // Show a message to the user
      setTimeout(() => {
        alert('Please select "Save as PDF" in the print dialog to download the invoice as PDF.');
      }, 100);
    }
  };

  // Form State
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 15 days
    items: [{ description: "", quantity: 1, rate: 0 }],
    taxPercentage: 18,
    discount: 0,
    notes: "",
    terms: "Payment is due within 15 days.",
    status: "draft"
  });

  // Smart Invoice Builder State
  const [smartBuilder, setSmartBuilder] = useState({
    active: false,
    mode: "STANDARD" as "STANDARD" | "BOOKING", // Added Mode
    projectValue: 0,
    serviceType: "WEBSITE" as ServiceType,
  });

  const handleSmartSplit = () => {
    let newItems = [];
    let notes = "";
    let terms = "";

    if (smartBuilder.mode === "BOOKING") {
      // Booking Mode Logic (₹4000 Rule)
      const milestones = generateBookingBreakdown(smartBuilder.projectValue);
      newItems = milestones.map(m => ({
        description: m.name,
        quantity: 1,
        rate: m.amount
      }));
      notes = "Booking Mode: ₹4000 Advance Applied.";
      terms = "The Booking Fee is non-refundable. Work begins upon receipt of this advance.";
    } else {
      // Standard Logic
      const term = getRecommendedPaymentTerm(smartBuilder.projectValue, smartBuilder.serviceType);
      const milestones = generateMilestoneBreakdown(smartBuilder.projectValue, term);
      newItems = milestones.map(m => ({
        description: `${m.name} (${m.percentage}%)`,
        quantity: 1,
        rate: m.amount
      }));
      notes = `Payment Terms: ${term.replace(/_/g, ' ')}`;
      terms = `This invoice is part of a ${term.replace(/_/g, ' ')} agreement.`;
    }

    setFormData({
      ...formData,
      items: newItems,
      notes,
      terms
    });
  };

  useEffect(() => {
    fetchInvoices();
    fetchClients();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const result = await getInvoices();
      if (result.success && result.data) {
        // Handle nested data structure
        const dataArray = result.data.data || [];
        setInvoices(dataArray);
      } else {
        setInvoices([]);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const result = await getClients();
      if (result.success && result.data) {
        setClients(result.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setFormData({
      ...formData,
      clientId,
      clientName: client ? client.name : ""
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, rate: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    const tax = (subtotal * formData.taxPercentage) / 100;
    return subtotal + tax - formData.discount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientId) {
      alert("Please select a client");
      return;
    }

    try {
      setSubmitting(true);
      const result = await createInvoice({
        clientId: formData.clientId,
        clientName: formData.clientName,
        date: formData.date,
        dueDate: formData.dueDate,
        items: formData.items,
        taxPercentage: formData.taxPercentage,
        discount: formData.discount,
        notes: formData.notes,
        terms: formData.terms,
        status: formData.status
      });

      if (result.success) {
        setShowCreateForm(false);
        setFormData({
          clientId: "",
          clientName: "",
          date: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          items: [{ description: "", quantity: 1, rate: 0 }],
          taxPercentage: 18,
          discount: 0,
          notes: "",
          terms: "Payment is due within 15 days.",
          status: "draft"
        });
        fetchInvoices();
      } else {
        alert("Failed to create invoice: " + result.error);
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert("An error occurred while creating the invoice");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: invoices.reduce((sum, inv) => sum + (inv.total || 0), 0),
    paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0),
    pending: invoices.filter(inv => inv.status === 'pending' || inv.status === 'sent').reduce((sum, inv) => sum + (inv.total || 0), 0),
    overdue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total || 0), 0),
  };

  const statusColors = {
    paid: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    unpaid: "bg-red-500/10 text-red-500 border-red-500/20",
    partially_paid: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    draft: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    sent: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    overdue: "bg-red-500/10 text-red-500 border-red-500/20",
    cancelled: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Invoices</h1>
          <p className="text-white/60">Manage and track all your client invoices</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="group relative px-6 py-3 bg-[#FF7A00] text-black font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)]"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <div className="relative flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Create Invoice</span>
          </div>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Invoiced", value: stats.total, icon: FileText, color: "text-white", bg: "bg-white/5" },
          { label: "Paid Amount", value: stats.paid, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Amount", value: stats.pending, icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Overdue Amount", value: stats.overdue, icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10" },
        ].map((stat, index) => (
          <div key={index} className="group p-6 rounded-2xl bg-[#111111]/50 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                INR
              </span>
            </div>
            <div>
              <p className="text-sm text-white/60 font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">
                ₹{stat.value.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Create Invoice Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl my-8 relative">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Create New Invoice</h2>
              <button onClick={() => setShowCreateForm(false)} className="text-white/40 hover:text-white">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">

              {/* Smart Builder Toggle */}
              <div className="bg-[#FF7A00]/10 border border-[#FF7A00]/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#FF7A00]/20 rounded-lg text-[#FF7A00]">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Smart Invoice Builder</h3>
                      <p className="text-xs text-white/60">Auto-calculate milestones based on project value</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSmartBuilder({ ...smartBuilder, active: !smartBuilder.active })}
                    className="text-xs font-bold text-[#FF7A00] hover:underline"
                  >
                    {smartBuilder.active ? "Hide Builder" : "Show Builder"}
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setSmartBuilder({ ...smartBuilder, mode: "STANDARD" })}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${smartBuilder.mode === "STANDARD" ? "bg-[#FF7A00] text-black" : "bg-white/5 text-white/60"}`}
                  >
                    Standard Split
                  </button>
                  <button
                    onClick={() => setSmartBuilder({ ...smartBuilder, mode: "BOOKING" })}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${smartBuilder.mode === "BOOKING" ? "bg-[#FF7A00] text-black" : "bg-white/5 text-white/60"}`}
                  >
                    <Bookmark className="w-4 h-4" />
                    Booking Mode (₹4k)
                  </button>
                </div>

                {smartBuilder.active && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#FF7A00]/10">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Service Type</label>
                      <select
                        value={smartBuilder.serviceType}
                        onChange={(e) => setSmartBuilder({ ...smartBuilder, serviceType: e.target.value as ServiceType })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF7A00]"
                      >
                        <option value="WEBSITE">Website Dev</option>
                        <option value="WEB_APP">Web App / SaaS</option>
                        <option value="MOBILE_APP">Mobile App</option>
                        <option value="MARKETING">Marketing Retainer</option>
                        <option value="AMC">AMC / Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Total Project Value (₹)</label>
                      <input
                        type="number"
                        value={smartBuilder.projectValue}
                        onChange={(e) => setSmartBuilder({ ...smartBuilder, projectValue: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF7A00]"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={handleSmartSplit}
                        className="w-full bg-[#FF7A00] text-black font-bold py-2 rounded-lg text-sm hover:bg-[#FF7A00]/90"
                      >
                        Auto-Generate Items
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <form id="create-invoice-form" onSubmit={handleSubmit} className="space-y-6">
                {/* Client & Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Client</label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => handleClientChange(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF7A00]"
                      required
                    >
                      <option value="">Select Client</option>
                      {clients.map(client => (
                        <option key={client.id} value={client.id}>{client.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF7A00]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-[#FF7A00]"
                      required
                    />
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium text-white/60">Items</label>
                    <button type="button" onClick={addItem} className="text-xs text-[#FF7A00] hover:underline">+ Add Item</button>
                  </div>
                  <div className="space-y-2">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-20 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-32 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                          required
                        />
                        <button type="button" onClick={() => removeItem(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Notes</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white h-20"
                        placeholder="Additional notes..."
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Terms</label>
                      <textarea
                        value={formData.terms}
                        onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white h-20"
                        placeholder="Payment terms..."
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Subtotal</span>
                      <span className="text-white font-medium">
                        ₹{formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Tax (%)</span>
                      <input
                        type="number"
                        value={formData.taxPercentage}
                        onChange={(e) => setFormData({ ...formData, taxPercentage: parseFloat(e.target.value) || 0 })}
                        className="w-20 bg-black/20 border border-white/10 rounded px-2 py-1 text-right text-sm text-white"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/60">Discount</span>
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                        className="w-24 bg-black/20 border border-white/10 rounded px-2 py-1 text-right text-sm text-white"
                      />
                    </div>
                    <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-xl font-bold text-[#FF7A00]">₹{calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end gap-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-invoice-form"
                disabled={submitting}
                className="px-6 py-2 bg-[#FF7A00] text-black font-bold rounded-xl hover:bg-[#FF7A00]/90 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="rounded-3xl bg-[#111111]/50 backdrop-blur-xl border border-white/5 overflow-hidden">
        {/* Controls Bar */}
        <div className="p-6 border-b border-white/5 flex flex-col lg:flex-row gap-6 justify-between items-center">
          {/* Search & Filter */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search invoices..."
                className="w-full bg-black/20 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF7A00]/50 transition-colors"
              />
            </div>
            <button className="p-2.5 bg-black/20 border border-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Invoice No.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white/40 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white/40 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#FF7A00] border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-medium animate-pulse">Loading invoices...</p>
                    </div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 rounded-full bg-white/5">
                        <FileText className="w-8 h-8 opacity-50" />
                      </div>
                      <p className="text-sm font-medium">No invoices found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white group-hover:text-[#FF7A00] transition-colors">
                        {invoice.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FF4D00] flex items-center justify-center text-black font-bold text-xs">
                          {invoice.clientName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-white/80">{invoice.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white/60">
                      {new Date(invoice.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-white">
                        ₹{(invoice.total || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[invoice.status as keyof typeof statusColors] || statusColors.draft}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
                          className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Preview Modal - ENHANCED VERSION */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111111] border border-white/10 rounded-3xl shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-[#111111]/95 backdrop-blur border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Invoice Preview</h2>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {(() => {
                const invoice = invoices.find((inv) => inv.id === selectedInvoice);
                if (!invoice) return null;

                return (
                  <div ref={invoiceRef} className="bg-[#ffffff] text-[#000000] max-w-4xl mx-auto print:shadow-none" style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                    {/* Orange accent bar at top */}
                    <div className="h-2" style={{ background: 'linear-gradient(to right, #FF7A00, #FF4D00)' }} />

                    <div className="p-12 print:p-8">
                      {/* Invoice Header */}
                      <div className="flex justify-between items-start mb-10 pb-8 border-b-2 border-[#e5e7eb]">
                        <div className="flex items-start gap-4">
                          <img
                            src="/shivkaralogo.jpg"
                            alt="Shivkara Digital"
                            className="w-16 h-16 object-contain rounded-lg"
                          />
                          <div>
                            <h1 className="text-3xl font-black tracking-tight mb-1 text-[#FF7A00] print:text-black">
                              SHIVKARA DIGITAL
                            </h1>
                            <p className="text-sm text-[#4b5563] font-medium">Creative Digital Solutions</p>
                            <div className="mt-3 text-xs text-[#6b7280] space-y-0.5">
                              <p>📧 info@shivkaradigital.com</p>
                              <p>📱 +91 78772 18473</p>
                              <p>🌐 www.shivkaradigital.com</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-block text-white px-6 py-3 rounded-lg mb-3 print:bg-[#FF7A00] print:text-white" style={{ backgroundColor: '#FF7A00' }}>
                            <h2 className="text-2xl font-black tracking-tight">INVOICE</h2>
                          </div>
                          <p className="text-lg font-bold text-[#111827]">#{invoice.invoiceNumber}</p>
                          <p className="text-xs text-[#6b7280] mt-1">
                            Status: <span className={`font-bold ${invoice.status === 'paid' ? 'text-[#16a34a]' : 'text-[#ea580c]'}`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Client & Invoice Details */}
                      <div className="grid grid-cols-2 gap-12 mb-10">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-3">Bill To</p>
                          <div className="bg-[#f9fafb] p-4 rounded-lg border-l-4 border-[#FF7A00] print:bg-transparent print:border-[#d1d5db]">
                            <p className="text-xl font-bold text-[#111827] mb-1">{invoice.clientName}</p>
                            {invoice.clientEmail && (
                              <p className="text-sm text-[#4b5563]">📧 {invoice.clientEmail}</p>
                            )}
                            {invoice.clientPhone && (
                              <p className="text-sm text-[#4b5563]">📱 {invoice.clientPhone}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-3">Invoice Details</p>
                          <div className="bg-[#f9fafb] p-4 rounded-lg space-y-2 print:bg-transparent">
                            <div className="flex justify-between">
                              <span className="text-sm font-bold text-[#374151]">Issue Date:</span>
                              <span className="text-sm font-medium text-[#111827]">
                                {new Date(invoice.date).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-bold text-[#374151]">Due Date:</span>
                              <span className="text-sm font-medium text-[#111827]">
                                {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }) : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Items Table */}
                      <div className="mb-10">
                        <table className="w-full">
                          <thead>
                            <tr className="text-[#ffffff] print:bg-[#1f2937] print:text-[#ffffff]" style={{ backgroundColor: '#1f2937' }}>
                              <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider rounded-tl-lg">#</th>
                              <th className="py-4 px-4 text-left text-xs font-black uppercase tracking-wider">Description</th>
                              <th className="py-4 px-4 text-center text-xs font-black uppercase tracking-wider">Qty</th>
                              <th className="py-4 px-4 text-right text-xs font-black uppercase tracking-wider">Rate</th>
                              <th className="py-4 px-4 text-right text-xs font-black uppercase tracking-wider rounded-tr-lg">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e5e7eb]">
                            {invoice.items && invoice.items.map((item: any, index: number) => (
                              <tr key={index} className="hover:bg-[#f9fafb] transition-colors">
                                <td className="py-4 px-4 text-sm font-bold text-[#6b7280]">{index + 1}</td>
                                <td className="py-4 px-4 text-sm font-bold text-[#111827]">{item.description}</td>
                                <td className="py-4 px-4 text-center text-sm font-medium text-[#4b5563]">{item.quantity}</td>
                                <td className="py-4 px-4 text-right text-sm font-medium text-[#4b5563]">₹{item.rate.toLocaleString("en-IN")}</td>
                                <td className="py-4 px-4 text-right text-sm font-bold text-[#111827]">₹{(item.quantity * item.rate).toLocaleString("en-IN")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Notes and Totals */}
                      <div className="grid grid-cols-2 gap-8 mb-10">
                        {/* Notes */}
                        <div>
                          {invoice.notes && (
                            <div className="mb-6">
                              <p className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Notes</p>
                              <div className="bg-[#eff6ff] border-l-4 border-[#60a5fa] p-4 rounded print:bg-transparent print:border-[#d1d5db]">
                                <p className="text-sm text-[#374151]">{invoice.notes}</p>
                              </div>
                            </div>
                          )}
                          {invoice.terms && (
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-[#9ca3af] mb-2">Terms & Conditions</p>
                              <div className="bg-[#f9fafb] p-4 rounded text-xs text-[#4b5563] print:bg-transparent">
                                <p>{invoice.terms}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Totals */}
                        <div>
                          <div className="bg-[#f9fafb] p-6 rounded-xl space-y-3 print:bg-transparent print:border print:border-[#e5e7eb]">
                            <div className="flex justify-between text-sm">
                              <span className="font-bold text-[#4b5563]">Subtotal</span>
                              <span className="font-bold text-[#111827]">₹{(invoice.subtotal || 0).toLocaleString("en-IN")}</span>
                            </div>
                            {invoice.tax > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="font-bold text-[#4b5563]">Tax ({invoice.taxPercentage}%)</span>
                                <span className="font-bold text-[#111827]">₹{invoice.tax.toLocaleString("en-IN")}</span>
                              </div>
                            )}
                            {invoice.discount > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="font-bold text-[#4b5563]">Discount</span>
                                <span className="font-bold text-[#dc2626]">-₹{invoice.discount.toLocaleString("en-IN")}</span>
                              </div>
                            )}
                            <div className="border-t-2 border-[#d1d5db] pt-3 mt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-xl font-black text-[#111827]">TOTAL</span>
                                <span className="text-2xl font-black text-[#FF7A00] print:text-[#000000]">
                                  ₹{(invoice.total || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Details */}
                      <div className="text-[#ffffff] p-8 rounded-2xl print:bg-[#1f2937] print:text-[#ffffff]" style={{ backgroundColor: '#1f2937' }}>
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#ffffff] mb-4 print:text-[#ffffff]">Payment Information</p>
                            <div className="grid grid-cols-2 gap-6 text-sm">
                              <div>
                                <p className="text-[#d1d5db] text-xs mb-1 print:text-[#d1d5db]">Bank Name</p>
                                <p className="font-bold text-[#ffffff]">Punjab National Bank</p>
                              </div>
                              <div>
                                <p className="text-[#d1d5db] text-xs mb-1 print:text-[#d1d5db]">Account Number</p>
                                <p className="font-bold text-[#ffffff]">51551001000010405</p>
                              </div>
                              <div>
                                <p className="text-[#d1d5db] text-xs mb-1 print:text-[#d1d5db]">IFSC Code</p>
                                <p className="font-bold text-[#ffffff]">PUNB0515510</p>
                              </div>
                              <div>
                                <p className="text-[#d1d5db] text-xs mb-1 print:text-[#d1d5db]">Account Name</p>
                                <p className="font-bold text-[#ffffff]">Shivkara Digital</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-[#d1d5db] text-xs mb-1 print:text-[#d1d5db]">UPI ID</p>
                                <p className="font-bold text-[#ffffff]">vanshgehlot9@ybl</p>
                              </div>
                            </div>
                          </div>
                          <div className="text-center ml-8">
                            <div className="bg-[#ffffff] p-3 rounded-xl shadow-lg print:shadow-none print:border print:border-[#e5e7eb]">
                              <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=vanshgehlot9@ybl%26pn=Shivkara%20Digital%26cu=INR"
                                alt="UPI QR Code"
                                className="w-24 h-24"
                              />
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#d1d5db] print:text-[#ffffff] mt-2">Scan to Pay</p>
                          </div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-8 pt-6 border-t-2 border-[#e5e7eb] text-center">
                        <p className="text-sm font-semibold text-[#111827] mb-2">Thank you for your business!</p>
                        <p className="text-xs text-[#6b7280]">
                          This is a computer-generated invoice and does not require a signature.
                        </p>
                      </div>
                    </div>

                    {/* Orange accent bar at bottom */}
                    <div className="h-2" style={{ backgroundColor: '#FF7A00' }} />
                  </div>
                );
              })()}
            </div>

            <div className="sticky bottom-0 p-6 bg-[#111111]/95 backdrop-blur border-t border-white/5 flex gap-4">
              <button
                onClick={() => {
                  const link = `${window.location.origin}/pay/${selectedInvoice}`;
                  navigator.clipboard.writeText(link);
                  alert("Payment link copied to clipboard: " + link);
                }}
                className="flex-1 py-4 bg-white/10 text-white font-black uppercase tracking-wider text-sm hover:bg-white/20 transition-colors rounded-xl flex items-center justify-center gap-2"
              >
                <LinkIcon className="w-5 h-5" />
                Copy Link
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 py-4 bg-[#FF7A00] text-black font-black uppercase tracking-wider text-sm hover:bg-[#FF7A00]/90 transition-colors rounded-xl flex items-center justify-center gap-2"
              >
                <Printer className="w-5 h-5" />
                Print Invoice
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 py-4 bg-white/10 text-white font-black uppercase tracking-wider text-sm hover:bg-white/20 transition-colors rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
