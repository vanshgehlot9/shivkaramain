"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  MessageSquare, 
  Filter,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  Gift,
  CreditCard,
  Building
} from "lucide-react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  Timestamp 
} from "firebase/firestore";
import { db } from "../lib/firebase";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject?: string;
  message: string;
  service?: string;
  company?: string;
  type: 'contact' | 'offer_claim' | 'plan_selection';
  timestamp: Timestamp;
  status: 'new' | 'read' | 'replied';
  
  // Offer claim specific fields
  offerTitle?: string;
  offerPrice?: string;
  originalPrice?: string;
  savings?: string;
  
  // Plan selection specific fields
  selectedPlan?: string;
  planPrice?: string;
  projectTimeline?: string;
}

export function AdminPanel() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'contact' | 'offer_claim' | 'plan_selection'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "submissions"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const submissionData: ContactSubmission[] = [];
      querySnapshot.forEach((doc) => {
        submissionData.push({
          id: doc.id,
          ...doc.data()
        } as ContactSubmission);
      });
      setSubmissions(submissionData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, status: 'new' | 'read' | 'replied') => {
    try {
      await updateDoc(doc(db, "submissions", id), { status });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      setSelectedSubmission(null);
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  const exportToCsv = async () => {
    setIsExporting(true);
    try {
      // Prepare CSV headers
      const headers = [
        'Type',
        'Name', 
        'Email',
        'Phone',
        'Company',
        'Subject/Plan/Offer',
        'Service/Timeline',
        'Message',
        'Status',
        'Additional Info',
        'Date',
        'Time'
      ];

      // Prepare CSV data
      const csvData = filteredSubmissions.map(sub => {
        const date = sub.timestamp.toDate();
        return [
          getTypeLabel(sub.type),
          `"${sub.name}"`,
          `"${sub.email}"`,
          `"${sub.phone || ''}"`,
          `"${sub.company || ''}"`,
          `"${sub.subject || sub.selectedPlan || sub.offerTitle || ''}"`,
          `"${sub.service || sub.projectTimeline || ''}"`,
          `"${sub.message.replace(/"/g, '""')}"`, // Escape quotes in message
          sub.status,
          `"${sub.type === 'offer_claim' ? `${sub.offerPrice} (was ${sub.originalPrice})` : 
               sub.type === 'plan_selection' ? `${sub.planPrice}` : ''}"`,
          date.toLocaleDateString(),
          date.toLocaleTimeString()
        ];
      });

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.join(','))
        .join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `submissions-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 100);
      }
      
      // Show success feedback
      alert(`Successfully exported ${filteredSubmissions.length} submissions to CSV!`);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const statusMatch = filter === 'all' || sub.status === filter;
    const typeMatch = typeFilter === 'all' || sub.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-yellow-100 text-yellow-800';
      case 'replied': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Clock className="w-4 h-4" />;
      case 'read': return <MessageSquare className="w-4 h-4" />;
      case 'replied': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'contact': return 'bg-gray-100 text-gray-800';
      case 'offer_claim': return 'bg-green-100 text-green-800';
      case 'plan_selection': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'contact': return <Mail className="w-4 h-4" />;
      case 'offer_claim': return <Gift className="w-4 h-4" />;
      case 'plan_selection': return <CreditCard className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'contact': return 'Contact';
      case 'offer_claim': return 'Offer Claim';
      case 'plan_selection': return 'Plan Request';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage contact form submissions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Total</h3>
            <p className="text-3xl font-bold text-blue-600">{submissions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">New</h3>
            <p className="text-3xl font-bold text-blue-600">
              {submissions.filter(s => s.status === 'new').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Contacts</h3>
            <p className="text-3xl font-bold text-gray-600">
              {submissions.filter(s => s.type === 'contact').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Offers</h3>
            <p className="text-3xl font-bold text-green-600">
              {submissions.filter(s => s.type === 'offer_claim').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Plans</h3>
            <p className="text-3xl font-bold text-purple-600">
              {submissions.filter(s => s.type === 'plan_selection').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Replied</h3>
            <p className="text-3xl font-bold text-green-600">
              {submissions.filter(s => s.status === 'replied').length}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex flex-col gap-4">
            {/* Status Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    All Status
                  </button>
                  <button
                    onClick={() => setFilter('new')}
                    className={`px-4 py-2 rounded-lg ${filter === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    New
                  </button>
                  <button
                    onClick={() => setFilter('read')}
                    className={`px-4 py-2 rounded-lg ${filter === 'read' ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => setFilter('replied')}
                    className={`px-4 py-2 rounded-lg ${filter === 'replied' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Replied
                  </button>
                </div>
              </div>
              <button
                onClick={exportToCsv}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'Export CSV'}
              </button>
            </div>
            
            {/* Type Filters */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-4 py-2 rounded-lg ${typeFilter === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setTypeFilter('contact')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${typeFilter === 'contact' ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Mail className="w-4 h-4" />
                  Contact Forms
                </button>
                <button
                  onClick={() => setTypeFilter('offer_claim')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${typeFilter === 'offer_claim' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <Gift className="w-4 h-4" />
                  Offer Claims
                </button>
                <button
                  onClick={() => setTypeFilter('plan_selection')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${typeFilter === 'plan_selection' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <CreditCard className="w-4 h-4" />
                  Plan Requests
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Contact Submissions</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredSubmissions.map((submission) => (
                <motion.div
                  key={submission.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedSubmission?.id === submission.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedSubmission(submission);
                    if (submission.status === 'new') {
                      updateStatus(submission.id, 'read');
                    }
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{submission.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(submission.type)}`}>
                          {getTypeIcon(submission.type)}
                          {getTypeLabel(submission.type)}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          {submission.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {submission.type === 'contact' ? submission.subject :
                     submission.type === 'offer_claim' ? submission.offerTitle :
                     submission.type === 'plan_selection' ? submission.selectedPlan : 
                     'No subject'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {submission.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {submission.timestamp.toDate().toLocaleDateString()}
                    </span>
                    {submission.company && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {submission.company}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submission Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Submission Details</h2>
            </div>
            {selectedSubmission ? (
              <div className="p-6">
                {/* Type Badge */}
                <div className="mb-6">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${getTypeColor(selectedSubmission.type)}`}>
                    {getTypeIcon(selectedSubmission.type)}
                    {getTypeLabel(selectedSubmission.type)}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <p className="text-gray-900">{selectedSubmission.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedSubmission.email}</p>
                  </div>
                  {selectedSubmission.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedSubmission.phone}</p>
                    </div>
                  )}
                  {selectedSubmission.company && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <p className="text-gray-900">{selectedSubmission.company}</p>
                    </div>
                  )}

                  {/* Type-specific fields */}
                  {selectedSubmission.type === 'contact' && (
                    <>
                      {selectedSubmission.service && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Service Interest</label>
                          <p className="text-gray-900">{selectedSubmission.service}</p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <p className="text-gray-900">{selectedSubmission.subject}</p>
                      </div>
                    </>
                  )}

                  {selectedSubmission.type === 'offer_claim' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Offer Details</label>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">{selectedSubmission.offerTitle}</h4>
                          <div className="flex items-center space-x-4">
                            <span className="text-lg text-gray-500 line-through">{selectedSubmission.originalPrice}</span>
                            <span className="text-xl font-bold text-green-600">{selectedSubmission.offerPrice}</span>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                              Save {selectedSubmission.savings}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedSubmission.type === 'plan_selection' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selected Plan</label>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">{selectedSubmission.selectedPlan}</h4>
                          <p className="text-xl font-bold text-blue-600">{selectedSubmission.planPrice}</p>
                        </div>
                      </div>
                      {selectedSubmission.projectTimeline && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Project Timeline</label>
                          <p className="text-gray-900">{selectedSubmission.projectTimeline}</p>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">{selectedSubmission.message}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submitted</label>
                    <p className="text-gray-900">
                      {selectedSubmission.timestamp.toDate().toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedSubmission.status}
                    onChange={(e) => updateStatus(selectedSubmission.id, e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                  <button
                    onClick={() => deleteSubmission(selectedSubmission.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <a
                    href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </a>
                  {selectedSubmission.phone && (
                    <a
                      href={`tel:${selectedSubmission.phone}`}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Select a submission to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
