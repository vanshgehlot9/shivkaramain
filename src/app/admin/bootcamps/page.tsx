"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Users, Edit2, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Bootcamp {
    id: string;
    name: string;
    description: string;
    category: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

const CATEGORIES = [
    { value: 'design', label: 'Design' },
    { value: 'development', label: 'Development' },
    { value: 'data', label: 'Data Science' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' },
];

export default function BootcampsPage() {
    const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingBootcamp, setEditingBootcamp] = useState<Bootcamp | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'design',
        startDate: '',
        endDate: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBootcamps();
    }, []);

    const fetchBootcamps = async () => {
        try {
            const response = await fetch('/api/admin/bootcamps');
            const data = await response.json();
            if (data.success) {
                setBootcamps(data.data);
            }
        } catch (error) {
            console.error('Error fetching bootcamps:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingBootcamp
                ? `/api/admin/bootcamps/${editingBootcamp.id}`
                : '/api/admin/bootcamps';
            const method = editingBootcamp ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                fetchBootcamps();
                closeModal();
            } else {
                alert(data.error || 'Failed to save bootcamp');
            }
        } catch (error) {
            console.error('Error saving bootcamp:', error);
            alert('Failed to save bootcamp');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bootcamp?')) return;

        try {
            const response = await fetch(`/api/admin/bootcamps/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchBootcamps();
            } else {
                alert(data.error || 'Failed to delete bootcamp');
            }
        } catch (error) {
            console.error('Error deleting bootcamp:', error);
        }
    };

    const openCreateModal = () => {
        setEditingBootcamp(null);
        setFormData({
            name: '',
            description: '',
            category: 'design',
            startDate: '',
            endDate: '',
        });
        setShowModal(true);
    };

    const openEditModal = (bootcamp: Bootcamp) => {
        setEditingBootcamp(bootcamp);
        setFormData({
            name: bootcamp.name,
            description: bootcamp.description,
            category: bootcamp.category,
            startDate: new Date(bootcamp.startDate).toISOString().split('T')[0],
            endDate: new Date(bootcamp.endDate).toISOString().split('T')[0],
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBootcamp(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-2 border-shivkara-orange/30 border-t-shivkara-orange rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Bootcamps</h1>
                    <p className="text-gray-400 mt-1">Manage your bootcamp programs</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2 bg-shivkara-orange text-black font-medium rounded-xl hover:bg-shivkara-orange/90 transition-colors"
                >
                    <Plus size={18} />
                    Create Bootcamp
                </button>
            </div>

            {/* Bootcamps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bootcamps.map((bootcamp) => (
                    <motion.div
                        key={bootcamp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-semibold text-lg">{bootcamp.name}</h3>
                                <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${getStatusColor(bootcamp.status)}`}>
                                    {bootcamp.status}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(bootcamp)}
                                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(bootcamp.id)}
                                    className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{bootcamp.description}</p>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <Users size={14} />
                                <span className="capitalize">{bootcamp.category}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <Calendar size={14} />
                                <span>
                                    {new Date(bootcamp.startDate).toLocaleDateString()} - {new Date(bootcamp.endDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {bootcamps.length === 0 && (
                    <div className="col-span-full text-center py-16 text-gray-500">
                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No bootcamps yet. Create your first bootcamp to get started.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">
                                    {editingBootcamp ? 'Edit Bootcamp' : 'Create Bootcamp'}
                                </h2>
                                <button onClick={closeModal} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                        placeholder="e.g., Spunk 2025 - Product Design"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange resize-none"
                                        placeholder="Describe the bootcamp..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <option key={cat.value} value={cat.value} className="bg-[#0a0a0a]">
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                                        <input
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                                        <input
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-shivkara-orange"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-4 py-2 bg-shivkara-orange text-black font-medium rounded-xl hover:bg-shivkara-orange/90 transition-colors disabled:opacity-50"
                                    >
                                        {submitting ? 'Saving...' : editingBootcamp ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
