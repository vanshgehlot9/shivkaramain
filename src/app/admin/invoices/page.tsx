"use client";

import { useState } from "react";
import { Plus, Search, Filter, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

const INVOICE_STATS = [
  { label: "Total Invoiced", value: "₹48,100", icon: FileText, color: "text-white" },
  { label: "Paid Amount", value: "₹0", icon: CheckCircle, color: "text-green-500" },
  { label: "Pending Amount", value: "₹33,100", icon: Clock, color: "text-blue-500" },
  { label: "Overdue Amount", value: "₹0", icon: AlertCircle, color: "text-red-500" },
];

const INVOICES = [
  { id: "BOOK-506922", client: "Vansh Gehlot", clientInitials: "V", clientColor: "bg-orange-500", date: "05 Dec 2025", amount: "₹1,800", status: "SENT" },
  { id: "INV-2025-11-BOOK-rmi5", client: "Tested", clientInitials: "T", clientColor: "bg-orange-500", date: "25 Nov 2025", amount: "₹7,500", status: "SENT" },
  { id: "INV-2025-11-BOOK-QEB9", client: "Demo", clientInitials: "D", clientColor: "bg-orange-500", date: "25 Nov 2025", amount: "₹4,500", status: "SENT" },
  { id: "INV-2025-11-BOOK-goZQ", client: "Vansh", clientInitials: "V", clientColor: "bg-orange-500", date: "25 Nov 2025", amount: "₹4,500", status: "SENT" },
  { id: "INV-2025-11-BOOK-ITId", client: "Vansh", clientInitials: "V", clientColor: "bg-orange-500", date: "25 Nov 2025", amount: "₹4,500", status: "SENT" },
];

export default function InvoicesPage() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-1">Invoices</h2>
          <p className="text-gray-400 text-sm">Manage and track all your client invoices</p>
        </div>
        <MagneticButton className="bg-shivkara-orange text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-shadow">
          <Plus className="w-4 h-4" />
          Create Invoice
        </MagneticButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {INVOICE_STATS.map((stat, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-xs font-bold uppercase tracking-widest">INR</span>
            </div>
            <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-4 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden min-h-[500px]">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search invoices..."
              className="w-full bg-[#050505] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-shivkara-orange/50 transition-colors"
            />
          </div>
          <button className="p-2.5 bg-[#050505] hover:bg-white/5 border border-white/10 rounded-xl transition-all">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-[#050505]/50">
          <div className="col-span-3">Invoice No.</div>
          <div className="col-span-3">Client</div>
          <div className="col-span-2">Date</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/5">
          {INVOICES.map((inv, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors group">
              <div className="col-span-3 font-mono text-sm font-bold text-white">{inv.id}</div>

              <div className="col-span-3 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${inv.clientColor} flex items-center justify-center text-[10px] font-black text-black`}>
                  {inv.clientInitials}
                </div>
                <span className="text-sm text-gray-300 font-medium">{inv.client}</span>
              </div>

              <div className="col-span-2 text-sm text-gray-500">{inv.date}</div>

              <div className="col-span-2 text-right font-bold text-white">{inv.amount}</div>

              <div className="col-span-1 text-center">
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-2 py-1 rounded uppercase tracking-wide">
                  {inv.status}
                </span>
              </div>

              <div className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs text-gray-500 hover:text-white underline">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
