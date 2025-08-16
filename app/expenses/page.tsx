"use client";
import React, { useState, useEffect } from "react";
import { DollarSign, Filter, PlusCircle, Download, Pencil, Trash2, ChevronDown, ChevronUp, Search } from "lucide-react";
import { ExpenseForm } from "../../components/expenses/ExpenseForm";
import { collection, query, getDocs, orderBy, where, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserRole } from "../../hooks/useUserRole";
import { Spinner } from "../../components/ui/spinner";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

type FinancialEntry = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: any;
};

type TimeFilter = 'week' | 'month' | 'year' | 'all';

export default function ExpensesPage() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<FinancialEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('month');
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | null>(null);
  const { userRole, isLoading: roleLoading } = useUserRole();
  
  // Financial summary
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    netBalance: 0,
  });
  
  // Check if user has access to this page
  useEffect(() => {
    // Redirect if not admin or finance role
    if (!roleLoading && userRole && !['admin', 'finance'].includes(userRole)) {
      window.location.href = "/admin";
    }
  }, [userRole, roleLoading]);
  
  // Fetch financial entries
  const fetchFinancialEntries = async () => {
    setIsLoading(true);
    try {
      let q;
      
      // Apply time filter
      if (timeFilter !== 'all') {
        const now = new Date();
        let startDate;
        
        switch (timeFilter) {
          case 'week':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            startDate = new Date(now);
            startDate.setMonth(now.getMonth() - 1);
            break;
          case 'year':
            startDate = new Date(now);
            startDate.setFullYear(now.getFullYear() - 1);
            break;
          default:
            startDate = new Date(0); // Beginning of time
        }
        
        q = query(
          collection(db, 'financials'),
          where('createdAt', '>=', Timestamp.fromDate(startDate)),
          orderBy('createdAt', 'desc')
        );
      } else {
        q = query(
          collection(db, 'financials'),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(q);
      
      const fetchedEntries: FinancialEntry[] = [];
      let incomeTotal = 0;
      let expenseTotal = 0;
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<FinancialEntry, 'id'>;
        const entry = {
          id: doc.id,
          ...data,
          date: data.date || data.createdAt?.toDate().toISOString().split('T')[0] || '',
        } as FinancialEntry;
        
        fetchedEntries.push(entry);
        
        // Calculate totals
        if (entry.type === 'income') {
          incomeTotal += entry.amount;
        } else {
          expenseTotal += entry.amount;
        }
      });
      
      setEntries(fetchedEntries);
      setFilteredEntries(fetchedEntries);
      
      // Update summary
      setSummary({
        totalIncome: incomeTotal,
        totalExpense: expenseTotal,
        netBalance: incomeTotal - expenseTotal,
      });
      
    } catch (error) {
      console.error("Error fetching financial entries:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (['admin', 'finance'].includes(userRole || '')) {
      fetchFinancialEntries();
    }
  }, [timeFilter, userRole]);
  
  // Handle search and filtering
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = entries.filter(entry => 
        entry.description.toLowerCase().includes(query) || 
        entry.category.toLowerCase().includes(query)
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);
  
  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for new field
      setSortField(field);
      setSortDirection('desc');
    }
    
    // Sort the entries
    const sorted = [...filteredEntries].sort((a, b) => {
      if (field === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      } else if (field === 'date') {
        return sortDirection === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime() 
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        // String comparison for other fields
        const aVal = (a[field as keyof FinancialEntry] || '').toString();
        const bVal = (b[field as keyof FinancialEntry] || '').toString();
        return sortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
    });
    
    setFilteredEntries(sorted);
  };
  
  // Export to Excel
  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(filteredEntries.map(entry => ({
      Type: entry.type,
      Date: entry.date,
      Category: entry.category,
      Description: entry.description,
      Amount: entry.amount,
      PaymentMethod: entry.paymentMethod || '',
      Notes: entry.notes || ''
    })));
    
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Financials');
    
    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `shivkara-financial-report-${date}.xlsx`;
    
    writeFile(workbook, filename);
  };
  
  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Shivkara Digitals - Financial Report', 14, 22);
    
    // Add date range
    doc.setFontSize(12);
    const date = new Date().toISOString().split('T')[0];
    doc.text(`Generated on: ${date} | Filter: ${timeFilter}`, 14, 30);
    
    // Add summary
    doc.text(`Total Income: ₹${summary.totalIncome.toLocaleString()}`, 14, 40);
    doc.text(`Total Expenses: ₹${summary.totalExpense.toLocaleString()}`, 14, 48);
    doc.text(`Net Balance: ₹${summary.netBalance.toLocaleString()}`, 14, 56);
    
    // Add table
    (doc as any).autoTable({
      startY: 65,
      head: [['Type', 'Date', 'Category', 'Description', 'Amount']],
      body: filteredEntries.map(entry => [
        entry.type.charAt(0).toUpperCase() + entry.type.slice(1),
        entry.date,
        entry.category,
        entry.description,
        `₹${entry.amount.toLocaleString()}`
      ]),
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: 'middle'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Save the PDF
    doc.save(`shivkara-financial-report-${date}.pdf`);
  };
  
  // Delete entry
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'financials', id));
      fetchFinancialEntries(); // Refresh list
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: ['Income', 'Expense', 'Net Balance'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [summary.totalIncome, summary.totalExpense, summary.netBalance],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          summary.netBalance >= 0 ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 159, 64, 0.6)'
        ],
        borderColor: [
          'rgb(75, 192, 192)',
          'rgb(255, 99, 132)',
          summary.netBalance >= 0 ? 'rgb(54, 162, 235)' : 'rgb(255, 159, 64)'
        ],
        borderWidth: 1,
      }
    ],
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `₹${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `₹${value.toLocaleString()}`;
          }
        }
      }
    }
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // If no permission
  if (!['admin', 'finance'].includes(userRole || '')) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-red-100 p-6 rounded-lg text-red-700">
          Access denied. You need admin or finance permissions.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Income & Expense Tracker</h1>
          <button 
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Add Entry
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-sm text-gray-500 font-medium">Total Income</h2>
                <p className="text-2xl font-bold text-green-600">₹{summary.totalIncome.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-sm text-gray-500 font-medium">Total Expenses</h2>
                <p className="text-2xl font-bold text-red-600">₹{summary.totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className={`${summary.netBalance >= 0 ? 'bg-blue-100' : 'bg-orange-100'} rounded-full p-3 mr-4`}>
                <DollarSign className={`w-6 h-6 ${summary.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <h2 className="text-sm text-gray-500 font-medium">Net Balance</h2>
                <p className={`text-2xl font-bold ${summary.netBalance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  ₹{summary.netBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters and Actions */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setTimeFilter('week')}
                className={`px-4 py-2 rounded-lg ${timeFilter === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors flex items-center gap-2 border`}
              >
                <Filter className="w-5 h-5" />
                Last Week
              </button>
              <button 
                onClick={() => setTimeFilter('month')}
                className={`px-4 py-2 rounded-lg ${timeFilter === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors flex items-center gap-2 border`}
              >
                Last Month
              </button>
              <button 
                onClick={() => setTimeFilter('year')}
                className={`px-4 py-2 rounded-lg ${timeFilter === 'year' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors flex items-center gap-2 border`}
              >
                Last Year
              </button>
              <button 
                onClick={() => setTimeFilter('all')}
                className={`px-4 py-2 rounded-lg ${timeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                } transition-colors flex items-center gap-2 border`}
              >
                All Time
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={exportToExcel}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border"
              >
                <Download className="w-5 h-5" />
                Excel
              </button>
              <button 
                onClick={exportToPDF}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 border"
              >
                <Download className="w-5 h-5" />
                PDF
              </button>
            </div>
          </div>
          
          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="font-bold text-lg mb-4 text-gray-900">Financial Summary</div>
            <div className="w-full h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
          
          {/* Search */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search entries by description or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </section>
        
        {/* Entries Table */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <div className="font-bold text-lg mb-6 text-gray-900">Entries</div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No entries found for the selected period.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      onClick={() => handleSort('type')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Type
                        {sortField === 'type' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('date')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === 'date' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('category')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Category
                        {sortField === 'category' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('description')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        Description
                        {sortField === 'description' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th
                      onClick={() => handleSort('amount')}
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-end">
                        Amount
                        {sortField === 'amount' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            entry.type === 'income'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entry.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {entry.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {entry.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                        <span
                          className={`${
                            entry.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {entry.type === 'income' ? '+' : '-'}₹{entry.amount.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => {
                              setEditingEntry(entry);
                              setShowForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      
      {/* Entry Form Modal */}
      {showForm && (
        <ExpenseForm
          onClose={() => {
            setShowForm(false);
            setEditingEntry(null);
          }}
          onSuccess={fetchFinancialEntries}
          initialData={editingEntry}
          isEditing={!!editingEntry}
        />
      )}
    </div>
  );
}
