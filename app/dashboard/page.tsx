"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar,
  CreditCard,
  Download,
  Settings,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  FileText,
  Globe,
  Zap,
  Headphones,
  LogOut
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';
import { SubscriptionService, ClientService, InvoiceService } from '../../lib/subscription-service';
import { getPlanById, formatPrice } from '../../lib/subscription-plans';
import type { Subscription, Client, Invoice } from '../../lib/subscription-types';

export default function DashboardPage() {
  const [user, loading, error] = useAuthState(auth);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      loadDashboardData();
    }
  }, [user, loading]);

  const loadDashboardData = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      // For demo purposes, we'll extract domain from email
      // In production, you'd have proper domain-user mapping
      const domain = user.email.split('@')[1] || 'demo.com';
      
      const [subscriptionData, clientData] = await Promise.all([
        SubscriptionService.getSubscriptionByDomain(domain),
        ClientService.getClientByDomain(domain)
      ]);

      setSubscription(subscriptionData);
      setClient(clientData);

      if (subscriptionData) {
        const invoiceData = await InvoiceService.getInvoicesBySubscription(subscriptionData.id);
        setInvoices(invoiceData);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-gray-100 text-gray-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNextBillingDate = () => {
    if (!subscription) return null;
    
    const endDate = subscription.endDate instanceof Date 
      ? subscription.endDate 
      : subscription.endDate.toDate();
    
    return endDate;
  };

  const getDaysUntilExpiry = () => {
    const nextBilling = getNextBillingDate();
    if (!nextBilling) return null;
    
    const today = new Date();
    const diffTime = nextBilling.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-gray-600 mb-6">You need to be signed in to access your dashboard.</p>
            <Button onClick={() => window.location.href = '/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = subscription ? getPlanById(subscription.planId) : null;
  const daysUntilExpiry = getDaysUntilExpiry();
  const nextBillingDate = getNextBillingDate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Client Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Alert */}
        {subscription && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {subscription.status === 'ACTIVE' && daysUntilExpiry && daysUntilExpiry <= 7 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-yellow-800">
                      Subscription Expiring Soon
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}. 
                      Renew now to avoid service interruption.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {subscription.status === 'EXPIRED' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Subscription Expired
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Your subscription has expired. Please renew to restore access to your services.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subscription Status</p>
                    <div className="flex items-center mt-2">
                      <Badge className={getStatusColor(subscription?.status || 'INACTIVE')}>
                        {subscription?.status || 'INACTIVE'}
                      </Badge>
                    </div>
                  </div>
                  {subscription?.status === 'ACTIVE' ? (
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Next Billing</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {nextBillingDate ? nextBillingDate.toLocaleDateString() : 'N/A'}
                    </p>
                    {daysUntilExpiry && (
                      <p className="text-sm text-gray-500">
                        in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Plan</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {plan?.name || 'No Plan'}
                    </p>
                    {plan && (
                      <p className="text-sm text-gray-500">
                        {formatPrice(plan.price)}/{plan.type}
                      </p>
                    )}
                  </div>
                  <Shield className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Website Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Domain</label>
                    <p className="text-lg font-mono">{client?.domain || subscription?.domain || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Services</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {subscription?.services.map((service) => (
                        <Badge key={service} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Plan Features</label>
                    <div className="space-y-2 mt-2">
                      {plan?.features.slice(0, 5).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-between" variant="outline">
                    Renew Subscription
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                  
                  <Button className="w-full justify-between" variant="outline">
                    Upgrade Plan
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                  
                  <Button className="w-full justify-between" variant="outline">
                    Contact Support
                    <Headphones className="w-4 h-4" />
                  </Button>
                  
                  <Button className="w-full justify-between" variant="outline">
                    Download Invoice
                    <Download className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Subscription Details</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Plan</dt>
                        <dd className="text-sm text-gray-900">{plan?.name || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Billing Cycle</dt>
                        <dd className="text-sm text-gray-900 capitalize">{subscription?.plan || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Amount</dt>
                        <dd className="text-sm text-gray-900">{plan ? formatPrice(plan.price) : 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Payment Method</dt>
                        <dd className="text-sm text-gray-900 capitalize">{subscription?.metadata.gateway || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Billing History</h3>
                    <p className="text-sm text-gray-600">Recent billing activity will appear here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Invoice History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div>
                          <p className="font-medium">Invoice #{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">
                            Due: {invoice.dueDate.toString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(invoice.amount)}</p>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No invoices available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Contact Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Name</dt>
                        <dd className="text-sm text-gray-900">{client?.name || user.displayName || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Email</dt>
                        <dd className="text-sm text-gray-900">{client?.email || user.email || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Phone</dt>
                        <dd className="text-sm text-gray-900">{client?.phone || 'N/A'}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Address</dt>
                        <dd className="text-sm text-gray-900">{client?.address || 'N/A'}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <Button variant="outline">
                      Update Information
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
