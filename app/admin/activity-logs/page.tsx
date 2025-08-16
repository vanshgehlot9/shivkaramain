import React from "react";
import { ListChecks } from "lucide-react";
export default function ActivityLogsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Activity Logs</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <div className="font-bold text-lg mb-2 text-gray-900">System Changes</div>
          <div className="w-full h-32 flex items-center justify-center text-gray-400">[Table of Activity Logs]</div>
        </section>
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="font-bold text-lg mb-2 text-gray-900">Audit Trail</div>
          <div className="w-full h-48 flex items-center justify-center text-blue-400">[Audit Trail Table]</div>
        </section>
      </main>
    </div>
  );
}
