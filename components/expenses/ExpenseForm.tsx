import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { X } from 'lucide-react';

// Define schema for expense/income entry
const formSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  date: z.string(),
  paymentMethod: z.string().optional(),
  receipt: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const categories = {
  income: [
    'Project Payment', 
    'Retainer', 
    'Maintenance', 
    'Consultation', 
    'Other Income'
  ],
  expense: [
    'Salary', 
    'Office Rent', 
    'Utilities', 
    'Software Subscriptions', 
    'Hardware', 
    'Marketing', 
    'Travel', 
    'Other Expense'
  ]
};

interface ExpenseFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export const ExpenseForm = ({ onClose, onSuccess, initialData = null, isEditing = false }: ExpenseFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [entryType, setEntryType] = useState(initialData?.type || 'expense');
  
  // Set up form with validation
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      type: initialData.type,
      amount: initialData.amount,
      description: initialData.description,
      category: initialData.category,
      date: initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0],
      paymentMethod: initialData.paymentMethod,
      notes: initialData.notes,
    } : {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      
      const entryData = {
        ...data,
        amount: Number(data.amount),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (isEditing && initialData?.id) {
        // Update existing entry
        await updateDoc(doc(db, 'financials', initialData.id), {
          ...entryData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create new entry
        await addDoc(collection(db, 'financials'), entryData);
      }
      
      // Log activity
      await addDoc(collection(db, 'activityLogs'), {
        action: isEditing ? 'update' : 'create',
        resourceType: 'financial',
        resourceId: initialData?.id || 'new',
        description: `${isEditing ? 'Updated' : 'Created'} ${data.type} entry: ${data.description} (₹${data.amount})`,
        performedBy: 'current-user', // Replace with actual user ID
        timestamp: serverTimestamp(),
      });
      
      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving financial entry:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleTypeChange = (type: string) => {
    setEntryType(type);
    setValue('type', type as 'income' | 'expense');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="text-xl font-bold mb-6">
          {isEditing ? 'Edit' : 'Add New'} Financial Entry
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mb-6 gap-2">
            <button
              type="button"
              className={`flex-1 py-3 rounded-lg text-center font-medium ${
                entryType === 'income' 
                  ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handleTypeChange('income')}
            >
              Income
            </button>
            <button
              type="button"
              className={`flex-1 py-3 rounded-lg text-center font-medium ${
                entryType === 'expense' 
                  ? 'bg-red-100 text-red-700 border-2 border-red-500' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handleTypeChange('expense')}
            >
              Expense
            </button>
          </div>
          
          <input type="hidden" {...register('type')} value={entryType} />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                {...register('date')}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              {...register('category')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a category</option>
              {categories[entryType as keyof typeof categories].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              {...register('description')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              {...register('paymentMethod')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select payment method</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="credit_card">Credit Card</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              {...register('notes')}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Any additional information..."
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Entry' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
