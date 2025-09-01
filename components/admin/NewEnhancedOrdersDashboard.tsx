import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { useUserRole } from "../../hooks/useUserRole";
import { ShoppingCart, Plus, Edit, Trash2, Package, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: string;
  customerName: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: any;
  items?: string;
  notes?: string;
  productDetails?: {
    productId: string;
    productName: string;
    originalPrice: number;
    quantity?: number;
    unitPrice?: number;
    priceChangeReason?: string;
  };
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
}

export function NewEnhancedOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state with clean structure
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    amount: "",
    status: "pending" as Order['status'],
    items: "",
    notes: "",
    selectedProductId: "",
    selectedCategory: "",
    originalPrice: "",
    quantity: "1",
    unitPrice: "",
    priceChangeReason: ""
  });

  const { userRole, isLoading: roleLoading } = useUserRole();
  const canEdit = true;

  // Fetch orders from Firebase
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const snapshot = await getDocs(collection(db, "orders"));
      const ordersData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Order[];
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products from Firebase
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      const productsData = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Product[];
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Create invoice when order is completed
  const createInvoice = async (order: Order) => {
    try {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const invoiceNumber = `INV-${year}${month}-${random}`;

      await addDoc(collection(db, "invoices"), {
        orderId: order.id,
        customerName: order.customerName,
        clientName: order.customerName,
        email: order.email,
        amount: order.amount,
        items: order.items || "",
        description: order.items || "Order items",
        status: "unpaid",
        invoiceNumber: invoiceNumber,
        createdAt: Timestamp.now(),
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      });
    } catch (err) {
      console.error("Error creating invoice:", err);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      customerName: "",
      email: "",
      amount: "",
      status: "pending",
      items: "",
      notes: "",
      selectedProductId: "",
      selectedCategory: "",
      originalPrice: "",
      quantity: "1",
      unitPrice: "",
      priceChangeReason: ""
    });
    setError(null);
    setEditingId(null);
  };

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle product selection
  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const quantity = parseInt(formData.quantity) || 1;
      const totalAmount = product.price * quantity;
      setFormData(prev => ({
        ...prev,
        selectedProductId: productId,
        amount: totalAmount.toString(),
        originalPrice: product.price.toString(),
        unitPrice: product.price.toString(),
        items: product.name
      }));
    }
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategory: category,
      selectedProductId: "",
      amount: "",
      originalPrice: "",
      items: ""
    }));
  };

  // Handle quantity change and recalculate total
  const handleQuantityChange = (newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 1;
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    const totalAmount = unitPrice * quantity;
    
    setFormData(prev => ({
      ...prev,
      quantity: newQuantity,
      amount: totalAmount.toString()
    }));
  };

  // Handle unit price change and recalculate total
  const handleUnitPriceChange = (newUnitPrice: string) => {
    const unitPrice = parseFloat(newUnitPrice) || 0;
    const quantity = parseInt(formData.quantity) || 1;
    const totalAmount = unitPrice * quantity;
    
    setFormData(prev => ({
      ...prev,
      unitPrice: newUnitPrice,
      amount: totalAmount.toString()
    }));
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError("Customer name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      setError("Valid amount is required");
      return false;
    }
    
    // Check if price changed and reason is required
    const hasDiscount = formData.originalPrice && 
                       formData.amount !== formData.originalPrice && 
                       parseFloat(formData.amount) !== parseFloat(formData.originalPrice);
    
    if (hasDiscount && !formData.priceChangeReason.trim()) {
      setError("Please provide a reason for the price change");
      return false;
    }
    
    return true;
  };

  // Submit form (create or update order)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const orderData = {
        customerName: formData.customerName.trim(),
        email: formData.email.trim(),
        amount: parseFloat(formData.amount),
        status: formData.status,
        items: formData.items.trim(),
        notes: formData.notes.trim(),
        date: Timestamp.now(),
        updatedAt: Timestamp.now(),
        productDetails: formData.selectedProductId ? {
          productId: formData.selectedProductId,
          productName: products.find(p => p.id === formData.selectedProductId)?.name || "",
          originalPrice: parseFloat(formData.originalPrice || "0"),
          quantity: parseInt(formData.quantity) || 1,
          unitPrice: parseFloat(formData.unitPrice || "0"),
          priceChangeReason: formData.priceChangeReason.trim()
        } : undefined
      };

      if (editingId) {
        // Update existing order
        await updateDoc(doc(db, "orders", editingId), orderData);
        
        // Create invoice if completed
        if (orderData.status === "completed") {
          await createInvoice({ id: editingId, ...orderData });
        }
      } else {
        // Create new order
        const docRef = await addDoc(collection(db, "orders"), {
          ...orderData,
          createdAt: Timestamp.now()
        });
        
        // Create invoice if completed
        if (orderData.status === "completed") {
          await createInvoice({ id: docRef.id, ...orderData });
        }
      }
      
      // Reset and refresh
      resetForm();
      setShowForm(false);
      await fetchOrders();
      
    } catch (err) {
      console.error("Error saving order:", err);
      setError("Failed to save order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit order
  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    setFormData({
      customerName: order.customerName || "",
      email: order.email || "",
      amount: order.amount ? order.amount.toString() : "",
      status: order.status || "pending",
      items: order.items || "",
      notes: order.notes || "",
      selectedProductId: order.productDetails?.productId || "",
      selectedCategory: "",
      originalPrice: order.productDetails?.originalPrice?.toString() || "",
      quantity: order.productDetails?.quantity?.toString() || "1",
      unitPrice: order.productDetails?.unitPrice?.toString() || "",
      priceChangeReason: order.productDetails?.priceChangeReason || ""
    });
    setShowForm(true);
  };

  // Handle delete order
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    
    try {
      await deleteDoc(doc(db, "orders", id));
      await fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order");
    }
  };

  // Update order status
  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, "orders", id), { 
        status,
        updatedAt: Timestamp.now()
      });

      if (status === 'completed') {
        const order = orders.find(o => o.id === id);
        if (order) {
          await createInvoice(order);
        }
      }

      await fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
    }
  };

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];
  
  // Filter products by category
  const filteredProducts = formData.selectedCategory 
    ? products.filter(p => p.category === formData.selectedCategory)
    : products;

  // Get selected product
  const selectedProduct = products.find(p => p.id === formData.selectedProductId);

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  // Status badge styling
  const getStatusBadge = (status: Order['status']) => {
    const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium gap-1";
    switch (status) {
      case 'pending': 
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'processing': 
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed': 
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled': 
        return `${baseClasses} bg-red-100 text-red-800`;
    }
  };

  // Status icons
  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing': return <Package className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
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
        <p className="text-red-500 mt-2">You don't have permission to access the orders module.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage customer orders and track progress</p>
        </div>
        <Button 
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              resetForm();
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          {showForm ? "Cancel" : "Add Order"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-xs sm:text-sm font-medium">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold text-green-900">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-10 sm:h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Total Orders</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-900">{orders.length}</p>
              </div>
              <ShoppingCart className="w-6 h-6 sm:w-10 sm:h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-xs sm:text-sm font-medium">Pending Orders</p>
                <p className="text-lg sm:text-2xl font-bold text-yellow-900">{pendingOrders}</p>
              </div>
              <Clock className="w-6 h-6 sm:w-10 sm:h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-xs sm:text-sm font-medium">Completed</p>
                <p className="text-lg sm:text-2xl font-bold text-purple-900">{completedOrders}</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Order Form */}
      {showForm && (
        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-900">
              {editingId ? "Edit Order" : "Create New Order"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Customer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name *
                  </label>
                  <input 
                    type="text"
                    value={formData.customerName} 
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="customer@example.com"
                  />
                </div>
              </div>

              {/* Product Selection */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Select Service/Product (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select 
                      value={formData.selectedCategory}
                      onChange={(e) => handleCategorySelect(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product/Service</label>
                    <select 
                      value={formData.selectedProductId}
                      onChange={(e) => handleProductSelect(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={!formData.selectedCategory}
                    >
                      <option value="">
                        {formData.selectedCategory ? "Select Product" : "Choose category first"}
                      </option>
                      {filteredProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} - ₹{product.price?.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input 
                    type="number"
                    min="1"
                    value={formData.quantity} 
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter quantity"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Price (₹) *
                    {formData.originalPrice && formData.unitPrice !== formData.originalPrice && (
                      <span className="text-red-600 ml-2">
                        (Original: ₹{parseFloat(formData.originalPrice).toLocaleString()})
                      </span>
                    )}
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice} 
                    onChange={(e) => handleUnitPriceChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter unit price"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount (₹) *
                  </label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount} 
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    placeholder="Total calculated automatically"
                    readOnly
                  />
                </div>
              </div>

              {/* Status Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Status
                  </label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items/Description
                  </label>
                  <input 
                    type="text"
                    value={formData.items} 
                    onChange={(e) => handleInputChange('items', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="What items or services are included"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Notes
                  </label>
                  <input 
                    type="text"
                    value={formData.notes} 
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Any additional notes"
                  />
                </div>
              </div>

              {/* Price Change Reason (only if price changed) */}
              {formData.originalPrice && formData.amount !== formData.originalPrice && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Price Change *
                  </label>
                  <textarea
                    value={formData.priceChangeReason} 
                    onChange={(e) => handleInputChange('priceChangeReason', e.target.value)}
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !formData.priceChangeReason.trim() ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Explain why the price was changed (e.g., discount for loyal customer, bulk order discount, etc.)"
                    rows={3}
                  />
                </div>
              )}
              
              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Order" : "Create Order"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-8 py-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500">Create your first order to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{order.customerName}</h4>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={getStatusBadge(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="text-xs">{order.status}</span>
                          </span>
                          {order.productDetails?.priceChangeReason && (
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                              Price Changed
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-1">{order.email}</p>
                      {order.items && (
                        <p className="text-gray-700 mb-1 text-sm truncate">{order.items}</p>
                      )}
                      {order.notes && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-2">Notes: {order.notes}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                        <span className="font-semibold text-green-600">₹{order.amount.toLocaleString()}</span>
                        {order.productDetails?.quantity && order.productDetails.quantity > 1 && (
                          <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs">
                            Qty: {order.productDetails.quantity}
                          </span>
                        )}
                        {order.productDetails?.unitPrice && (
                          <span className="text-gray-600 text-xs hidden sm:inline">
                            @ ₹{order.productDetails.unitPrice.toLocaleString()}/unit
                          </span>
                        )}
                        {order.productDetails?.originalPrice && order.productDetails.originalPrice !== order.amount && (
                          <span className="text-gray-500 line-through text-xs">₹{order.productDetails.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="text-gray-500 text-xs">
                          {order.date?.toDate ? order.date.toDate().toLocaleDateString() : 'Date N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto sm:ml-4">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 text-xs flex-1 sm:flex-none"
                        >
                          Process
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="text-green-600 border-green-600 hover:bg-green-50 text-xs flex-1 sm:flex-none"
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(order)}
                        className="hover:bg-gray-100 text-xs flex-1 sm:flex-none"
                      >
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="sm:hidden ml-1">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                        className="hover:bg-red-100 text-red-600 text-xs flex-1 sm:flex-none"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="sm:hidden ml-1">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
