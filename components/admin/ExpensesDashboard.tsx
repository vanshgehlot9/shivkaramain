import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useUserRole } from "../../hooks/useUserRole";
import { PlusCircle, Trash2, Edit, DollarSign, Calendar, Tag } from "lucide-react";

interface Expense {
  id: string;
  category: string;
  amount: number;
  date: any;
  description?: string;
}

export function ExpensesDashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ category: "", amount: "", date: "", description: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { userRole, isLoading: roleLoading } = useUserRole();

  const canEdit = true; // Temporarily allow all access

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "expenses"));
      setExpenses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Expense[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.date) return;
    
    try {
      const expenseData = {
        category: form.category,
        amount: parseFloat(form.amount),
        date: Timestamp.fromDate(new Date(form.date)),
        description: form.description,
        createdAt: Timestamp.now()
      };

      if (editingId) {
        await updateDoc(doc(db, "expenses", editingId), expenseData);
      } else {
        await addDoc(collection(db, "expenses"), expenseData);
      }
      
      setForm({ category: "", amount: "", date: "", description: "" });
      setEditingId(null);
      setShowForm(false);
      fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setForm({
      category: expense.category || "",
      amount: expense.amount ? expense.amount.toString() : "",
      date: expense.date ? expense.date.toDate().toISOString().slice(0, 10) : "",
      description: expense.description || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await deleteDoc(doc(db, "expenses", id));
      fetchExpenses();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="text-red-600 text-lg font-semibold">Access Denied</div>
        <p className="text-red-500 mt-2">You don't have permission to access the expenses module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Management</h1>
          <p className="text-gray-600 mt-1">Track and manage your business expenses</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm({ category: "", amount: "", date: "", description: "" });
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Expense
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-blue-900">₹{totalExpenses.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Records</p>
                <p className="text-2xl font-bold text-green-900">{expenses.length}</p>
              </div>
              <Tag className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">This Month</p>
                <p className="text-2xl font-bold text-purple-900">₹{expenses.filter(e => {
                  const expenseDate = e.date?.toDate();
                  const currentMonth = new Date().getMonth();
                  return expenseDate && expenseDate.getMonth() === currentMonth;
                }).reduce((sum, exp) => sum + exp.amount, 0).toLocaleString()}</p>
              </div>
              <Calendar className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900">
              {editingId ? "Edit Expense" : "Add New Expense"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  name="category" 
                  value={form.category} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Office Supplies">Office Supplies</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Travel">Travel</option>
                  <option value="Software">Software</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                <input 
                  name="amount" 
                  type="number" 
                  step="0.01"
                  value={form.amount} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  name="date" 
                  type="date" 
                  value={form.date} 
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={form.description} 
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description..."
                />
              </div>
              
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  {editingId ? "Update Expense" : "Add Expense"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setForm({ category: "", amount: "", date: "", description: "" });
                  }}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Expenses Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading expenses...</span>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No expenses found</p>
              <p className="text-gray-400">Add your first expense to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {expense.date ? expense.date.toDate().toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {expense.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(expense)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(expense.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
