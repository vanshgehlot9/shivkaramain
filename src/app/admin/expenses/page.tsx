"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Upload, Image as ImageIcon, Trash2, Loader2, Calendar, Tag, FileText, CreditCard, IndianRupee, X } from "lucide-react";
import { getExpenses, createExpense, deleteExpense } from "@/lib/admin-api";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ExpensesPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [formData, setFormData] = useState({
    date: "",
    purpose: "",
    category: "office",
    paymentMode: "cash",
    amount: "",
    billProof: null as File | null,
  });

  useEffect(() => {
    fetchExpenseData();
  }, []);

  const fetchExpenseData = async () => {
    try {
      setLoading(true);
      const result = await getExpenses({ limit: 100 });
      // API returns { success: true, data: [...], total: ... }
      // result.data is the array of expenses
      if (result.success && Array.isArray(result.data)) {
        setExpenseData(result.data);
        // Cast to any to access 'total' which exists at runtime but not in strict apiRequest type
        const resultAny = result as any;
        setTotalExpense(resultAny.total || result.data.reduce((sum: number, item: any) => sum + (item.amount || 0), 0));
      } else {
        setExpenseData([]);
        setTotalExpense(0);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenseData([]);
      setTotalExpense(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      let billProofUrl = undefined;
      if (formData.billProof) {
        const storageRef = ref(storage, `expenses/${Date.now()}_${formData.billProof.name}`);
        const uploadResult = await uploadBytes(storageRef, formData.billProof);
        billProofUrl = await getDownloadURL(uploadResult.ref);
      }

      const result = await createExpense({
        date: formData.date,
        purpose: formData.purpose,
        category: formData.category,
        paymentMode: formData.paymentMode,
        amount: parseFloat(formData.amount),
        billProofUrl: billProofUrl,
      });

      if (result.success) {
        setShowAddForm(false);
        setFormData({
          date: "",
          purpose: "",
          category: "office",
          paymentMode: "cash",
          amount: "",
          billProof: null,
        });
        await fetchExpenseData();
      } else {
        alert("Failed to create expense: " + result.error);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      alert("An error occurred while creating the expense record");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      try {
        const result = await deleteExpense(id);
        if (result.success) {
          await fetchExpenseData();
        } else {
          alert("Failed to delete expense: " + result.error);
        }
      } catch (error) {
        console.error("Error deleting expense:", error);
        alert("An error occurred while deleting the expense record");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Expenses
          </h1>
          <p className="text-gray-400 text-sm font-medium">
            Track and manage company expenditures.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block px-4 py-2 bg-[#111111] border border-white/5 rounded-xl">
            <span className="text-xs text-gray-500 uppercase tracking-wider mr-2">Total Expenses</span>
            <span className="text-sm font-bold text-red-500">₹{totalExpense.toLocaleString("en-IN")}</span>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`
              px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg
              ${showAddForm
                ? "bg-white/10 text-white hover:bg-white/20"
                : "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
              }
            `}
          >
            {showAddForm ? <X size={18} /> : <Plus size={18} />}
            {showAddForm ? "Close" : "Add Expense"}
          </button>
        </div>
      </div>

      {/* Add Expense Form */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAddForm ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-red-500 rounded-full" />
            New Expense Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <Calendar size={14} /> Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <FileText size={14} /> Purpose / Description
                </label>
                <input
                  type="text"
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="e.g. Server Hosting Costs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <Tag size={14} /> Category
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all appearance-none"
                  >
                    <option value="office">Office Supplies</option>
                    <option value="marketing">Marketing & Ads</option>
                    <option value="salary">Salary & Wages</option>
                    <option value="utilities">Utilities</option>
                    <option value="software">Software & Tools</option>
                    <option value="travel">Travel & Food</option>
                    <option value="other">Miscellaneous</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard size={14} /> Payment Mode
                </label>
                <div className="relative">
                  <select
                    required
                    value={formData.paymentMode}
                    onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all appearance-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="card">Credit/Debit Card</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <IndianRupee size={14} /> Amount
                </label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium tabular-nums focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400 uppercase tracking-wide flex items-center gap-2">
                  <Upload size={14} /> Bill Proof (Optional)
                </label>
                <label className="flex items-center justify-center w-full h-[46px] bg-black/50 border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-red-500 hover:bg-red-500/5 transition-all group">
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-red-500">
                    <Upload size={16} />
                    <span className="truncate max-w-[200px]">
                      {formData.billProof ? formData.billProof.name : "Upload Receipt"}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, billProof: file });
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                {submitting ? "Saving..." : "Record Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-red-500 transition-colors" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="w-full bg-[#111111] border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500/50 focus:bg-white/5 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 bg-[#111111] border border-white/5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="px-4 py-3 bg-[#111111] border border-white/5 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mb-4" />
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Loading data...</p>
          </div>
        ) : expenseData.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-500">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="opacity-50" />
            </div>
            <p className="text-sm font-medium">No expenses recorded</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenseData.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {item.date ? new Date(item.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                      {item.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {item.paymentMode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-red-500 tabular-nums">
                      ₹{(item.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.billProofUrl && (
                          <a
                            href={item.billProofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            title="View Receipt"
                          >
                            <ImageIcon size={16} />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
