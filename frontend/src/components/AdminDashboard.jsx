import React, { useState, useEffect } from 'react';
import {
  People, Bloodtype, LocalHospital, Campaign, HelpOutline,
  TrendingUp, CheckCircle, Person, Assignment as AssignmentIcon,
  Warning, BarChart, RateReview
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';


const StatCard = ({ icon: Icon, label, value, trend, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(144, 0, 0, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${color}10 0%, ${color}20 100%)`,
        }}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          <p className="text-4xl font-bold" style={{ color }}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp style={{ fontSize: 16, color: '#4caf50', marginRight: 4 }} />
              <span style={{ color: '#4caf50' }}>{trend}</span>
            </div>
          )}
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

      {/* Corner decoration */}
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

const QuickActionCard = ({ icon: Icon, title, description, count, status, delay, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'urgent': return '#f44336';
      case 'pending': return '#ff9800';
      case 'active': return '#4caf50';
      default: return '#900000';
    }
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-white rounded-2xl p-6 cursor-pointer transition-all duration-300 overflow-hidden group"
      style={{
        transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(144, 0, 0, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(144, 0, 0, 0.05) 0%, rgba(144, 0, 0, 0.1) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: isHovered ? '#900000' : 'rgba(144, 0, 0, 0.1)',
              transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
            }}
          >
            <Icon
              style={{
                fontSize: 28,
                color: isHovered ? 'white' : '#900000',
                transition: 'color 0.3s',
              }}
            />
          </div>

          {count !== undefined && count !== null && (
            <div
              className="px-3 py-1 rounded-full text-sm font-bold"
              style={{
                backgroundColor: `${getStatusColor()}20`,
                color: getStatusColor(),
              }}
            >
              {count}
            </div>
          )}
        </div>

        <h3
          className="text-xl font-bold mb-2 transition-colors duration-300"
          style={{ color: isHovered ? '#900000' : '#1a1a1a' }}
        >
          {title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>

        {/* Animated arrow */}
        <div
          className="mt-4 flex items-center text-sm font-semibold transition-all duration-300"
          style={{
            color: '#900000',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateX(0)' : 'translateX(-10px)',
          }}
        >
          Manage →
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [adminName] = useState('Irin');
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/admin/statistics/')
      .then(res => res.json())
      .then(data => {
        setStatsData(data); // Save the full object
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      icon: People,
      label: 'Approved Users',
      value: statsData?.summary?.approvedUsers || '0',
      color: '#900000',
    },
    {
      icon: Bloodtype,
      label: 'Approved Donors',
      value: statsData?.summary?.approvedDonors || '0',
      color: '#d32f2f',
    },
    {
      icon: LocalHospital,
      label: 'Blood Requests',
      value: statsData?.summary?.totalRequests || '0',
      color: '#ff9800',
    },
    {
      icon: CheckCircle,
      label: 'Total Matches',
      value: statsData?.summary?.totalAssignments || '0',
      color: '#4caf50',
    },
  ];

  const quickActions = [
    {
      icon: Person,
      title: 'Registration Requests',
      description: 'Review and approve pending user registrations',
      count: statsData?.pendingCounts?.registration || '0',
      status: 'pending',
      onClick: () => window.location.href = '/registration-requests',
    },
    {
      icon: People,
      title: 'User Management',
      description: 'View, edit, and manage all registered users',
      count: statsData?.summary?.approvedUsers || '0',
      status: 'active',
      onClick: () => window.location.href = '/user-management',
    },
    {
      icon: Bloodtype,
      title: 'Donor Management',
      description: 'Manage donor profiles and donation schedules',
      count: statsData?.summary?.approvedDonors || '0',
      status: 'active',
      onClick: () => window.location.href = '/admin-donor-management',
    },
    {
      icon: LocalHospital,
      title: 'Blood Requests',
      description: 'Review and process urgent blood requests',
      count: statsData?.pendingCounts?.requests || '0',
      status: 'urgent',
      onClick: () => window.location.href = '/admin-blood-requests',
    },
    {
      icon: AssignmentIcon,
      title: 'Donor Assignments',
      description: 'View history of all donor-patient matches',
      count: statsData?.summary?.totalAssignments || '0',
      status: 'active',
      onClick: () => window.location.href = '/admin-assignments',
    },
    {
      icon: Campaign,
      title: 'Announcements',
      description: 'Create and manage system announcements',
      count: statsData?.summary?.totalAnnouncements || '0',
      status: 'pending',
      onClick: () => window.location.href = '/admin-announcements',
    },
    {
      icon: HelpOutline,
      title: 'Queries Management',
      description: 'Respond to user queries and support tickets',
      count: statsData?.pendingCounts?.queries || '0',
      status: 'pending',
      onClick: () => window.location.href = '/admin-help-support',
    },
    {
      icon: BarChart,
      title: 'Statistics & Reports',
      description: 'View detailed analytics and generate reports',
      status: 'active',
      onClick: () => window.location.href = '/admin-statistics',
    },
    {
      icon: RateReview,
      title: 'Manage Feedback',
      description: 'Review and moderate customer testimonials',
      count: statsData?.pendingCounts?.feedbacks || '0',
      status: 'pending',
      onClick: () => window.location.href = '/admin-feedbacks',
    },
  ];

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'user': return { icon: People, color: '#900000' };
      case 'request': return { icon: LocalHospital, color: '#ff9800' };
      case 'assignment': return { icon: CheckCircle, color: '#4caf50' };
      case 'announcement': return { icon: Campaign, color: '#2196f3' };
      case 'feedback': return { icon: RateReview, color: '#e91e63' };
      default: return { icon: AssignmentIcon, color: '#666' };
    }
  };

  const recentActivity = (statsData?.recentActivities || []).map(act => {
    const { icon, color } = getIconForType(act.type);
    return {
      icon,
      text: act.text,
      time: timeAgo(act.time),
      color
    };
  });

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    if (itemId === 'registration') {
      window.location.href = '/registration-requests';
    } else if (itemId === 'users') {
      window.location.href = '/user-management';
    } else if (itemId === 'announcements') {
      window.location.href = '/admin-announcements';
    } else if (itemId === 'queries') {
      window.location.href = '/admin-help-support';
    } else if (itemId === 'donors') {
      window.location.href = '/admin-donor-management';
    } else if (itemId === 'requests') {
      window.location.href = '/admin-blood-requests';
    } else if (itemId === 'assignments') {
      window.location.href = '/admin-assignments';
    } else if (itemId === 'statistics') {
      window.location.href = '/admin-statistics';
    }
    else {
      console.log(`Navigated to: ${itemId}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <AdminSidebar activeItem={activeItem} adminName={adminName} />

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px' }}>
        {/* Header */}
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
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Admin Dashboard</h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notification button removed */}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          {/* Welcome Section */}
          <div
            className="mb-10"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
            }}
          >
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
              Welcome Back, {adminName}! 👋
            </h2>
            <p className="text-gray-600 text-lg">
              Here's what's happening with your blood donation system today.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                trend={stat.trend}
                color={stat.color}
                delay={0.4 + idx * 0.1}
              />
            ))}
          </div>

          {/* Quick Actions Grid */}
          <div className="mb-10">
            <h3
              className="text-2xl font-bold mb-6"
              style={{
                color: '#1a1a1a',
                animation: 'fadeInUp 0.6s ease-out 0.8s both',
              }}
            >
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, idx) => (
                <QuickActionCard
                  key={idx}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  count={action.count}
                  status={action.status}
                  delay={0.9 + idx * 0.1}
                  onClick={action.onClick}
                />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              animation: 'fadeInUp 0.6s ease-out 1.5s both',
            }}
          >
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-gray-50"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${activity.color}15` }}
                  >
                    <activity.icon style={{ fontSize: 20, color: activity.color }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">{activity.text}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;