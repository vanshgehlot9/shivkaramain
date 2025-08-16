'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DollarSign, Users, ShoppingCart, TrendingUp, Calendar, FileText, Activity, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface DashboardData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  activeProjects: number
  recentActivities: Activity[]
  monthlyStats: MonthlyStats
}

interface Activity {
  id: string
  type: 'order' | 'project' | 'customer' | 'expense'
  description: string
  timestamp: Date
  amount?: number
  status?: string
}

interface MonthlyStats {
  revenue: number
  orders: number
  expenses: number
  profit: number
}

export function AdminOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    activeProjects: 0,
    recentActivities: [],
    monthlyStats: {
      revenue: 0,
      orders: 0,
      expenses: 0,
      profit: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch orders data
        const ordersSnapshot = await getDocs(collection(db, 'orders'))
        const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]
        
        // Fetch expenses data
        const expensesSnapshot = await getDocs(collection(db, 'expenses'))
        const expenses = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]

        // Calculate totals
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0)
        const totalOrders = orders.length
        const totalCustomers = new Set(orders.map(order => order.customerEmail)).size
        const activeProjects = orders.filter(order => order.status === 'in-progress').length

        // Calculate monthly stats (current month)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        
        const monthlyOrders = orders.filter(order => {
          const orderDate = new Date(order.createdAt?.seconds * 1000 || order.createdAt)
          return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
        })

        const monthlyExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date?.seconds * 1000 || expense.date)
          return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
        })

        const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        const monthlyExpenseTotal = monthlyExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)

        // Generate recent activities
        const activities: Activity[] = [
          ...orders.slice(0, 3).map(order => ({
            id: order.id,
            type: 'order' as const,
            description: `New order from ${order.customerName}`,
            timestamp: new Date(order.createdAt?.seconds * 1000 || order.createdAt),
            amount: order.total,
            status: order.status
          })),
          ...expenses.slice(0, 2).map(expense => ({
            id: expense.id,
            type: 'expense' as const,
            description: `${expense.category} expense: ${expense.description}`,
            timestamp: new Date(expense.date?.seconds * 1000 || expense.date),
            amount: expense.amount
          }))
        ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 5)

        setDashboardData({
          totalRevenue,
          totalOrders,
          totalCustomers,
          activeProjects,
          recentActivities: activities,
          monthlyStats: {
            revenue: monthlyRevenue,
            orders: monthlyOrders.length,
            expenses: monthlyExpenseTotal,
            profit: monthlyRevenue - monthlyExpenseTotal
          }
        })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="h-4 w-4" />
      case 'project':
        return <FileText className="h-4 w-4" />
      case 'customer':
        return <Users className="h-4 w-4" />
      case 'expense':
        return <DollarSign className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Quick Actions
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</div>
              <p className="text-xs text-blue-200 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
              <p className="text-xs text-green-200 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalCustomers}</div>
              <p className="text-xs text-purple-200 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +15.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Active Projects</CardTitle>
              <FileText className="h-4 w-4 text-orange-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.activeProjects}</div>
              <p className="text-xs text-orange-200 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +5.7% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{formatCurrency(dashboardData.monthlyStats.revenue)}</div>
                  <div className="text-sm text-blue-500">Revenue</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.monthlyStats.orders}</div>
                  <div className="text-sm text-green-500">Orders</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{formatCurrency(dashboardData.monthlyStats.expenses)}</div>
                  <div className="text-sm text-red-500">Expenses</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{formatCurrency(dashboardData.monthlyStats.profit)}</div>
                  <div className="text-sm text-purple-500">Profit</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Order
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Record Expense
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.description}</p>
                      <p className="text-sm text-gray-500">{formatDate(activity.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className={`font-semibold ${activity.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                        {activity.type === 'expense' ? '-' : '+'}{formatCurrency(activity.amount)}
                      </p>
                    )}
                    {activity.status && (
                      <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                        {activity.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
