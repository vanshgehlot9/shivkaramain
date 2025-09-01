"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe,
  Power,
  PowerOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Mail,
  Calendar,
  CreditCard,
  DollarSign,
  Users,
  TrendingUp,
  Settings,
  Shield,
  Activity,
  Zap,
  Ban,
  RotateCcw,
  Plus
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';

interface Website {
  id: string;
  domain: string;
  clientName: string;
  clientEmail: string;
  planId: string;
  planName: string;
  status: 'active' | 'suspended' | 'pending_payment' | 'disabled';
  createdAt: Date;
  lastPaymentDate: Date;
  nextPaymentDue: Date;
  totalRevenue: number;
  monthlyPrice: number;
  daysOverdue: number;
  autoSuspendEnabled: boolean;
  suspensionReason?: string;
  lastAccessDate: Date;
  totalVisits: number;
  storageUsed: number; // in MB
  bandwidthUsed: number; // in GB
}

export function WebsiteManagementDashboard() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [bulkAction, setBulkAction] = useState<string>('');
  const [selectedWebsites, setSelectedWebsites] = useState<string[]>([]);

  // Analytics state
  const [analytics, setAnalytics] = useState({
    totalWebsites: 0,
    activeWebsites: 0,
    suspendedWebsites: 0,
    overduePayments: 0,
    monthlyRevenue: 0,
    churnRate: 0
  });

  useEffect(() => {
    loadWebsites();
    loadAnalytics();
  }, []);

  const loadWebsites = async () => {
    setIsLoading(true);
    try {
      // Mock data - replace with actual API call
      const mockWebsites: Website[] = [
        {
          id: '1',
          domain: 'example1.com',
          clientName: 'John Doe',
          clientEmail: 'john@example1.com',
          planId: 'monthly-plan',
          planName: 'Monthly Plan',
          status: 'active',
          createdAt: new Date('2024-01-15'),
          lastPaymentDate: new Date('2024-12-01'),
          nextPaymentDue: new Date('2025-01-01'),
          totalRevenue: 7500,
          monthlyPrice: 2375,
          daysOverdue: 0,
          autoSuspendEnabled: true,
          lastAccessDate: new Date('2024-12-28'),
          totalVisits: 15420,
          storageUsed: 245,
          bandwidthUsed: 12.5
        },
        {
          id: '2',
          domain: 'example2.com',
          clientName: 'Jane Smith',
          clientEmail: 'jane@example2.com',
          planId: 'yearly-plan',
          planName: 'Yearly Plan',
          status: 'pending_payment',
          createdAt: new Date('2024-02-10'),
          lastPaymentDate: new Date('2024-11-10'),
          nextPaymentDue: new Date('2024-12-10'),
          totalRevenue: 18999,
          monthlyPrice: 18999,
          daysOverdue: 22,
          autoSuspendEnabled: true,
          lastAccessDate: new Date('2024-12-20'),
          totalVisits: 28750,
          storageUsed: 890,
          bandwidthUsed: 45.2
        },
        {
          id: '3',
          domain: 'example3.com',
          clientName: 'Mike Johnson',
          clientEmail: 'mike@example3.com',
          planId: 'monthly-plan',
          planName: 'Monthly Plan',
          status: 'suspended',
          createdAt: new Date('2024-03-20'),
          lastPaymentDate: new Date('2024-10-20'),
          nextPaymentDue: new Date('2024-11-20'),
          totalRevenue: 9500,
          monthlyPrice: 2375,
          daysOverdue: 42,
          autoSuspendEnabled: true,
          suspensionReason: 'Payment overdue by 42 days',
          lastAccessDate: new Date('2024-11-15'),
          totalVisits: 8920,
          storageUsed: 156,
          bandwidthUsed: 8.9
        }
      ];
      
      setWebsites(mockWebsites);
    } catch (error) {
      console.error('Error loading websites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async () => {
    // Mock analytics - replace with actual API call
    setAnalytics({
      totalWebsites: 125,
      activeWebsites: 98,
      suspendedWebsites: 15,
      overduePayments: 12,
      monthlyRevenue: 285000,
      churnRate: 3.2
    });
  };

  const handleWebsiteAction = async (websiteId: string, action: 'suspend' | 'activate' | 'disable' | 'delete', reason?: string) => {
    try {
      // API call to perform action
      console.log(`Performing ${action} on website ${websiteId}`, reason ? `Reason: ${reason}` : '');
      
      // Update local state
      setWebsites(prev => prev.map(website => 
        website.id === websiteId 
          ? { 
              ...website, 
              status: action === 'suspend' ? 'suspended' : 
                      action === 'activate' ? 'active' : 
                      action === 'disable' ? 'disabled' : website.status,
              suspensionReason: reason
            }
          : website
      ));
      
      // Show success message
      alert(`Website ${action}ed successfully!`);
    } catch (error) {
      console.error(`Error ${action}ing website:`, error);
      alert(`Error ${action}ing website`);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedWebsites.length === 0) return;
    
    const action = bulkAction;
    const reason = `Bulk action: ${action}`;
    
    for (const websiteId of selectedWebsites) {
      await handleWebsiteAction(websiteId, action as any, reason);
    }
    
    setSelectedWebsites([]);
    setBulkAction('');
  };

  const sendPaymentReminder = async (websiteId: string) => {
    try {
      // API call to send payment reminder
      console.log(`Sending payment reminder for website ${websiteId}`);
      alert('Payment reminder sent successfully!');
    } catch (error) {
      console.error('Error sending payment reminder:', error);
      alert('Error sending payment reminder');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'disabled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'suspended': return <Ban className="w-4 h-4" />;
      case 'pending_payment': return <Clock className="w-4 h-4" />;
      case 'disabled': return <PowerOff className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || website.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Website Management</h1>
          <p className="text-gray-600">Monitor and manage client websites with payment enforcement</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Website
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Websites</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalWebsites}</p>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{analytics.activeWebsites}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-red-600">{analytics.suspendedWebsites}</p>
              </div>
              <Ban className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-yellow-600">{analytics.overduePayments}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">₹{analytics.monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.churnRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search websites..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending_payment">Pending Payment</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedWebsites.length > 0 && (
              <div className="flex gap-2 items-center">
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bulk actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suspend">Suspend Websites</SelectItem>
                    <SelectItem value="activate">Activate Websites</SelectItem>
                    <SelectItem value="disable">Disable Websites</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleBulkAction} variant="outline">
                  Apply to {selectedWebsites.length} websites
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Websites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Websites ({filteredWebsites.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedWebsites(filteredWebsites.map(w => w.id));
                          } else {
                            setSelectedWebsites([]);
                          }
                        }}
                        checked={selectedWebsites.length === filteredWebsites.length && filteredWebsites.length > 0}
                      />
                    </th>
                    <th className="text-left p-4">Website</th>
                    <th className="text-left p-4">Client</th>
                    <th className="text-left p-4">Plan</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Payment Due</th>
                    <th className="text-left p-4">Overdue Days</th>
                    <th className="text-left p-4">Revenue</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWebsites.map((website) => (
                    <tr key={website.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedWebsites.includes(website.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWebsites(prev => [...prev, website.id]);
                            } else {
                              setSelectedWebsites(prev => prev.filter(id => id !== website.id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{website.domain}</p>
                            <p className="text-sm text-gray-500">Created {website.createdAt.toLocaleDateString()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{website.clientName}</p>
                          <p className="text-sm text-gray-500">{website.clientEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{website.planName}</p>
                          <p className="text-sm text-gray-500">₹{website.monthlyPrice.toLocaleString()}/month</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(website.status)} flex items-center gap-1`}>
                          {getStatusIcon(website.status)}
                          {website.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-gray-900">{website.nextPaymentDue.toLocaleDateString()}</p>
                          {website.daysOverdue > 0 && (
                            <p className="text-xs text-red-600">Overdue</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {website.daysOverdue > 0 ? (
                          <Badge className="bg-red-100 text-red-800">
                            {website.daysOverdue} days
                          </Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-gray-900">₹{website.totalRevenue.toLocaleString()}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedWebsite(website)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Website Details - {website.domain}</DialogTitle>
                              </DialogHeader>
                              <WebsiteDetailsModal website={website} onAction={handleWebsiteAction} onSendReminder={sendPaymentReminder} />
                            </DialogContent>
                          </Dialog>

                          {website.status === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWebsiteAction(website.id, 'suspend', 'Manual suspension by admin')}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Ban className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleWebsiteAction(website.id, 'activate')}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                          )}

                          {website.daysOverdue > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendPaymentReminder(website.id)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
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

// Website Details Modal Component
function WebsiteDetailsModal({ 
  website, 
  onAction, 
  onSendReminder 
}: { 
  website: Website; 
  onAction: (id: string, action: 'suspend' | 'activate' | 'disable' | 'delete', reason?: string) => void;
  onSendReminder: (id: string) => void;
}) {
  const [suspensionReason, setSuspensionReason] = useState('');

  return (
    <div className="space-y-6">
      {/* Website Status Alert */}
      {website.status === 'pending_payment' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            Payment is {website.daysOverdue} days overdue. Consider suspending the website or sending a payment reminder.
          </AlertDescription>
        </Alert>
      )}

      {website.status === 'suspended' && (
        <Alert className="border-red-200 bg-red-50">
          <Ban className="w-4 h-4" />
          <AlertDescription>
            Website is currently suspended. {website.suspensionReason && `Reason: ${website.suspensionReason}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Website Info Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Domain</Label>
            <p className="text-sm text-gray-900">{website.domain}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Client Name</Label>
            <p className="text-sm text-gray-900">{website.clientName}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Email</Label>
            <p className="text-sm text-gray-900">{website.clientEmail}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Plan</Label>
            <p className="text-sm text-gray-900">{website.planName} - ₹{website.monthlyPrice.toLocaleString()}/month</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <Badge className={`${getStatusColor(website.status)} ml-2`}>
              {website.status.replace('_', ' ')}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Last Payment</Label>
            <p className="text-sm text-gray-900">{website.lastPaymentDate.toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Next Payment Due</Label>
            <p className="text-sm text-gray-900">{website.nextPaymentDue.toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Total Revenue</Label>
            <p className="text-sm text-gray-900">₹{website.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-3">Usage Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700">Total Visits</Label>
            <p className="text-sm text-gray-900">{website.totalVisits.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Storage Used</Label>
            <p className="text-sm text-gray-900">{website.storageUsed} MB</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Bandwidth Used</Label>
            <p className="text-sm text-gray-900">{website.bandwidthUsed} GB</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t pt-4 space-y-4">
        <h3 className="text-lg font-medium">Actions</h3>
        
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => onSendReminder(website.id)}
            variant="outline"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send Payment Reminder
          </Button>

          {website.status === 'active' ? (
            <Button
              onClick={() => onAction(website.id, 'suspend', suspensionReason || 'Manual suspension by admin')}
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <Ban className="w-4 h-4 mr-2" />
              Suspend Website
            </Button>
          ) : (
            <Button
              onClick={() => onAction(website.id, 'activate')}
              variant="outline"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Power className="w-4 h-4 mr-2" />
              Activate Website
            </Button>
          )}

          <Button
            onClick={() => onAction(website.id, 'disable', 'Manually disabled by admin')}
            variant="outline"
            className="text-gray-600 border-gray-200 hover:bg-gray-50"
          >
            <PowerOff className="w-4 h-4 mr-2" />
            Disable Website
          </Button>
        </div>

        {/* Suspension Reason */}
        <div>
          <Label htmlFor="suspension-reason" className="text-sm font-medium text-gray-700">
            Suspension Reason (Optional)
          </Label>
          <Textarea
            id="suspension-reason"
            value={suspensionReason}
            onChange={(e) => setSuspensionReason(e.target.value)}
            placeholder="Enter reason for suspension..."
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'suspended': return 'bg-red-100 text-red-800';
    case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
    case 'disabled': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}
