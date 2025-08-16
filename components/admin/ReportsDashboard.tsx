'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { 
  FileText, 
  Download, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Calendar as CalendarIcon,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ReportData {
  revenue: {
    total: number
    monthly: { month: string; amount: number }[]
    growth: number
  }
  orders: {
    total: number
    status: { name: string; count: number; color: string }[]
    monthly: { month: string; count: number }[]
  }
  expenses: {
    total: number
    categories: { name: string; amount: number; color: string }[]
    monthly: { month: string; amount: number }[]
  }
  customers: {
    total: number
    new: number
    retention: number
  }
}

export default function ReportsDashboard() {
  const [reportData, setReportData] = useState<ReportData>({
    revenue: { total: 0, monthly: [], growth: 0 },
    orders: { total: 0, status: [], monthly: [] },
    expenses: { total: 0, categories: [], monthly: [] },
    customers: { total: 0, new: 0, retention: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('last-12-months')
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1),
    to: new Date()
  })

  useEffect(() => {
    fetchReportData()
  }, [selectedPeriod, dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)

      // Fetch all data
      const [ordersSnapshot, expensesSnapshot] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'expenses'))
      ])

      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(doc.data().createdAt)
      })) as any[]

      const expenses = expensesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(doc.data().date)
      })) as any[]

      // Filter by date range
      const filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt)
        return (!dateRange.from || orderDate >= dateRange.from) && 
               (!dateRange.to || orderDate <= dateRange.to)
      })

      const filteredExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date)
        return (!dateRange.from || expenseDate >= dateRange.from) && 
               (!dateRange.to || expenseDate <= dateRange.to)
      })

      // Generate monthly data
      const months = []
      const currentDate = new Date(dateRange.from || new Date())
      const endDate = new Date(dateRange.to || new Date())
      
      while (currentDate <= endDate) {
        months.push({
          month: format(currentDate, 'MMM yyyy'),
          monthKey: format(currentDate, 'yyyy-MM')
        })
        currentDate.setMonth(currentDate.getMonth() + 1)
      }

      // Revenue data
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      const monthlyRevenue = months.map(({ month, monthKey }) => ({
        month,
        amount: filteredOrders
          .filter(order => format(new Date(order.createdAt), 'yyyy-MM') === monthKey)
          .reduce((sum, order) => sum + (order.total || 0), 0)
      }))

      // Orders data
      const orderStatusData = [
        { name: 'Completed', count: filteredOrders.filter(o => o.status === 'completed').length, color: '#10B981' },
        { name: 'In Progress', count: filteredOrders.filter(o => o.status === 'in-progress').length, color: '#F59E0B' },
        { name: 'Pending', count: filteredOrders.filter(o => o.status === 'pending').length, color: '#EF4444' },
        { name: 'Cancelled', count: filteredOrders.filter(o => o.status === 'cancelled').length, color: '#6B7280' }
      ]

      const monthlyOrders = months.map(({ month, monthKey }) => ({
        month,
        count: filteredOrders.filter(order => format(new Date(order.createdAt), 'yyyy-MM') === monthKey).length
      }))

      // Expenses data
      const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
      const expenseCategories = ['Office Supplies', 'Marketing', 'Travel', 'Equipment', 'Software', 'Other']
      const categoryData = expenseCategories.map((category, index) => ({
        name: category,
        amount: filteredExpenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + (expense.amount || 0), 0),
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6B7280'][index]
      }))

      const monthlyExpenses = months.map(({ month, monthKey }) => ({
        month,
        amount: filteredExpenses
          .filter(expense => format(new Date(expense.date), 'yyyy-MM') === monthKey)
          .reduce((sum, expense) => sum + (expense.amount || 0), 0)
      }))

      // Customer data
      const uniqueCustomers = new Set(filteredOrders.map(order => order.customerEmail))
      const totalCustomers = uniqueCustomers.size

      setReportData({
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
          growth: 12.5 // Mock growth rate
        },
        orders: {
          total: filteredOrders.length,
          status: orderStatusData,
          monthly: monthlyOrders
        },
        expenses: {
          total: totalExpenses,
          categories: categoryData,
          monthly: monthlyExpenses
        },
        customers: {
          total: totalCustomers,
          new: Math.floor(totalCustomers * 0.3), // Mock new customers
          retention: 85 // Mock retention rate
        }
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateReport = () => {
    // Create CSV data
    const csvData = [
      ['Report Type', selectedReport],
      ['Period', selectedPeriod],
      ['Generated', new Date().toLocaleDateString()],
      [''],
      ['Revenue Summary'],
      ['Total Revenue', `₹${reportData.revenue.total.toLocaleString()}`],
      ['Growth Rate', `${reportData.revenue.growth}%`],
      [''],
      ['Orders Summary'],
      ['Total Orders', reportData.orders.total.toString()],
      ...reportData.orders.status.map(status => [status.name, status.count.toString()]),
      [''],
      ['Expenses Summary'],
      ['Total Expenses', `₹${reportData.expenses.total.toLocaleString()}`],
      ...reportData.expenses.categories.map(cat => [cat.name, `₹${cat.amount.toLocaleString()}`]),
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Business Reports
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive analytics and business insights</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={generateReport} className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={selectedReport} onValueChange={setSelectedReport}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview Report</SelectItem>
              <SelectItem value="revenue">Revenue Report</SelectItem>
              <SelectItem value="expenses">Expenses Report</SelectItem>
              <SelectItem value="orders">Orders Report</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-12-months">Last 12 Months</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">{formatCurrency(reportData.revenue.total)}</p>
                  <p className="text-blue-200 text-xs flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{reportData.revenue.growth}% growth
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold">{reportData.orders.total}</p>
                  <p className="text-green-200 text-xs">
                    {reportData.orders.status.find(s => s.name === 'Completed')?.count || 0} completed
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Customers</p>
                  <p className="text-2xl font-bold">{reportData.customers.total}</p>
                  <p className="text-purple-200 text-xs">
                    {reportData.customers.new} new customers
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold">{formatCurrency(reportData.expenses.total)}</p>
                  <p className="text-red-200 text-xs">
                    Profit: {formatCurrency(reportData.revenue.total - reportData.expenses.total)}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Revenue Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Line
                data={{
                  labels: reportData.revenue.monthly.map(item => item.month),
                  datasets: [
                    {
                      label: 'Revenue',
                      data: reportData.revenue.monthly.map(item => item.amount),
                      borderColor: '#3B82F6',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Order Status Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Order Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Pie
                data={{
                  labels: reportData.orders.status.map(item => item.name),
                  datasets: [
                    {
                      data: reportData.orders.status.map(item => item.count),
                      backgroundColor: reportData.orders.status.map(item => item.color),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Expense Categories */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Expense Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: reportData.expenses.categories.map(item => item.name),
                  datasets: [
                    {
                      label: 'Amount',
                      data: reportData.expenses.categories.map(item => item.amount),
                      backgroundColor: reportData.expenses.categories.map(item => item.color),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Monthly Comparison */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Revenue vs Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Bar
                data={{
                  labels: reportData.revenue.monthly.map(item => item.month),
                  datasets: [
                    {
                      label: 'Revenue',
                      data: reportData.revenue.monthly.map(item => item.amount),
                      backgroundColor: '#10B981',
                    },
                    {
                      label: 'Expenses',
                      data: reportData.expenses.monthly.map(item => item.amount),
                      backgroundColor: '#EF4444',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: (value) => `₹${value.toLocaleString()}`,
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
