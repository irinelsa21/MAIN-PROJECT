import React, { useState, useEffect } from 'react';
import {
  Map, Assignment as AssignmentIcon, Bloodtype, LocalHospital, People, Person,
  CheckCircle, Cancel, Schedule, Phone, Email, LocationOn, Description,
  FilterList, Search, Close, TrendingUp
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';


const StatCard = ({ icon: Icon, label, value, color, delay }) => {
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
    </div>
  );
};

const DonorCard = ({ donor, onUpdateStatus, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    PENDING: { color: '#ff9800', bg: '#fff3e0', label: 'Pending Review' },
    APPROVED: { color: '#4caf50', bg: '#e8f5e9', label: 'Approved' },
    REJECTED: { color: '#f44336', bg: '#ffebee', label: 'Rejected' },
  };

  const config = statusConfig[donor.status] || statusConfig.PENDING;

  const availableDistrictsArray = donor.available_districts
    ? donor.available_districts.split(',').map(d => d.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all duration-300 relative group"
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(144, 0, 0, 0.15)'
          : '0 4px 12px rgba(0, 0, 0, 0.08)',
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Banner */}
      <div
        className="px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: config.bg }}
      >
        <div className="flex items-center space-x-2">
          {donor.status === 'APPROVED' && <CheckCircle style={{ fontSize: 20, color: config.color }} />}
          {donor.status === 'REJECTED' && <Cancel style={{ fontSize: 20, color: config.color }} />}
          {donor.status === 'PENDING' && <Schedule style={{ fontSize: 20, color: config.color }} />}
          <span className="font-semibold" style={{ color: config.color }}>
            {config.label}
          </span>
        </div>
        <div
          className="px-3 py-1 rounded-full text-sm font-bold"
          style={{
            backgroundColor: 'white',
            color: config.color,
          }}
        >
          {donor.blood_group}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{donor.name}</h3>
            <p className="text-gray-600 text-sm">{donor.gender}</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <Phone style={{ fontSize: 18, color: '#900000' }} />
            <span className="text-sm">{donor.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Email style={{ fontSize: 18, color: '#900000' }} />
            <span className="text-sm">{donor.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <LocationOn style={{ fontSize: 18, color: '#900000' }} />
            <span className="text-sm">{donor.district}</span>
          </div>
        </div>

        {/* Available Districts Section */}
        {availableDistrictsArray.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Map style={{ fontSize: 18, color: '#900000' }} />
              <span className="text-sm font-semibold text-gray-900">
                Can Donate Blood At These Locations:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableDistrictsArray.map((district, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(144, 0, 0, 0.1)',
                    color: '#900000',
                  }}
                >
                  {district}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Document Link */}
        {donor.confirmation_file && (
          <div className="mb-4">
            <a
              href={`http://127.0.0.1:8000${donor.confirmation_file}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-sm font-medium transition-colors duration-200"
              style={{ color: '#900000' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#d32f2f'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#900000'}
            >
              <Description style={{ fontSize: 18 }} />
              <span>View Uploaded Document</span>
            </a>
          </div>
        )}

        {/* Action Buttons */}
        {donor.status === 'PENDING' && (
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => onUpdateStatus(donor.id, 'APPROVED')}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300"
              style={{ backgroundColor: '#4caf50' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#45a049';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#4caf50';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <CheckCircle style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
              Approve
            </button>
            <button
              onClick={() => onUpdateStatus(donor.id, 'REJECTED')}
              className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300"
              style={{ backgroundColor: '#f44336' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#da190b';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f44336';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Cancel style={{ fontSize: 18, marginRight: 8, verticalAlign: 'middle' }} />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminDonorManagement() {
  const [activeItem, setActiveItem] = useState('donors');
  const [adminName] = useState('Irin');
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // FETCH DONORS
  const fetchDonors = () => {
    fetch("http://127.0.0.1:8000/api/admin/donors/")
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setFilteredDonors(data);
      });
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  // FILTER AND SEARCH
  useEffect(() => {
    let filtered = donors;

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.phone.includes(searchTerm) ||
        d.blood_group.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDonors(filtered);
  }, [donors, statusFilter, searchTerm]);

  // UPDATE STATUS
  const updateStatus = (id, status) => {
    fetch(`http://127.0.0.1:8000/api/admin/donor-status/${id}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(() => fetchDonors());
  };

  const handleMenuClick = (itemId) => {
    setActiveItem(itemId);
    if (itemId === 'dashboard') {
      window.location.href = '/admin-dashboard';
    } else if (itemId === 'registration') {
      window.location.href = '/registration-requests';
    } else if (itemId === 'users') {
      window.location.href = '/user-management';
    } else if (itemId === 'announcements') {
      window.location.href = '/admin-announcements';
    } else if (itemId === 'queries') {
      window.location.href = '/admin-help-support';
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

  const stats = [
    {
      icon: People,
      label: 'Total Donors',
      value: donors.length.toString(),
      color: '#900000',
    },
    {
      icon: Schedule,
      label: 'Pending',
      value: donors.filter(d => d.status === 'PENDING').length.toString(),
      color: '#ff9800',
    },
    {
      icon: CheckCircle,
      label: 'Approved',
      value: donors.filter(d => d.status === 'APPROVED').length.toString(),
      color: '#4caf50',
    },
    {
      icon: Cancel,
      label: 'Rejected',
      value: donors.filter(d => d.status === 'REJECTED').length.toString(),
      color: '#f44336',
    },
  ];

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
                <Bloodtype style={{ fontSize: 28, color: '#900000' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Donor Management</h1>
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
                delay={0.3 + idx * 0.1}
              />
            ))}
          </div>

          {/* Filters Section */}
          <div
            className="bg-white rounded-2xl p-6 mb-8"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              animation: 'fadeInUp 0.6s ease-out 0.7s both',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search Bar */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search
                    style={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#900000',
                      fontSize: 20,
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, blood group, or district..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                    style={{ fontSize: 14 }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      style={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      <Close style={{ fontSize: 20, color: '#666' }} />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-3">
                <FilterList style={{ fontSize: 20, color: '#900000' }} />
                <div className="flex space-x-2">
                  {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300"
                      style={{
                        backgroundColor: statusFilter === status ? '#900000' : 'transparent',
                        color: statusFilter === status ? 'white' : '#666',
                        border: `2px solid ${statusFilter === status ? '#900000' : '#e0e0e0'}`,
                      }}
                    >
                      {status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Showing <span className="font-bold text-gray-900">{filteredDonors.length}</span> of{' '}
                <span className="font-bold text-gray-900">{donors.length}</span> donors
              </p>
            </div>
          </div>

          {/* Donors Grid */}
          {filteredDonors.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-12 text-center"
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                animation: 'fadeInUp 0.6s ease-out 0.9s both',
              }}
            >
              <Bloodtype style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Donors Found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'ALL'
                  ? 'Try adjusting your filters or search term'
                  : 'No donor requests available at the moment'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor, idx) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  onUpdateStatus={updateStatus}
                  delay={0.9 + idx * 0.05}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}