import React from "react";
import { FileText, PlusCircle } from "lucide-react";
export default function BillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Professional Billing</h1>
          <button className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors flex items-center gap-2">
            <PlusCircle className="w-5 h-5" />
            Create Invoice
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <div className="font-bold text-lg mb-2 text-gray-900">Invoices</div>
          <div className="w-full h-32 flex items-center justify-center text-yellow-400">[Table of Invoices]</div>
        </section>
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="font-bold text-lg mb-2 text-gray-900">Invoice Preview</div>
          <div className="w-full h-48 flex items-center justify-center text-gray-400">[Invoice PDF Preview]</div>
        </section>
      </main>
    </div>
  );
}
