"use client";

import { useState } from "react";
import {
  Download,
  FileText,
  Calendar,
  Loader2,
  TrendingUp,
  TrendingDown,
  Users,
  PieChart,
  Receipt,
  XCircle
} from "lucide-react";
import { apiRequest } from "@/lib/admin-api";

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState<number | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const reports = [
    {
      id: 1,
      name: "Income Report",
      description: "Detailed breakdown of all income transactions for the selected period",
      type: "income",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      id: 2,
      name: "Expense Report",
      description: "Complete list of all expenses incurred during the selected period",
      type: "expense",
      icon: TrendingDown,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      id: 3,
      name: "Client Report",
      description: "Comprehensive summary of client revenue and invoices",
      type: "client",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: 4,
      name: "Profit & Loss Report",
      description: "Financial summary including income, expenses, and net profit",
      type: "profit_loss",
      icon: PieChart,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      id: 5,
      name: "Tax Report",
      description: "Summary of tax collected and taxable amounts",
      type: "tax",
      icon: Receipt,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  const handleGenerateReport = async (reportId: number, type: string) => {
    if (!startDate || !endDate) {
      alert("Please select a date range first");
      return;
    }

    try {
      setLoading(reportId);
      const queryParams = new URLSearchParams({
        type,
        startDate,
        endDate,
      });

      const result = await apiRequest<any>(`/reports?${queryParams.toString()}`);

      if (result.success && result.data) {
        setReportData({
          type,
          data: result.data.data
        });
        // In a real app, we would generate a PDF/Excel file here
        console.log("Report Data:", result.data);
      } else {
        alert("Failed to generate report: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("An error occurred while generating the report");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Reports</h1>
          <p className="text-white/60">Generate comprehensive financial insights</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-[#111111]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FF7A00]/10 text-[#FF7A00]">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              Select Period
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full md:w-auto">
            <div className="relative flex-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#FF7A00]/50 transition-colors"
              />
              <span className="absolute -top-2.5 left-3 px-1 bg-[#050505] text-[10px] font-bold text-white/40 uppercase tracking-wider">From</span>
            </div>
            <div className="relative flex-1">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-[#FF7A00]/50 transition-colors"
              />
              <span className="absolute -top-2.5 left-3 px-1 bg-[#050505] text-[10px] font-bold text-white/40 uppercase tracking-wider">To</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div
            key={report.id}
            className="group relative bg-[#111111]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className={`p-3 rounded-xl ${report.bg} ${report.color}`}>
                <report.icon className="w-6 h-6" />
              </div>
              <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-wider">
                {report.type.replace('_', ' ')}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#FF7A00] transition-colors">
              {report.name}
            </h3>
            <p className="text-sm text-white/40 mb-8 leading-relaxed min-h-[40px]">
              {report.description}
            </p>

            <button
              onClick={() => handleGenerateReport(report.id, report.type)}
              disabled={loading === report.id}
              className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-white font-bold uppercase tracking-wider text-xs hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-[#FF7A00] group-hover:text-black group-hover:border-[#FF7A00]"
            >
              {loading === report.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {loading === report.id ? "Generating..." : "Generate Report"}
            </button>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {reportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[80vh] flex flex-col bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#111111]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[#FF7A00]" />
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  {reportData.type.replace('_', ' ')} Report
                </h3>
              </div>
              <button
                onClick={() => setReportData(null)}
                className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-black/50">
              <div className="bg-[#050505] border border-white/10 rounded-xl p-4 font-mono text-xs text-gray-300 overflow-x-auto">
                <pre>{JSON.stringify(reportData.data, null, 2)}</pre>
              </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-[#111111] flex justify-end">
              <button
                onClick={() => setReportData(null)}
                className="px-6 py-3 bg-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-white/20 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
