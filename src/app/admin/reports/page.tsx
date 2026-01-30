"use client";

import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-1">Reports</h2>
        <p className="text-gray-400 text-sm">Detailed performance and financial reports.</p>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Reports Module</h3>
        <p className="text-gray-500 max-w-md">Downloadable PDF/CSV reports will be available here.</p>
      </div>
    </div>
  );
}
