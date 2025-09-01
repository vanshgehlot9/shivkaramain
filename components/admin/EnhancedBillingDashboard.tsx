import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useUserRole } from "../../hooks/useUserRole";
import { 
  FileText, Plus, Edit, Trash2, DollarSign, Calendar, CreditCard, 
  AlertCircle, CheckCircle, Clock, Download, Eye, Send, 
  Package, Building, Phone, Mail, MapPin, User, Hash,
  IndianRupee, Printer, Share2, Copy, ExternalLink, X
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Invoice {
  id: string;
  clientName: string;
  email: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  dueDate: any;
  createdDate: any;
  invoiceNumber: string;
  description?: string;
  items?: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  clientAddress?: string;
  clientPhone?: string;
  taxAmount?: number;
  subtotal?: number;
  notes?: string;
  paymentTerms?: string;
}

export function EnhancedBillingDashboard() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ 
    clientName: "", 
    email: "", 
    amount: "", 
    status: "draft" as Invoice['status'],
    dueDate: "",
    description: "",
    clientAddress: "",
    clientPhone: "",
    taxAmount: "",
    notes: "",
    paymentTerms: "Payment due within 15 days",
    items: [{ description: "", quantity: 1, rate: 0, amount: 0 }]
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { userRole, isLoading: roleLoading } = useUserRole();

  const canEdit = true;

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SHV-${year}${month}-${random}`;
  };

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const snapshot = await getDocs(collection(db, "invoices"));
      const invoicesData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure items is always an array
          items: Array.isArray(data.items) ? data.items : []
        };
      }) as Invoice[];
      setInvoices(invoicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const currentItems = Array.isArray(form.items) ? form.items : [];
    const newItems = [...currentItems];
    
    // Ensure the index exists
    if (index >= 0 && index < newItems.length) {
      newItems[index] = { ...newItems[index], [field]: value };
      
      // Auto-calculate amount
      if (field === 'quantity' || field === 'rate') {
        newItems[index].amount = newItems[index].quantity * newItems[index].rate;
      }
      
      setForm({ ...form, items: newItems });
      
      // Update total amount
      const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = parseFloat(form.taxAmount) || 0;
      const total = subtotal + taxAmount;
      setForm(prev => ({ ...prev, amount: total.toString() }));
    }
  };

  const addItem = () => {
    const currentItems = Array.isArray(form.items) ? form.items : [];
    setForm({
      ...form,
      items: [...currentItems, { description: "", quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const currentItems = Array.isArray(form.items) ? form.items : [];
    if (currentItems.length > 1) {
      const newItems = currentItems.filter((_, i) => i !== index);
      setForm({ ...form, items: newItems });
      
      // Recalculate total
      const subtotal = newItems.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = parseFloat(form.taxAmount) || 0;
      const total = subtotal + taxAmount;
      setForm(prev => ({ ...prev, amount: total.toString() }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName || !form.email || !form.amount || !form.dueDate) return;
    
    try {
      const subtotal = form.items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = parseFloat(form.taxAmount) || 0;
      
      const invoiceData = {
        clientName: form.clientName,
        email: form.email,
        amount: parseFloat(form.amount),
        status: form.status,
        dueDate: Timestamp.fromDate(new Date(form.dueDate)),
        description: form.description,
        clientAddress: form.clientAddress,
        clientPhone: form.clientPhone,
        taxAmount: taxAmount,
        subtotal: subtotal,
        notes: form.notes,
        paymentTerms: form.paymentTerms,
        items: form.items,
        invoiceNumber: editingId ? (invoices.find(inv => inv.id === editingId)?.invoiceNumber || generateInvoiceNumber()) : generateInvoiceNumber(),
        createdDate: editingId ? (invoices.find(inv => inv.id === editingId)?.createdDate || Timestamp.now()) : Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      if (editingId) {
        await updateDoc(doc(db, "invoices", editingId), invoiceData);
      } else {
        await addDoc(collection(db, "invoices"), invoiceData);
      }
      
      resetForm();
      setEditingId(null);
      setShowForm(false);
      fetchInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const resetForm = () => {
    setForm({
      clientName: "", 
      email: "", 
      amount: "", 
      status: "draft",
      dueDate: "",
      description: "",
      clientAddress: "",
      clientPhone: "",
      taxAmount: "",
      notes: "",
      paymentTerms: "Payment due within 15 days",
      items: [{ description: "", quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setForm({
      clientName: invoice.clientName || "",
      email: invoice.email || "",
      amount: invoice.amount ? invoice.amount.toString() : "",
      status: invoice.status || "draft",
      dueDate: invoice.dueDate ? invoice.dueDate.toDate().toISOString().slice(0, 10) : "",
      description: invoice.description || "",
      clientAddress: invoice.clientAddress || "",
      clientPhone: invoice.clientPhone || "",
      taxAmount: invoice.taxAmount?.toString() || "",
      notes: invoice.notes || "",
      paymentTerms: invoice.paymentTerms || "Payment due within 15 days",
      items: Array.isArray(invoice.items) ? invoice.items : [{ description: "", quantity: 1, rate: 0, amount: 0 }]
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await deleteDoc(doc(db, "invoices", id));
      fetchInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const updateInvoiceStatus = async (id: string, status: Invoice['status']) => {
    try {
      await updateDoc(doc(db, "invoices", id), { status, updatedAt: Timestamp.now() });
      fetchInvoices();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const generatePDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    
    // Company Logo and Header
    doc.setFontSize(24);
    doc.setTextColor(37, 99, 235); // Blue color
    doc.text('SHIVKARA DIGITAL', 20, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99); // Gray color
    doc.text('Digital Solutions & Software Development', 20, 38);
    doc.text('Jodhpur, Rajasthan, India', 20, 44);
    doc.text('Email: info@shivkaradigital.com', 20, 50);
    doc.text('Phone: +91 95216 99906', 20, 56);
    doc.text('Website: www.shivkaradigital.com', 20, 62);

    // Invoice Title and Number
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text('INVOICE', 150, 30);
    
    doc.setFontSize(12);
    doc.setTextColor(75, 85, 99);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 45);
    doc.text(`Date: ${invoice.createdDate?.toDate().toLocaleDateString() || 'N/A'}`, 150, 52);
    doc.text(`Due Date: ${invoice.dueDate?.toDate().toLocaleDateString() || 'N/A'}`, 150, 59);

    // Status Badge
    const statusColors = {
      draft: [156, 163, 175],
      sent: [59, 130, 246],
      paid: [34, 197, 94],
      overdue: [239, 68, 68],
      cancelled: [107, 114, 128]
    };
    
    const [r, g, b] = statusColors[invoice.status] || statusColors.draft;
    doc.setFillColor(r, g, b);
    doc.roundedRect(150, 65, 35, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(invoice.status.toUpperCase(), 155, 71);

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Client Information
    doc.setFontSize(14);
    doc.setFont("helvetica", 'bold');
    doc.text('BILL TO:', 20, 85);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", 'normal');
    doc.text(invoice.clientName, 20, 95);
    if (invoice.email) doc.text(invoice.email, 20, 102);
    if (invoice.clientPhone) doc.text(invoice.clientPhone, 20, 109);
    if (invoice.clientAddress) {
      const addressLines = doc.splitTextToSize(invoice.clientAddress, 80);
      doc.text(addressLines, 20, 116);
    }

    // Items Table
    const tableStartY = 140;
    const items = Array.isArray(invoice.items) ? invoice.items : [];
    
    if (items.length > 0) {
      (doc as any).autoTable({
        startY: tableStartY,
        head: [['Description', 'Qty', 'Rate (₹)', 'Amount (₹)']],
        body: items.map(item => [
          item.description || '',
          (item.quantity || 0).toString(),
          `₹${(item.rate || 0).toLocaleString()}`,
          `₹${(item.amount || 0).toLocaleString()}`
        ]),
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252]
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 20, halign: 'center' },
          2: { cellWidth: 35, halign: 'right' },
          3: { cellWidth: 35, halign: 'right' }
        }
      });
    }

    // Calculate final Y position after table
    const finalY = (doc as any).lastAutoTable?.finalY || tableStartY + 40;

    // Totals Section
    const totalsStartY = finalY + 20;
    const subtotal = invoice.subtotal || 0;
    const taxAmount = invoice.taxAmount || 0;
    const total = invoice.amount;

    doc.setFontSize(11);
    doc.text('Subtotal:', 130, totalsStartY);
    doc.text(`₹${subtotal.toLocaleString()}`, 170, totalsStartY);
    
    if (taxAmount > 0) {
      doc.text('Tax:', 130, totalsStartY + 8);
      doc.text(`₹${taxAmount.toLocaleString()}`, 170, totalsStartY + 8);
    }
    
    // Total with background
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(125, totalsStartY + 15, 70, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', 130, totalsStartY + 23);
    doc.text(`₹${total.toLocaleString()}`, 170, totalsStartY + 23);

    // Reset styles
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", 'normal');

    // Payment Terms and Notes
    const notesStartY = totalsStartY + 40;
    
    if (invoice.paymentTerms) {
      doc.setFontSize(10);
      doc.setFont("helvetica", 'bold');
      doc.text('Payment Terms:', 20, notesStartY);
      doc.setFont("helvetica", 'normal');
      const termsLines = doc.splitTextToSize(invoice.paymentTerms, 170);
      doc.text(termsLines, 20, notesStartY + 8);
    }

    if (invoice.notes) {
      const notesY = notesStartY + (invoice.paymentTerms ? 25 : 0);
      doc.setFont("helvetica", 'bold');
      doc.text('Notes:', 20, notesY);
      doc.setFont("helvetica", 'normal');
      const notesLines = doc.splitTextToSize(invoice.notes, 170);
      doc.text(notesLines, 20, notesY + 8);
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text('Thank you for your business!', 20, pageHeight - 30);
    doc.text('This is a computer-generated invoice.', 20, pageHeight - 25);
    
    // QR Code placeholder (you can integrate a QR code library)
    doc.setDrawColor(200, 200, 200);
    doc.rect(150, pageHeight - 45, 30, 30);
    doc.setFontSize(6);
    doc.text('QR CODE', 160, pageHeight - 28);
    doc.text('FOR PAYMENT', 155, pageHeight - 24);

    return doc;
  };

  const downloadPDF = (invoice: Invoice) => {
    const doc = generatePDF(invoice);
    doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
  };

  const previewPDF = (invoice: Invoice) => {
    setPreviewInvoice(invoice);
    setShowPreview(true);
  };

  const sendInvoice = async (invoice: Invoice) => {
    // Here you would integrate with your email service
    // For now, we'll just update the status and generate PDF
    try {
      await updateInvoiceStatus(invoice.id, 'sent');
      downloadPDF(invoice);
      alert(`Invoice ${invoice.invoiceNumber} has been marked as sent and PDF downloaded.`);
    } catch (error) {
      setError("Failed to send invoice");
    }
  };

  const duplicateInvoice = (invoice: Invoice) => {
    const newForm = {
      clientName: invoice.clientName,
      email: invoice.email,
      amount: invoice.amount.toString(),
      status: "draft" as Invoice['status'],
      dueDate: "",
      description: invoice.description || "",
      clientAddress: invoice.clientAddress || "",
      clientPhone: invoice.clientPhone || "",
      taxAmount: invoice.taxAmount?.toString() || "",
      notes: invoice.notes || "",
      paymentTerms: invoice.paymentTerms || "Payment due within 15 days",
      items: invoice.items || [{ description: "", quantity: 1, rate: 0, amount: 0 }]
    };
    
    setForm(newForm);
    setEditingId(null);
    setShowForm(true);
  };

  const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => ['sent', 'overdue'].includes(inv.status)).reduce((sum, inv) => sum + inv.amount, 0);
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  const draftInvoices = invoices.filter(inv => inv.status === 'draft').length;

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4 text-gray-500" />;
      case 'sent': return <Send className="w-4 h-4 text-blue-500" />;
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <X className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1";
    switch (status) {
      case 'draft': 
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'sent': 
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'paid': 
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'overdue': 
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'cancelled': 
        return `${baseClasses} bg-gray-100 text-gray-600`;
      default: 
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }
  };

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <div className="text-red-600 text-lg font-semibold">Access Denied</div>
        <p className="text-red-500 mt-2">You don't have permission to access the billing module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Advanced Invoice Management</h1>
          <p className="text-gray-600 mt-1">Professional invoice generation with PDF export & management</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              resetForm();
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-green-900">₹{totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Paid Amount</p>
                <p className="text-2xl font-bold text-blue-900">₹{paidAmount.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">₹{pendingAmount.toLocaleString()}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Overdue</p>
                <p className="text-2xl font-bold text-red-900">{overdueInvoices}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{draftInvoices}</p>
              </div>
              <FileText className="w-10 h-10 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Add/Edit Form */}
      {showForm && (
        <Card className="border-2 border-blue-200 shadow-lg">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Package className="w-6 h-6" />
              {editingId ? "Edit Invoice" : "Create Professional Invoice"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Client Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Name *</label>
                    <input 
                      name="clientName" 
                      type="text"
                      value={form.clientName} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input 
                      name="email" 
                      type="email"
                      value={form.email} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input 
                      name="clientPhone" 
                      type="tel"
                      value={form.clientPhone} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+91 XXXXXXXXXX"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea 
                      name="clientAddress" 
                      value={form.clientAddress} 
                      onChange={handleChange}
                      rows={2}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Client address"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Invoice Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                    <input 
                      name="dueDate" 
                      type="date" 
                      value={form.dueDate} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select 
                      name="status" 
                      value={form.status} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Terms</label>
                    <select 
                      name="paymentTerms" 
                      value={form.paymentTerms} 
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Payment due within 15 days">Net 15 Days</option>
                      <option value="Payment due within 30 days">Net 30 Days</option>
                      <option value="Payment due immediately">Due Immediately</option>
                      <option value="Payment due within 7 days">Net 7 Days</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    name="description" 
                    value={form.description} 
                    onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Invoice description or project details..."
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Invoice Items
                  </h3>
                  <Button
                    type="button"
                    onClick={addItem}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {Array.isArray(form.items) && form.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-white p-3 rounded-lg border">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <input
                          type="text"
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Item description"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Rate (₹)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Amount (₹)</label>
                        <input
                          type="number"
                          value={item.amount}
                          readOnly
                          className="w-full border border-gray-200 rounded px-3 py-2 text-sm bg-gray-50"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          type="button"
                          onClick={() => removeItem(index)}
                          disabled={form.items.length === 1}
                          className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Section */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5" />
                  Totals & Tax
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Amount (₹)</label>
                    <input 
                      name="taxAmount" 
                      type="number" 
                      step="0.01"
                      value={form.taxAmount} 
                      onChange={(e) => {
                        setForm({ ...form, taxAmount: e.target.value });
                        const subtotal = form.items.reduce((sum, item) => sum + item.amount, 0);
                        const tax = parseFloat(e.target.value) || 0;
                        setForm(prev => ({ ...prev, amount: (subtotal + tax).toString() }));
                      }}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal (₹)</label>
                    <input 
                      type="number"
                      value={form.items.reduce((sum, item) => sum + item.amount, 0)}
                      readOnly
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (₹) *</label>
                    <input 
                      name="amount" 
                      type="number" 
                      step="0.01"
                      value={form.amount} 
                      readOnly
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-yellow-50 font-bold text-lg"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea 
                  name="notes" 
                  value={form.notes} 
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional notes, terms, or special instructions..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  {editingId ? "Update Invoice" : "Create Invoice"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-8 py-3"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Invoices List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Invoice Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : invoices.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No invoices yet</h3>
              <p className="text-gray-500 mb-4">Create your first professional invoice to get started</p>
              <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Create First Invoice
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-lg text-gray-900">{invoice.invoiceNumber}</h4>
                        <span className={getStatusBadge(invoice.status)}>
                          {getStatusIcon(invoice.status)}
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Client:</p>
                          <p className="font-semibold text-gray-900">{invoice.clientName}</p>
                          <p className="text-gray-600">{invoice.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Amount:</p>
                          <p className="font-bold text-2xl text-green-600">₹{invoice.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Due Date:</p>
                          <p className="font-semibold">{invoice.dueDate ? invoice.dueDate.toDate().toLocaleDateString() : 'N/A'}</p>
                          <p className="text-gray-600">Created: {invoice.createdDate?.toDate ? invoice.createdDate.toDate().toLocaleDateString() : 'N/A'}</p>
                        </div>
                      </div>
                      {invoice.description && (
                        <p className="text-gray-700 mt-2">{invoice.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                    {/* Preview & Download */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => previewPDF(invoice)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadPDF(invoice)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>

                    {/* Actions based on status */}
                    {invoice.status === 'draft' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => sendInvoice(invoice)}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                        >
                          <Send className="w-4 h-4" />
                          Send Invoice
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(invoice)}
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                      </>
                    )}
                    
                    {invoice.status === 'sent' && (
                      <Button
                        size="sm"
                        onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Paid
                      </Button>
                    )}
                    
                    {['sent', 'overdue'].includes(invoice.status) && (
                      <Button
                        size="sm"
                        onClick={() => updateInvoiceStatus(invoice.id, 'overdue')}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Mark Overdue
                      </Button>
                    )}

                    {/* Universal Actions */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => duplicateInvoice(invoice)}
                      className="flex items-center gap-1 text-purple-600 hover:text-purple-700 border-purple-200 hover:border-purple-300"
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(invoice.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {showPreview && previewInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Invoice Preview - {previewInvoice.invoiceNumber}</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadPDF(previewInvoice)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-6">
              {/* Invoice Preview Content */}
              <div className="bg-white border rounded-lg p-8">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-blue-600">SHIVKARA DIGITAL</h1>
                    <p className="text-gray-600 mt-1">Digital Solutions & Software Development</p>
                    <p className="text-gray-600">Jodhpur, Rajasthan, India</p>
                    <p className="text-gray-600">info@shivkaradigital.com | +91 95216 99906</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
                    <p className="text-gray-600">#{previewInvoice.invoiceNumber}</p>
                    <p className="text-gray-600">Date: {previewInvoice.createdDate?.toDate().toLocaleDateString()}</p>
                    <p className="text-gray-600">Due: {previewInvoice.dueDate?.toDate().toLocaleDateString()}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusBadge(previewInvoice.status)}`}>
                      {previewInvoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">BILL TO:</h3>
                    <p className="font-semibold">{previewInvoice.clientName}</p>
                    <p className="text-gray-600">{previewInvoice.email}</p>
                    {previewInvoice.clientPhone && <p className="text-gray-600">{previewInvoice.clientPhone}</p>}
                    {previewInvoice.clientAddress && <p className="text-gray-600">{previewInvoice.clientAddress}</p>}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">PAYMENT TERMS:</h3>
                    <p className="text-gray-600">{previewInvoice.paymentTerms}</p>
                  </div>
                </div>

                {Array.isArray(previewInvoice.items) && previewInvoice.items.length > 0 && (
                  <div className="mb-8">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                          <th className="border border-gray-300 px-4 py-2 text-center">Qty</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Rate</th>
                          <th className="border border-gray-300 px-4 py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">{item.description || ''}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity || 0}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">₹{(item.rate || 0).toLocaleString()}</td>
                            <td className="border border-gray-300 px-4 py-2 text-right">₹{(item.amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span>₹{(previewInvoice.subtotal || 0).toLocaleString()}</span>
                    </div>
                    {previewInvoice.taxAmount && previewInvoice.taxAmount > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Tax:</span>
                        <span>₹{previewInvoice.taxAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-t border-gray-300 font-bold text-lg">
                      <span>TOTAL:</span>
                      <span>₹{previewInvoice.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {previewInvoice.notes && (
                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 mb-2">Notes:</h4>
                    <p className="text-gray-600">{previewInvoice.notes}</p>
                  </div>
                )}

                <div className="text-center text-gray-500 text-sm border-t pt-4">
                  <p>Thank you for your business!</p>
                  <p>This is a computer-generated invoice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
