"use client";

import { useState, useEffect } from "react";
import { AdminPanel } from "../../components/AdminPanel";
import { LeadManagementDashboard } from "../../components/admin/LeadManagementDashboard";
import { UserRolesManager } from "../../components/admin/UserRolesManager";
import { AdminOverview } from "../../components/admin/AdminOverview";
import { ExpensesDashboard } from "../../components/admin/ExpensesDashboard";
import { AnalyticsDashboard } from "../../components/admin/AnalyticsDashboard";
import { SubscriptionManagementDashboard } from "../../components/admin/SubscriptionManagementDashboard";
import { WebsiteManagementDashboard } from "../../components/admin/WebsiteManagementDashboard";
import ReportsDashboard from "../../components/admin/ReportsDashboard";
import UserManagementDashboard from "../../components/admin/UserManagementDashboard";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Users, 
  BarChart3, 
  Settings, 
  Home,
  DollarSign,
  Clock,
  FileText,
  Package,
  BarChart2,
  HardDrive,
  UserCog,
  TrendingUp,
  CreditCard
} from "lucide-react";
import { NewEnhancedOrdersDashboard } from "@/components/admin/NewEnhancedOrdersDashboard";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to dashboard view
  const [sidebarOpen, setSidebarOpen] = useState(false); // Responsive sidebar state

  // Simple password authentication (in production, use proper auth)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "shivkara"; // Fallback to hardcoded if env var not available

  useEffect(() => {
    // Check if already authenticated in this session
    const isAuth = sessionStorage.getItem("adminAuth");
    if (isAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      setError("");
    } else {
      setError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    setPassword("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600">Enter password to access the admin panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter admin password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Responsive sidebar state

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col sm:flex-row relative">
      {/* Mobile Top Bar */}
      <div className="sm:hidden flex items-center justify-between bg-gradient-to-br from-blue-600 to-purple-700 text-white px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Home className="w-7 h-7" />
          <span className="text-lg font-bold tracking-wide">Shivkara Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar (desktop) */}
      <aside className={`hidden sm:flex w-64 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex-col py-8 px-4 shadow-xl min-h-screen sm:sticky sm:top-0 z-20`}>
        <div className="mb-8 flex items-center gap-3">
          <Home className="w-8 h-8" />
          <span className="text-xl font-bold tracking-wide">Shivkara Admin</span>
        </div>
        <nav className="flex flex-col gap-2">
          <button onClick={() => setActiveTab("dashboard")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "dashboard" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <BarChart3 className="w-5 h-5" /> Overview
          </button>
          <button onClick={() => setActiveTab("leads")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "leads" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <Users className="w-5 h-5" /> Leads
          </button>
          <button onClick={() => setActiveTab("analytics")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "analytics" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <TrendingUp className="w-5 h-5" /> Analytics
          </button>
          <button onClick={() => setActiveTab("expenses")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "expenses" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <DollarSign className="w-5 h-5" /> Expenses
          </button>
          <button onClick={() => setActiveTab("orders")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "orders" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <Package className="w-5 h-5" /> Orders
          </button>
          <button onClick={() => setActiveTab("subscriptions")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "subscriptions" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <CreditCard className="w-5 h-5" /> Subscriptions
          </button>
          <button onClick={() => setActiveTab("websites")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "websites" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <Package className="w-5 h-5" /> Websites
          </button>
          <button onClick={() => setActiveTab("reports")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "reports" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <BarChart2 className="w-5 h-5" /> Reports
          </button>
          <button onClick={() => setActiveTab("users")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "users" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <UserCog className="w-5 h-5" /> Users
          </button>
          <button onClick={() => setActiveTab("website")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "website" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <Settings className="w-5 h-5" /> Website
          </button>
          <button onClick={() => setActiveTab("backup")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "backup" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
            <HardDrive className="w-5 h-5" /> Backup
          </button>
        </nav>
        <div className="mt-auto pt-8">
          <button onClick={handleLogout} className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-base font-semibold">Logout</button>
        </div>
      </aside>

      {/* Sidebar Drawer (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="bg-black bg-opacity-40 w-full h-full" onClick={() => setSidebarOpen(false)}></div>
          <aside className="w-64 bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col py-8 px-4 shadow-xl h-full overflow-y-auto z-50">
            <div className="mb-8 flex items-center gap-3">
              <Home className="w-8 h-8" />
              <span className="text-xl font-bold tracking-wide">Shivkara Admin</span>
            </div>
            <nav className="flex flex-col gap-2">
              <button onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "dashboard" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <BarChart3 className="w-5 h-5" /> Overview
              </button>
              <button onClick={() => { setActiveTab("leads"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "leads" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <Users className="w-5 h-5" /> Leads
              </button>
              <button onClick={() => { setActiveTab("analytics"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "analytics" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <TrendingUp className="w-5 h-5" /> Analytics
              </button>
              <button onClick={() => { setActiveTab("expenses"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "expenses" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <DollarSign className="w-5 h-5" /> Expenses
              </button>
              <button onClick={() => { setActiveTab("orders"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "orders" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <Package className="w-5 h-5" /> Orders
              </button>
              <button onClick={() => { setActiveTab("subscriptions"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "subscriptions" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <CreditCard className="w-5 h-5" /> Subscriptions
              </button>
              <button onClick={() => { setActiveTab("websites"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "websites" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <Package className="w-5 h-5" /> Websites
              </button>
              <button onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "reports" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <BarChart2 className="w-5 h-5" /> Reports
              </button>
              <button onClick={() => { setActiveTab("users"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "users" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <UserCog className="w-5 h-5" /> Users
              </button>
              <button onClick={() => { setActiveTab("website"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "website" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <Settings className="w-5 h-5" /> Website
              </button>
              <button onClick={() => { setActiveTab("backup"); setSidebarOpen(false); }} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-base ${activeTab === "backup" ? "bg-white bg-opacity-10 shadow-lg" : "hover:bg-white hover:bg-opacity-10"}`}>
                <HardDrive className="w-5 h-5" /> Backup
              </button>
            </nav>
            <div className="mt-auto pt-8">
              <button onClick={() => { handleLogout(); setSidebarOpen(false); }} className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-base font-semibold">Logout</button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <span className="text-gray-500 text-sm">Welcome, Admin</span>
        </div>
        {activeTab === "dashboard" && <AdminOverview />}
        {activeTab === "leads" && <LeadManagementDashboard />}
        {activeTab === "website" && <AdminPanel />}
        {activeTab === "websites" && <WebsiteManagementDashboard />}
        {activeTab === "users" && <UserManagementDashboard />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
        {activeTab === "expenses" && <ExpensesDashboard />}
        {activeTab === "orders" && <NewEnhancedOrdersDashboard />}
        {activeTab === "subscriptions" && <SubscriptionManagementDashboard />}
        {activeTab === "reports" && <ReportsDashboard />}
        {activeTab === "backup" && (
          <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Data Backup & Recovery</h2>
            <p className="text-gray-500 mb-4 text-sm sm:text-base">Secure your business data with automated backups.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700 text-sm">
              The Backup & Recovery system is coming soon. Check back later to manage data protection.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
