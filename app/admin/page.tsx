"use client";

import { useState, useEffect } from "react";
import { AdminPanel } from "../../components/AdminPanel";
import { LeadManagementDashboard } from "../../components/admin/LeadManagementDashboard";
import { UserRolesManager } from "../../components/admin/UserRolesManager";
import { AdminOverview } from "../../components/admin/AdminOverview";
import { ExpensesDashboard } from "../../components/admin/ExpensesDashboard";
import { OrdersDashboard } from "../../components/admin/OrdersDashboard";
import { BillingDashboard } from "../../components/admin/BillingDashboard";
import { AnalyticsDashboard } from "../../components/admin/AnalyticsDashboard";
import ReportsDashboard from "../../components/admin/ReportsDashboard";
import ProjectManagementDashboard from "../../components/admin/ProjectManagementDashboard";
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
  BarChart2,
  Briefcase,
  HardDrive,
  UserCog,
  FolderOpen,
  TrendingUp
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard"); // Default to dashboard view

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Shivkara Digitals - Admin Panel</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "leads"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="w-5 h-5" />
              Lead Management
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "expenses"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <DollarSign className="w-5 h-5" />
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "orders"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Clock className="w-5 h-5" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "billing"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <FileText className="w-5 h-5" />
              Invoices
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "reports"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart2 className="w-5 h-5" />
              Reports
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "projects"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Briefcase className="w-5 h-5" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "users"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <UserCog className="w-5 h-5" />
              Users
            </button>
            <button
              onClick={() => setActiveTab("website")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "website"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Home className="w-5 h-5" />
              Website
            </button>
            <button
              onClick={() => setActiveTab("backup")}
              className={`py-4 px-2 border-b-2 whitespace-nowrap font-medium text-sm flex items-center gap-2 ${
                activeTab === "backup"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <HardDrive className="w-5 h-5" />
              Backup
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6 max-w-7xl mx-auto">
        {activeTab === "dashboard" && <AdminOverview />}
        {activeTab === "leads" && <LeadManagementDashboard />}
        {activeTab === "website" && <AdminPanel />}
        {activeTab === "users" && <UserManagementDashboard />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
        {activeTab === "expenses" && <ExpensesDashboard />}
        {activeTab === "orders" && <OrdersDashboard />}
        {activeTab === "billing" && <BillingDashboard />}
        {activeTab === "reports" && <ReportsDashboard />}
        {activeTab === "projects" && <ProjectManagementDashboard />}
        
        {activeTab === "backup" && (
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-6">Data Backup & Recovery</h2>
            <p className="text-gray-500 mb-4">Secure your business data with automated backups.</p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-blue-700 text-sm">
              The Backup & Recovery system is coming soon. Check back later to manage data protection.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
