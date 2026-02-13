import React, { useEffect, useState } from "react";
import {
  Assignment as AssignmentIcon, People, Person, CheckCircle, Cancel, HourglassEmpty,
  Email, Cake, Wc, LocationOn, Schedule, Search, FilterList, TrendingUp, Download, Bloodtype
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';


const StatCard = ({ icon: Icon, label, value, color, trend, delay }) => {
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

const UserCard = ({ user, activeTab, updateStatus, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAction = async (action) => {
    setIsProcessing(true);
    await updateStatus(user.id, action);
    setIsProcessing(false);
  };

  const getStatusBadge = () => {
    const styles = {
      PENDING: { bg: '#ff980020', color: '#ff9800', icon: HourglassEmpty },
      APPROVED: { bg: '#4caf5020', color: '#4caf50', icon: CheckCircle },
      REJECTED: { bg: '#f4433620', color: '#f44336', icon: Cancel },
    };
    const config = styles[user.status];
    const StatusIcon = config.icon;

    return (
      <div
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold"
        style={{ backgroundColor: config.bg, color: config.color }}
      >
        <StatusIcon style={{ fontSize: 16, marginRight: 4 }} />
        {user.status}
      </div>
    );
  };

  return (
    <div
      className="bg-white rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 28px rgba(144, 0, 0, 0.12)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        animation: `fadeInUp 0.4s ease-out ${delay}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(144, 0, 0, 0.1)',
              transition: 'all 0.3s',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <Person style={{ fontSize: 24, color: '#900000' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            {getStatusBadge()}
          </div>
        </div>
      </div>

      {/* User Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-start space-x-2">
          <Email style={{ fontSize: 18, color: '#666', marginTop: 2 }} />
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm text-gray-900 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Bloodtype style={{ fontSize: 18, color: '#900000', marginTop: 2 }} />
          <div>
            <p className="text-xs text-gray-500">Blood Group</p>
            <p className="text-sm font-bold" style={{ color: '#900000' }}>{user.blood_group}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Wc style={{ fontSize: 18, color: '#666', marginTop: 2 }} />
          <div>
            <p className="text-xs text-gray-500">Gender</p>
            <p className="text-sm text-gray-900 font-medium">{user.gender}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <LocationOn style={{ fontSize: 18, color: '#666', marginTop: 2 }} />
          <div>
            <p className="text-xs text-gray-500">District</p>
            <p className="text-sm text-gray-900 font-medium">{user.district}</p>
          </div>
        </div>

        <div className="col-span-2 flex items-start space-x-2">
          <Schedule style={{ fontSize: 18, color: '#666', marginTop: 2 }} />
          <div>
            <p className="text-xs text-gray-500">Requested At</p>
            <p className="text-sm text-gray-900 font-medium">
              {new Date(user.requested_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Only for Pending */}
      {activeTab === "PENDING" && (
        <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => handleAction("approve")}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all duration-300"
            style={{
              backgroundColor: isProcessing ? '#ccc' : '#4caf50',
              color: 'white',
              transform: isHovered && !isProcessing ? 'scale(1.02)' : 'scale(1)',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) e.currentTarget.style.backgroundColor = '#45a049';
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) e.currentTarget.style.backgroundColor = '#4caf50';
            }}
          >
            <CheckCircle style={{ fontSize: 20 }} />
            <span>{isProcessing ? 'Processing...' : 'Approve'}</span>
          </button>

          <button
            onClick={() => handleAction("reject")}
            disabled={isProcessing}
            className="flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold transition-all duration-300"
            style={{
              backgroundColor: isProcessing ? '#ccc' : '#f44336',
              color: 'white',
              transform: isHovered && !isProcessing ? 'scale(1.02)' : 'scale(1)',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) e.currentTarget.style.backgroundColor = '#e53935';
            }}
            onMouseLeave={(e) => {
              if (!isProcessing) e.currentTarget.style.backgroundColor = '#f44336';
            }}
          >
            <Cancel style={{ fontSize: 20 }} />
            <span>{isProcessing ? 'Processing...' : 'Reject'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function RegistrationRequests() {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("PENDING");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeItem] = useState('registration');
  const [adminName] = useState('Irin');

  const fetchUsers = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/registration-requests/");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (id, action) => {
    await fetch(`http://127.0.0.1:8000/api/update-user-status/${id}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    // 🔥 always re-fetch from DB
    fetchUsers();
  };

  const handleMenuClick = (itemId) => {
    if (itemId === 'users') {
      window.location.href = '/user-management';
    } else if (itemId === 'dashboard') {
      window.location.href = '/admin-dashboard';
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
    } else {
      console.log(`Navigated to: ${itemId}`);
    }
  };

  const filteredUsers = users
    .filter(u => u.status === activeTab)
    .filter(u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = [
    {
      icon: HourglassEmpty,
      label: 'Pending Requests',
      value: users.filter(u => u.status === 'PENDING').length,
      color: '#ff9800',
      trend: '+12%'
    },
    {
      icon: CheckCircle,
      label: 'Approved',
      value: users.filter(u => u.status === 'APPROVED').length,
      color: '#4caf50',
      trend: '+8%'
    },
    {
      icon: Cancel,
      label: 'Rejected',
      value: users.filter(u => u.status === 'REJECTED').length,
      color: '#f44336',
    },
    {
      icon: People,
      label: 'Total Requests',
      value: users.length,
      color: '#900000',
      trend: '+17%'
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <AdminSidebar
        activeItem={activeItem}
        adminName={adminName}
      />

      {/* Main Content */}
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
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(144, 0, 0, 0.1)' }}
                >
                  <Person style={{ fontSize: 24, color: '#900000' }} />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  Registration Requests
                </h1>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: '#f5f5f5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  <Download style={{ fontSize: 22, color: '#666' }} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                trend={stat.trend}
                delay={0.3 + idx * 0.1}
              />
            ))}
          </div>

          {/* Search and Filters */}
          <div
            className="bg-white rounded-2xl p-6 mb-6"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              animation: 'fadeInUp 0.5s ease-out 0.7s both',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#666',
                    fontSize: 20
                  }}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or blood group..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-900 transition-colors"
                  style={{ paddingLeft: '40px' }}
                />
              </div>

              {/* Tabs */}
              <div className="flex space-x-2">
                {["PENDING", "APPROVED", "REJECTED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className="px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: activeTab === status ? '#900000' : '#f5f5f5',
                      color: activeTab === status ? 'white' : '#666',
                      transform: activeTab === status ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: activeTab === status ? '0 4px 12px rgba(144, 0, 0, 0.2)' : 'none',
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Cards */}
          {filteredUsers.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-12 text-center"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                animation: 'fadeInUp 0.5s ease-out 0.8s both',
              }}
            >
              <FilterList style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
              <p className="text-xl text-gray-600">
                No {activeTab.toLowerCase()} requests found
              </p>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredUsers.map((user, idx) => (
                <UserCard
                  key={user.id}
                  user={user}
                  activeTab={activeTab}
                  updateStatus={updateStatus}
                  delay={0.8 + idx * 0.05}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}