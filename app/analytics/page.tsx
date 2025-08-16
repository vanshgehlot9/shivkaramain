"use client";
import React, { useState, useEffect } from "react";
import { BarChart3, Users, Briefcase, DollarSign, Filter, RefreshCcw, Calendar } from "lucide-react";
import { AnalyticsCharts } from "../../components/analytics/AnalyticsCharts";
import { collection, query, where, getDocs, Timestamp, orderBy, limit, count } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useUserRole } from "../../hooks/useUserRole";
import { Spinner } from "../../components/ui/spinner";

export default function AnalyticsOverview() {
  const [stats, setStats] = useState({
    totalOrders: {
      today: 0,
      week: 0,
      month: 0
    },
    totalClients: 0,
    activeProjects: 0,
    totalEarnings: 0
  });
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("month");
  const [isLoading, setIsLoading] = useState(true);
  const { userRole, isLoading: roleLoading } = useUserRole();
  
  // Check if user has access to this page
  useEffect(() => {
    // Redirect if not admin or finance role
    if (!roleLoading && userRole && !['admin', 'finance'].includes(userRole)) {
      window.location.href = "/admin";
    }
  }, [userRole, roleLoading]);

  async function fetchAnalyticsData() {
    try {
      setIsLoading(true);
      // Get date ranges
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - 7);
      const monthStart = new Date(now);
      monthStart.setMonth(now.getMonth() - 1);
      // Fetch today's orders
      const todayOrdersQuery = query(
        collection(db, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(todayStart))
      );
      const todayOrdersSnapshot = await getDocs(todayOrdersQuery);
      const todayOrders = todayOrdersSnapshot.size;
      // Fetch week's orders
      const weekOrdersQuery = query(
        collection(db, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(weekStart))
      );
      const weekOrdersSnapshot = await getDocs(weekOrdersQuery);
      const weekOrders = weekOrdersSnapshot.size;
      // Fetch month's orders
      const monthOrdersQuery = query(
        collection(db, "orders"),
        where("createdAt", ">=", Timestamp.fromDate(monthStart))
      );
      const monthOrdersSnapshot = await getDocs(monthOrdersQuery);
      const monthOrders = monthOrdersSnapshot.size;
      // Fetch unique clients
      const clientsQuery = query(
        collection(db, "clients")
      );
      const clientsSnapshot = await getDocs(clientsQuery);
      const totalClients = clientsSnapshot.size;
      // Fetch active projects
      const activeProjectsQuery = query(
        collection(db, "projects"),
        where("status", "in", ["active", "in-progress"])
      );
      const activeProjectsSnapshot = await getDocs(activeProjectsQuery);
      const activeProjects = activeProjectsSnapshot.size;
      // Fetch total earnings
      const earningsQuery = query(
        collection(db, "orders"),
        where("status", "==", "completed")
      );
      const earningsSnapshot = await getDocs(earningsQuery);
      let totalEarnings = 0;
      earningsSnapshot.forEach(doc => {
        const data = doc.data();
        totalEarnings += parseFloat(data.amount || 0);
      });
      setStats({
        totalOrders: {
          today: todayOrders,
          week: weekOrders,
          month: monthOrders,
        },
        totalClients,
        activeProjects,
        totalEarnings,
      });
    } catch (err) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 pb-12">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Overview & Analytics</h1>
          <div className="flex gap-2">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCcw className="w-5 h-5" />
              Refresh
            </button>
            <button 
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Date Range
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-6 mt-8">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-blue-50 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
              <h2 className="text-lg font-semibold text-gray-700">Total Orders</h2>
              <div className="mt-2 mb-3">
                <p className="text-3xl font-bold text-blue-600">
                  {isLoading ? "--" : stats.totalOrders[timeFilter]}
                </p>
              </div>
              <div className="flex space-x-2 text-xs">
                <button 
                  className={`px-2 py-1 rounded ${timeFilter === 'today' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100'}`}
                  onClick={() => setTimeFilter('today')}
                >
                  Today ({isLoading ? "-" : stats.totalOrders.today})
                </button>
                <button 
                  className={`px-2 py-1 rounded ${timeFilter === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100'}`}
                  onClick={() => setTimeFilter('week')}
                >
                  Week ({isLoading ? "-" : stats.totalOrders.week})
                </button>
                <button 
                  className={`px-2 py-1 rounded ${timeFilter === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:bg-gray-100'}`}
                  onClick={() => setTimeFilter('month')}
                >
                  Month ({isLoading ? "-" : stats.totalOrders.month})
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-pink-50 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <Users className="w-8 h-8 text-pink-500 mb-2" />
              <h2 className="text-lg font-semibold text-gray-700">Total Clients</h2>
              <p className="text-3xl font-bold text-pink-600">
                {isLoading ? "--" : stats.totalClients}
              </p>
              <span className="text-xs text-gray-400">All Time</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-purple-50 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <Briefcase className="w-8 h-8 text-purple-500 mb-2" />
              <h2 className="text-lg font-semibold text-gray-700">Active Projects</h2>
              <p className="text-3xl font-bold text-purple-600">
                {isLoading ? "--" : stats.activeProjects}
              </p>
              <span className="text-xs text-gray-400">Current</span>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-green-50 to-transparent opacity-50"></div>
            <div className="relative z-10">
              <DollarSign className="w-8 h-8 text-green-500 mb-2" />
              <h2 className="text-lg font-semibold text-gray-700">Total Earnings</h2>
              <p className="text-3xl font-bold text-green-600">
                {isLoading ? "--" : `₹${stats.totalEarnings.toLocaleString()}`}
              </p>
              <span className="text-xs text-gray-400">All Time</span>
            </div>
          </div>
        </section>
        
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-6">KPI Visualizations</h3>
          <AnalyticsCharts />
        </section>
      </main>
    </div>
  );
}