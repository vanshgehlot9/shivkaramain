import React from "react";
import { BarChart3, FileText } from "lucide-react";
export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Financial Reports & AI Insights</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <div className="font-bold text-lg mb-2 text-gray-900">Export Data</div>
          <div className="w-full h-32 flex items-center justify-center text-blue-400">[Export to Excel/PDF]</div>
        </section>
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="font-bold text-lg mb-2 text-gray-900">AI Insights</div>
          <div className="w-full h-48 flex items-center justify-center text-green-400">[Growth Trends, Forecasts, Suggestions]</div>
        </section>
      </main>
    </div>
  );
}
