import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, where, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  Users, 
  TrendingUp, 
  Phone, 
  Mail, 
  Clock, 
  DollarSign, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle,
  X,
  Star,
  Calendar,
  MapPin,
  Smartphone,
  AlertCircle,
  Search
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  timeline: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'closed';
  priority: 'low' | 'medium' | 'high';
  submittedAt: Timestamp;
  ip?: string;
  userAgent?: string;
  notes?: string;
}

export function LeadManagementDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');

  // Real-time leads subscription
  useEffect(() => {
    const q = query(
      collection(db, 'leads'),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lead[];
      
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter leads based on criteria
  useEffect(() => {
    let filtered = leads;

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(lead => lead.priority === filterPriority);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery)
      );
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(lead => 
        lead.submittedAt?.toDate() >= startDate
      );
    }

    setFilteredLeads(filtered);
  }, [leads, filterStatus, filterPriority, searchQuery, dateRange]);

  // Update lead status
  const updateLeadStatus = async (leadId: string, status: Lead['status']) => {
    try {
      await updateDoc(doc(db, 'leads', leadId), { 
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  // Delete lead
  const deleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteDoc(doc(db, 'leads', leadId));
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  // Calculate stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    highPriority: leads.filter(l => l.priority === 'high').length,
    todayLeads: leads.filter(l => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return l.submittedAt?.toDate() >= today;
    }).length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-indigo-100 text-indigo-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-blue-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lead Management Dashboard</h1>
          <p className="text-gray-600">Manage and track all your website leads in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New Leads</p>
                <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">High Priority</p>
                <p className="text-3xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <Star className="w-12 h-12 text-red-600" />
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Leads</p>
                <p className="text-3xl font-bold text-green-600">{stats.todayLeads}</p>
              </div>
              <Calendar className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>

            {/* Date Range Filter */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>

            {/* Export Button */}
            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    {/* Lead Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>

                    {/* Project Details */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.projectType || 'Not specified'}</div>
                        <div className="text-sm text-gray-500">Budget: {lead.budget || 'Not specified'}</div>
                        <div className="text-sm text-gray-500">Timeline: {lead.timeline || 'Not specified'}</div>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(lead.priority)}`}>
                        {lead.priority?.toUpperCase()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as Lead['status'])}
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full border-0 ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>

                    {/* Submitted */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lead.submittedAt?.toDate().toLocaleDateString()}
                      <br />
                      {lead.submittedAt?.toDate().toLocaleTimeString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No leads found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Lead Detail Modal */}
        <AnimatePresence>
          {selectedLead && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedLead(null)}
              />
              
              <motion.div
                className="fixed inset-0 flex items-center justify-center p-4 z-50"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h2>
                      <p className="text-gray-600">{selectedLead.email}</p>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Contact Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-blue-600" />
                          <span>{selectedLead.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <span>{selectedLead.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Project Requirements</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <span className="font-medium">Project Type: </span>
                          <span>{selectedLead.projectType || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Budget Range: </span>
                          <span>{selectedLead.budget || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="font-medium">Timeline: </span>
                          <span>{selectedLead.timeline || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Technical Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Technical Information</h3>
                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
                        <div><span className="font-medium">Source: </span>{selectedLead.source}</div>
                        <div><span className="font-medium">IP Address: </span>{selectedLead.ip || 'Unknown'}</div>
                        <div><span className="font-medium">Submitted: </span>{selectedLead.submittedAt?.toDate().toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Lead Status</h3>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => {
                          updateLeadStatus(selectedLead.id, e.target.value as Lead['status']);
                          setSelectedLead({...selectedLead, status: e.target.value as Lead['status']});
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-green-700 transition-colors"
                      >
                        Call Now
                      </a>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
                      >
                        Send Email
                      </a>
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-green-600 transition-colors"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
