import React, { useState, useEffect } from 'react';
import {
    Group, Dashboard, LocalHospital, Bloodtype, People, Assignment, Campaign, TrendingUp, Help,
    BarChart as BarChartIcon, PieChart as PieChartIcon
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Area,
    AreaChart
} from 'recharts';


const StatCard = ({ title, value, icon: Icon, color, gradient }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="bg-white rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
            style={{
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: isHovered
                    ? '0 20px 40px rgba(144, 0, 0, 0.15)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                    background: `linear-gradient(135deg, ${color}10 0%, ${color}20 100%)`,
                }}
            />

            <div className="relative z-10 flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm mb-2">{title}</p>
                    <p className="text-4xl font-bold" style={{ color }}>
                        {value}
                    </p>
                </div>

                <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                    style={{
                        backgroundColor: isHovered ? color : `${color}15`,
                        transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
                    }}
                >
                    <Icon
                        style={{
                            fontSize: 28,
                            color: isHovered ? 'white' : color,
                            transition: 'color 0.3s',
                        }}
                    />
                </div>
            </div>

            <div
                className="absolute bottom-0 left-0 w-24 h-24 rounded-full transition-all duration-500"
                style={{
                    background: `radial-gradient(circle, ${color}10 0%, transparent 70%)`,
                    transform: isHovered ? 'scale(1.5) translate(-10px, 10px)' : 'scale(1)',
                }}
            />
        </div>
    );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-gray-200">
                <p className="text-sm font-bold text-gray-900 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2 mb-1">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-xs font-semibold text-gray-600">{entry.name}:</span>
                        <span className="text-sm font-bold" style={{ color: entry.color }}>{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function AdminStatistics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeItem] = useState('statistics');

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/admin/statistics/')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleMenuClick = (itemId) => {
        const routes = {
            'dashboard': '/admin-dashboard',
            'blood-requests': '/admin-blood-requests',
            'donor-management': '/admin-donor-management',
            'user-management': '/admin-user-management',
            'assignments': '/admin-assignments',
            'registration-requests': '/registration-requests',
            'announcements': '/admin-announcement',
            'help-support': '/admin-help-support',
            'statistics': '/admin-statistics'
        };
        if (routes[itemId]) window.location.href = routes[itemId];
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-gray-300 border-t-red-900 rounded-full animate-spin mb-4" />
                <p className="text-gray-600 font-semibold">Aggregating Statistics...</p>
            </div>
        </div>
    );

    if (!data) return <div className="p-12 text-center text-red-600 font-bold">Failed to load statistics</div>;

    const COLORS = ['#7f0d0d', '#1e293b', '#dc2626', '#475569', '#ef4444', '#94a3b8'];

    const formattedFulfillment = data.fulfillmentStatus.map(item => ({
        ...item,
        status: item.is_fulfilled ? 'Fulfilled' : 'Pending'
    }));

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
            <AdminSidebar activeItem={activeItem} />

            <div style={{ marginLeft: '280px' }}>
                <header
                    className="sticky top-0 z-40 bg-white"
                    style={{
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                        animation: 'slideInRight 0.5s ease-out both',
                        height: '64px',
                    }}
                >
                    <div className="px-6 sm:px-8 lg:px-12 h-full">
                        <div className="flex justify-between items-center h-full">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'rgba(144, 0, 0, 0.1)' }}
                                >
                                    <BarChartIcon style={{ fontSize: 24, color: '#900000' }} />
                                </div>
                                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                                    System Statistics
                                </h1>
                            </div>
                        </div>
                    </div>
                </header>

                <main
                    className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
                >
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 stats-grid">
                        <StatCard
                            title="Approved Users"
                            value={data.summary.approvedUsers}
                            icon={People}
                            color="#900000"
                        />
                        <StatCard
                            title="Approved Donors"
                            value={data.summary.approvedDonors}
                            icon={Group}
                            color="#d32f2f"
                        />
                        <StatCard
                            title="Total Requests"
                            value={data.summary.totalRequests}
                            icon={LocalHospital}
                            color="#4caf50"
                        />
                        <StatCard
                            title="Total Matches"
                            value={data.summary.totalAssignments}
                            icon={Assignment}
                            color="#2196f3"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Growth Analytics */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 chart-card">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <TrendingUp style={{ color: '#900000' }} />
                                    <h3 className="text-lg font-bold text-gray-900 border-l-4 border-red-900 pl-3">Growth Analytics</h3>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={data.registrationTrends}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#1e293b" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorDonors" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#900000" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#900000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#666' }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#666' }}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="users"
                                            stroke="#1e293b"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorUsers)"
                                            name="New Users"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="donors"
                                            stroke="#900000"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorDonors)"
                                            name="New Donors"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Fulfillment Status */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 chart-card">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <PieChartIcon style={{ color: '#900000' }} />
                                    <h3 className="text-lg font-bold text-gray-900 border-l-4 border-red-900 pl-3">Request Fulfillment</h3>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={formattedFulfillment}
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="count"
                                            nameKey="status"
                                        >
                                            {formattedFulfillment.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Blood Type Matrix */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2 chart-card">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Bloodtype style={{ color: '#900000' }} />
                                    <h3 className="text-lg font-bold text-gray-900 border-l-4 border-red-900 pl-3">Blood Type Matrix</h3>
                                </div>
                            </div>
                            <div style={{ width: '100%', height: 400 }}>
                                <ResponsiveContainer>
                                    <BarChart data={data.bloodGroupDistribution.donors}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="blood_group"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#666' }}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fontSize: 12, fill: '#666' }}
                                        />
                                        <Tooltip cursor={{ fill: 'rgba(144, 0, 0, 0.05)' }} content={<CustomTooltip />} />
                                        <Bar
                                            dataKey="count"
                                            fill="#900000"
                                            radius={[8, 8, 0, 0]}
                                            barSize={50}
                                            name="Donors"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}