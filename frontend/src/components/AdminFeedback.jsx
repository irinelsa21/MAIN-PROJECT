import React, { useState, useEffect } from 'react';
import {
    Star,
    CheckCircle,
    XCircle,
    Trash2,
    Filter,
    Search,
    MessageSquare,
    User,
    Calendar,
    AlertCircle,
    Loader2,
    TrendingUp,
    Eye,
    EyeOff
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, approved, pending
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [activeItem] = useState('feedbacks');

    const fetchFeedbacks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/feedbacks/');
            const data = await response.json();
            setFeedbacks(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const handleUpdateStatus = async (feedbackId, isApproved) => {
        setActionLoading(feedbackId);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/feedback-status/${feedbackId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_approved: isApproved })
            });

            if (response.ok) {
                setFeedbacks(feedbacks.map(fb =>
                    fb.id === feedbackId ? { ...fb, is_approved: isApproved } : fb
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (feedbackId) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;

        setActionLoading(feedbackId);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/feedback-delete/${feedbackId}/`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setFeedbacks(feedbacks.filter(fb => fb.id !== feedbackId));
            }
        } catch (error) {
            console.error("Error deleting feedback:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredFeedbacks = feedbacks.filter(fb => {
        const matchesFilter =
            filter === 'all' ? true :
                filter === 'approved' ? fb.is_approved :
                    !fb.is_approved;

        const matchesSearch =
            fb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fb.review.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // Statistics calculation
    const stats = {
        total: feedbacks.length,
        approved: feedbacks.filter(fb => fb.is_approved).length,
        pending: feedbacks.filter(fb => !fb.is_approved).length,
        avgRating: feedbacks.length > 0
            ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
            : 0
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <div className="relative">
                    <Loader2 className="w-12 h-12 text-[#900000] animate-spin" />
                    <div className="absolute inset-0 w-12 h-12 border-4 border-[#900000]/20 rounded-full animate-ping"
                        style={{ animationDuration: '1.5s' }} />
                </div>
                <p className="mt-4 text-gray-600 font-medium">Loading feedbacks...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar activeItem={activeItem} />

            <div style={{ marginLeft: '280px' }}>
                {/* Enhanced Header */}
                <header
                    className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 shadow-lg border-b border-gray-100"
                    style={{
                        height: '72px',
                        animation: 'slideInRight 0.5s ease-out both'
                    }}
                >
                    <div className="px-8 h-full flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#900000] to-[#700000] rounded-xl flex items-center justify-center mr-4 shadow-lg shadow-[#900000]/30">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">Feedback Moderation</h1>
                                <p className="text-xs text-gray-500">Manage customer testimonials</p>
                            </div>
                        </div>

                        {/* Quick Stats in Header */}
                        <div className="hidden lg:flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                                <div className="text-xs text-gray-500">Total</div>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                                <div className="text-xs text-gray-500">Approved</div>
                            </div>
                            <div className="w-px h-10 bg-gray-200" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                                <div className="text-xs text-gray-500">Pending</div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                            style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                        <MessageSquare className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.total}</div>
                                <div className="text-sm text-gray-500 font-medium">Total Feedback</div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-green-600" />
                                    </div>
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.approved}</div>
                                <div className="text-sm text-gray-500 font-medium">Approved</div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                                        <EyeOff className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mb-1">{stats.pending}</div>
                                <div className="text-sm text-gray-500 font-medium">Pending Review</div>
                            </div>

                            <div className="bg-gradient-to-br from-[#900000] to-[#700000] rounded-2xl p-6 shadow-lg shadow-[#900000]/30 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Star className="w-6 h-6 text-white fill-white" />
                                    </div>
                                    <Star className="w-5 h-5 text-white/80 fill-white/80" />
                                </div>
                                <div className="text-3xl font-bold mb-1">{stats.avgRating}</div>
                                <div className="text-sm text-white/90 font-medium">Average Rating</div>
                            </div>
                        </div>

                        {/* Search and Filter Section */}
                        <div
                            className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                            style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Manage Feedback</h2>
                                    <p className="text-sm text-gray-500">Review and moderate customer testimonials for the home page</p>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Search by name or review..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#900000] focus:border-[#900000] outline-none w-full md:w-72 transition-all bg-gray-50 focus:bg-white text-sm"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                                        <select
                                            value={filter}
                                            onChange={(e) => setFilter(e.target.value)}
                                            className="pl-11 pr-8 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#900000] focus:border-[#900000] transition-all font-medium text-gray-700 text-sm appearance-none cursor-pointer hover:bg-white"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                                                backgroundRepeat: 'no-repeat',
                                                backgroundPosition: 'right 0.75rem center',
                                                backgroundSize: '1.25em 1.25em'
                                            }}
                                        >
                                            <option value="all">All Feedback</option>
                                            <option value="approved">✓ Approved Only</option>
                                            <option value="pending">⏳ Pending Only</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Grid */}
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
                        >
                            {filteredFeedbacks.length > 0 ? (
                                filteredFeedbacks.map((fb, idx) => (
                                    <div
                                        key={fb.id}
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
                                        style={{ animation: `fadeInUp 0.5s ease-out ${0.4 + idx * 0.05}s both` }}
                                    >
                                        <div className="p-6">
                                            {/* Header with Avatar and Status */}
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-[#900000] to-[#700000] rounded-xl flex items-center justify-center text-white font-bold mr-3 text-lg shadow-lg shadow-[#900000]/30">
                                                        {fb.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 leading-none mb-2">{fb.name}</h3>
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${fb.is_approved
                                                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                                                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                                                    }`}>
                                                    {fb.is_approved ? '✓ Live' : '⏳ Pending'}
                                                </div>
                                            </div>

                                            {/* Review Text */}
                                            <div className="bg-gray-50 rounded-xl p-4 mb-4 min-h-[100px] border border-gray-100">
                                                <p className="text-gray-700 text-sm leading-relaxed italic">
                                                    "{fb.review}"
                                                </p>
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-center text-xs text-gray-500 mb-4 bg-gray-50 px-3 py-2 rounded-lg w-fit">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                                {new Date(fb.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 border-t border-gray-100 pt-4">
                                                {fb.is_approved ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(fb.id, false)}
                                                        disabled={actionLoading === fb.id}
                                                        className="flex-1 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl text-sm font-bold hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                    >
                                                        {actionLoading === fb.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <EyeOff className="w-4 h-4 mr-2" />
                                                                Hide
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(fb.id, true)}
                                                        disabled={actionLoading === fb.id}
                                                        className="flex-1 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                                    >
                                                        {actionLoading === fb.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                                Approve
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(fb.id)}
                                                    disabled={actionLoading === fb.id}
                                                    className="px-4 py-2.5 bg-gradient-to-r from-[#900000] to-[#700000] text-white rounded-xl hover:from-[#a00000] hover:to-[#800000] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {actionLoading === fb.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-500">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="text-xl font-bold text-gray-800 mb-2">No feedback found</p>
                                    <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
                                    {(searchTerm || filter !== 'all') && (
                                        <button
                                            onClick={() => {
                                                setSearchTerm('');
                                                setFilter('all');
                                            }}
                                            className="mt-4 px-6 py-2 bg-[#900000] text-white rounded-xl text-sm font-medium hover:bg-[#a00000] transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
};

export default AdminFeedback;