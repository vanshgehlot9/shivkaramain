import React from "react";
import { DatabaseBackup } from "lucide-react";
export default function BackupRestorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Backup & Restore</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <div className="font-bold text-lg mb-2 text-gray-900">Data Backup</div>
          <div className="w-full h-32 flex items-center justify-center text-blue-400">[Backup Button]</div>
        </section>
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="font-bold text-lg mb-2 text-gray-900">Restore Data</div>
          <div className="w-full h-48 flex items-center justify-center text-gray-400">[Restore Button]</div>
        </section>
      </main>
    </div>
  );
}
