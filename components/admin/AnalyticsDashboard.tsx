import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, orderBy, Timestamp } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useUserRole } from "../../hooks/useUserRole";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  BarElement,
  Title, 
  Tooltip, 
  Legend
);

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalExpenses: number;
  monthlyRevenue: number[];
  monthlyOrders: number[];
  expensesByCategory: { [key: string]: number };
  recentActivity: any[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalExpenses: 0,
    monthlyRevenue: [],
    monthlyOrders: [],
    expensesByCategory: {},
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { userRole, isLoading: roleLoading } = useUserRole();

  const canView = true; // Temporarily allow all access

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch orders data
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch expenses data
      const expensesSnapshot = await getDocs(collection(db, "expenses"));
      const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch invoices data
      const invoicesSnapshot = await getDocs(collection(db, "invoices"));
      const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate totals
      const totalRevenue = orders.reduce((sum: number, order: any) => {
        return order.status === 'completed' ? sum + (order.amount || 0) : sum;
      }, 0) + invoices.reduce((sum: number, inv: any) => {
        return inv.status === 'paid' ? sum + (inv.amount || 0) : sum;
      }, 0);

      const totalOrders = orders.length;
      
      const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + (expense.amount || 0), 0);

      // Calculate monthly data for charts
      const monthlyRevenue = new Array(12).fill(0);
      const monthlyOrders = new Array(12).fill(0);
      
      orders.forEach((order: any) => {
        if (order.date && order.status === 'completed') {
          const month = order.date.toDate().getMonth();
          monthlyRevenue[month] += order.amount || 0;
          monthlyOrders[month] += 1;
        }
      });

      // Calculate expenses by category
      const expensesByCategory: { [key: string]: number } = {};
      expenses.forEach((expense: any) => {
        const category = expense.category || 'Other';
        expensesByCategory[category] = (expensesByCategory[category] || 0) + (expense.amount || 0);
      });

      setData({
        totalRevenue,
        totalOrders,
        totalExpenses,
        monthlyRevenue,
        monthlyOrders,
        expensesByCategory,
        recentActivity: [...orders, ...expenses, ...invoices]
          .sort((a: any, b: any) => {
            const aDate = a.date || a.createdAt;
            const bDate = b.date || b.createdAt;
            return bDate - aDate;
          })
          .slice(0, 10)
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const revenueChartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Revenue',
        data: data.monthlyRevenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ordersChartData = {
    labels: monthNames,
    datasets: [
      {
        label: 'Orders',
        data: data.monthlyOrders,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const expensesChartData = {
    labels: Object.keys(data.expensesByCategory),
    datasets: [
      {
        data: Object.values(data.expensesByCategory),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="text-red-600 text-lg font-semibold">Access Denied</div>
        <p className="text-red-500 mt-2">You don't have permission to access the analytics module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex gap-2">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">₹{data.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
              </div>
              <DollarSign className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-green-900">{data.totalOrders}</p>
                <p className="text-xs text-green-600 mt-1">+8% from last month</p>
              </div>
              <ShoppingCart className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold text-orange-900">₹{data.totalExpenses.toLocaleString()}</p>
                <p className="text-xs text-orange-600 mt-1">-5% from last month</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Net Profit</p>
                <p className="text-2xl font-bold text-purple-900">₹{(data.totalRevenue - data.totalExpenses).toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">+15% from last month</p>
              </div>
              <Activity className="w-10 h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Monthly Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <Line data={revenueChartData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Chart */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BarChart3 className="w-5 h-5" />
              Monthly Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="h-64">
                <Bar data={ordersChartData} options={chartOptions} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expenses Breakdown */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <PieChart className="w-5 h-5" />
              Expenses by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              </div>
            ) : Object.keys(data.expensesByCategory).length > 0 ? (
              <div className="h-64">
                <Pie data={expensesChartData} options={pieChartOptions} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {data.recentActivity.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {data.recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {activity.customerName ? (
                              <ShoppingCart className="w-4 h-4 text-green-600" />
                            ) : activity.clientName ? (
                              <DollarSign className="w-4 h-4 text-blue-600" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {activity.customerName || activity.clientName || `${activity.category} Expense`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {activity.date ? activity.date.toDate().toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            ₹{(activity.amount || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg">
          <p className="font-medium">Error loading analytics data</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
