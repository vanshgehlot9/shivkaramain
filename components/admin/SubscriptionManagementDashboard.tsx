"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Plus,
  Eye,
  Pause,
  Play,
  Trash2,
  Download,
  RotateCcw,
  Mail,
  MessageSquare,
  Calendar,
  Globe,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { SubscriptionService, ClientService, AnalyticsService } from '../../lib/subscription-service';
import { SUBSCRIPTION_PLANS, getPlanById, formatPrice } from '../../lib/subscription-plans';
import type { Subscription, Client, AdminAnalytics } from '../../lib/subscription-types';

export function SubscriptionManagementDashboard() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subscriptionsData, clientsData, analyticsData] = await Promise.all([
        SubscriptionService.getSubscriptions(),
        ClientService.getAllClients(),
        AnalyticsService.getAdminAnalytics()
      ]);

      setSubscriptions(subscriptionsData);
      setClients(clientsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
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

  const handleStatusUpdate = async (subscriptionId: string, newStatus: Subscription['status']) => {
    try {
      await SubscriptionService.updateSubscriptionStatus(subscriptionId, newStatus);
      await loadData();
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getExpiryStatus = (subscription: Subscription) => {
    const endDate = subscription.endDate instanceof Date 
      ? subscription.endDate 
      : subscription.endDate.toDate();
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', days: Math.abs(daysUntilExpiry), color: 'text-red-600' };
    if (daysUntilExpiry <= 7) return { status: 'expiring', days: daysUntilExpiry, color: 'text-yellow-600' };
    return { status: 'active', days: daysUntilExpiry, color: 'text-green-600' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
          <p className="text-gray-600 mt-1">Manage client subscriptions, billing, and analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Subscription
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(analytics.totalRevenue)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Monthly: {formatPrice(analytics.monthlyRevenue)}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.activeSubscriptions}</p>
                    <p className="text-sm text-gray-500">
                      New: {analytics.newSignups} this month
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.expiringSoon}</p>
                    <p className="text-sm text-gray-500">Next 7 days</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Overdue</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.overdue}</p>
                    <p className="text-sm text-gray-500">
                      Churn: {analytics.churnRate.toFixed(1)}%
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle>Subscription Management</CardTitle>
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search subscriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-600">Domain</th>
                      <th className="text-left p-4 font-medium text-gray-600">Plan</th>
                      <th className="text-left p-4 font-medium text-gray-600">Status</th>
                      <th className="text-left p-4 font-medium text-gray-600">Expiry</th>
                      <th className="text-left p-4 font-medium text-gray-600">Revenue</th>
                      <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscriptions.map((subscription) => {
                      const plan = getPlanById(subscription.planId);
                      const expiryStatus = getExpiryStatus(subscription);
                      
                      return (
                        <tr key={subscription.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">{subscription.domain}</p>
                              <p className="text-sm text-gray-500">
                                {subscription.services.join(', ')}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium">{plan?.name || 'Unknown Plan'}</p>
                              <p className="text-sm text-gray-500">
                                {plan ? formatPrice(plan.price) : 'N/A'}/{subscription.plan}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={getStatusColor(subscription.status)}>
                              {subscription.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className={`font-medium ${expiryStatus.color}`}>
                                {expiryStatus.status === 'expired' ? 'Expired' : 
                                 expiryStatus.status === 'expiring' ? 'Expiring' : 'Active'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {expiryStatus.status === 'expired' 
                                  ? `${expiryStatus.days} days ago`
                                  : `${expiryStatus.days} days`}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium">
                              {plan ? formatPrice(plan.price) : 'N/A'}
                            </p>
                          </td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedSubscription(subscription)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Subscription Details</DialogTitle>
                                    <DialogDescription>
                                      Manage subscription for {subscription.domain}
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedSubscription && (
                                    <div className="space-y-6">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label>Domain</Label>
                                          <p className="text-sm text-gray-900">{selectedSubscription.domain}</p>
                                        </div>
                                        <div>
                                          <Label>Plan</Label>
                                          <p className="text-sm text-gray-900">
                                            {getPlanById(selectedSubscription.planId)?.name || 'Unknown'}
                                          </p>
                                        </div>
                                        <div>
                                          <Label>Status</Label>
                                          <Badge className={getStatusColor(selectedSubscription.status)}>
                                            {selectedSubscription.status}
                                          </Badge>
                                        </div>
                                        <div>
                                          <Label>Services</Label>
                                          <p className="text-sm text-gray-900">
                                            {selectedSubscription.services.join(', ')}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        {selectedSubscription.status === 'ACTIVE' && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleStatusUpdate(selectedSubscription.id, 'SUSPENDED')}
                                          >
                                            <Pause className="w-4 h-4 mr-2" />
                                            Suspend
                                          </Button>
                                        )}
                                        
                                        {selectedSubscription.status === 'SUSPENDED' && (
                                          <Button
                                            size="sm"
                                            onClick={() => handleStatusUpdate(selectedSubscription.id, 'ACTIVE')}
                                          >
                                            <Play className="w-4 h-4 mr-2" />
                                            Reactivate
                                          </Button>
                                        )}
                                        
                                        <Button size="sm" variant="outline">
                                          <Mail className="w-4 h-4 mr-2" />
                                          Send Reminder
                                        </Button>
                                        
                                        <Button size="sm" variant="outline">
                                          <Download className="w-4 h-4 mr-2" />
                                          Export
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              
                              {subscription.status === 'ACTIVE' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusUpdate(subscription.id, 'SUSPENDED')}
                                >
                                  <Pause className="w-4 h-4" />
                                </Button>
                              ) : subscription.status === 'SUSPENDED' ? (
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusUpdate(subscription.id, 'ACTIVE')}
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {filteredSubscriptions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No subscriptions found matching your criteria.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients">
          <Card>
            <CardHeader>
              <CardTitle>Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium text-gray-600">Client</th>
                      <th className="text-left p-4 font-medium text-gray-600">Domain</th>
                      <th className="text-left p-4 font-medium text-gray-600">Status</th>
                      <th className="text-left p-4 font-medium text-gray-600">Created</th>
                      <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900">{client.name}</p>
                            <p className="text-sm text-gray-500">{client.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-sm">{client.domain}</p>
                        </td>
                        <td className="p-4">
                          <Badge className={client.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {client.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-600">
                            {client.createdAt instanceof Date 
                              ? client.createdAt.toLocaleDateString()
                              : (client.createdAt as any).toDate().toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Revenue Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-semibold">{formatPrice(analytics?.totalRevenue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Revenue</span>
                    <span className="font-semibold">{formatPrice(analytics?.monthlyRevenue || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Revenue Per User</span>
                    <span className="font-semibold">{formatPrice(analytics?.averageRevenuePerUser || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New Signups (This Month)</span>
                    <span className="font-semibold">{analytics?.newSignups || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Churn Rate</span>
                    <span className="font-semibold">{analytics?.churnRate.toFixed(1) || 0}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Subscriptions</span>
                    <span className="font-semibold">{analytics?.activeSubscriptions || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Notification Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">Expiry Reminders</p>
                    <p className="text-sm text-yellow-700">
                      {analytics?.expiringSoon || 0} subscriptions expiring in the next 7 days
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reminders
                  </Button>
                </div>

                <div className="flex justify-between items-center p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Overdue Payments</p>
                    <p className="text-sm text-red-700">
                      {analytics?.overdue || 0} subscriptions are overdue
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Notices
                  </Button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-4">Automated Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">7-day expiry reminder</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment success notification</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Suspension warning</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
