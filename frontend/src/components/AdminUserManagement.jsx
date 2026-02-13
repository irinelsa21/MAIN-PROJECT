import React, { useEffect, useState } from "react";
import {
  Download, Edit, Visibility, Assignment as AssignmentIcon,
  People, Bloodtype, Wc, Person, Email, Phone, Cake, LocationOn, Home, Delete, Search, FilterList, TrendingUp
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
          background: `radial - gradient(circle, ${color}10 0 %, transparent 70 %)`,
          transform: isHovered ? 'scale(1.5) translate(-10px, 10px)' : 'scale(1)',
        }}
      />
    </div>
  );
};

const UserCard = ({ user, deleteUser, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setIsDeleting(true);
    await deleteUser(user.id);
    setIsDeleting(false);
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl p-6 transition-all duration-300 relative overflow-hidden group"
        style={{
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered
            ? '0 12px 28px rgba(144, 0, 0, 0.12)'
            : '0 4px 12px rgba(0, 0, 0, 0.08)',
          animation: `fadeInUp 0.4s ease - out ${delay}s both`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Profile Picture */}
          <div
            className="relative flex-shrink-0"
            style={{
              transition: 'all 0.3s',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {user.profile_picture ? (
              <img
                src={`http://127.0.0.1:8000${user.profile_picture}`}
                alt={user.name}
                className="rounded-xl"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  border: '3px solid rgba(144, 0, 0, 0.1)',
                }}
              />
            ) : (
              <div
                className="rounded-xl flex items-center justify-center"
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'rgba(144, 0, 0, 0.1)',
                  border: '3px solid rgba(144, 0, 0, 0.1)',
                }}
              >
                <Person style={{ fontSize: 48, color: 'rgba(144, 0, 0, 0.3)' }} />
              </div>
            )}
            <div
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: '#4caf50',
                border: '2px solid white',
              }}
            >
              <Bloodtype style={{ fontSize: 16, color: 'white' }} />
            </div>
          </div >

          {/* User Info */}
          < div className="flex-1" >
            <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold mb-2"
              style={{ backgroundColor: 'rgba(144, 0, 0, 0.1)', color: '#900000' }}
            >
              <Bloodtype style={{ fontSize: 16, marginRight: 4 }} />
              {user.blood_group}
            </div>
          </div >

          {/* Action Buttons */}
          < div className="flex gap-2" >
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: showDetails ? '#900000' : 'rgba(144, 0, 0, 0.1)',
                color: showDetails ? 'white' : '#900000',
              }}
            >
              <Visibility style={{ fontSize: 20 }} />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: isDeleting ? '#ccc' : 'rgba(244, 67, 54, 0.1)',
                color: isDeleting ? '#999' : '#f44336',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
              }}
            >
              <Delete style={{ fontSize: 20 }} />
            </button>
          </div >
        </div >

        {/* Quick Info */}
        < div className="grid grid-cols-2 gap-3 mb-4" >
          <div className="flex items-center space-x-2">
            <Email style={{ fontSize: 16, color: '#666' }} />
            <span className="text-sm text-gray-600 truncate">{user.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone style={{ fontSize: 16, color: '#666' }} />
            <span className="text-sm text-gray-600">{user.phone}</span>
          </div>
        </div >

        {/* Expandable Details */}
        {
          showDetails && (
            <div
              className="mt-4 pt-4 border-t border-gray-100 space-y-3"
              style={{
                animation: 'fadeInUp 0.3s ease-out',
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-2">
                  <Cake style={{ fontSize: 18, color: '#666', marginTop: 2 }} />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm text-gray-900 font-medium">{user.dob}</p>
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

                <div className="flex items-start space-x-2">
                  <Bloodtype style={{ fontSize: 18, color: '#900000', marginTop: 2 }} />
                  <div>
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <p className="text-sm font-bold" style={{ color: '#900000' }}>{user.blood_group}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Home style={{ fontSize: 18, color: '#666', marginTop: 2 }} />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-900 font-medium">{user.address}</p>
                </div>
              </div>
            </div>
          )
        }
      </div >

      {/* Custom Delete Confirmation Modal */}
      {
        showDeleteModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              animation: 'fadeIn 0.2s ease-out',
            }}
            onClick={() => setShowDeleteModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md mx-4"
              style={{
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                animation: 'scaleIn 0.3s ease-out',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Warning Icon */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                  }}
                >
                  <Delete style={{ fontSize: 32, color: '#f44336' }} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-center mb-3" style={{ color: '#1a1a1a' }}>
                Delete User?
              </h3>

              {/* Message */}
              <p className="text-center text-gray-600 mb-2">
                Are you sure you want to delete
              </p>
              <p className="text-center font-bold mb-6" style={{ color: '#900000' }}>
                {user.name}?
              </p>
              <p className="text-center text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: '#f5f5f5',
                    color: '#666',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [activeItem] = useState('users');
  const [adminName] = useState('Irin');

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/approved-users/");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/delete-user/${id}/`, {
      method: "DELETE",
    });
    fetchUsers();
  };

  const handleMenuClick = (itemId) => {
    if (itemId === 'registration') {
      window.location.href = '/registration-requests';
    } else if (itemId === 'dashboard') {
      window.location.href = '/admin-dashboard';
    } else if (itemId === 'announcements') {
      window.location.href = '/admin-announcements';
    }
    else if (itemId === 'queries') {
      window.location.href = '/admin-help-support';
    }
    else if (itemId === 'donors') {
      window.location.href = '/admin-donor-management';
    }
    else if (itemId === 'requests') {
      window.location.href = '/admin-blood-requests';
    }
    else if (itemId === 'assignments') {
      window.location.href = '/admin-assignments';
    }
    else if (itemId === 'statistics') {
      window.location.href = '/admin-statistics';
    }
    else {
      console.log(`Navigated to: ${itemId}`);
    }
  };

  const bloodGroups = ["all", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBloodGroup = filterBloodGroup === "all" || user.blood_group === filterBloodGroup;

    return matchesSearch && matchesBloodGroup;
  });

  const bloodGroupCounts = bloodGroups.slice(1).reduce((acc, bg) => {
    acc[bg] = users.filter(u => u.blood_group === bg).length;
    return acc;
  }, {});

  const stats = [
    {
      icon: People,
      label: 'Total Users',
      value: users.length,
      color: '#900000',
      trend: '+12%'
    },
    {
      icon: Bloodtype,
      label: 'Blood Groups',
      value: Object.keys(bloodGroupCounts).length,
      color: '#d32f2f',
    },
    {
      icon: Wc,
      label: 'Male Donors',
      value: users.filter(u => u.gender === 'Male').length,
      color: '#4caf50',
    },
    {
      icon: Wc,
      label: 'Female Donors',
      value: users.filter(u => u.gender === 'Female').length,
      color: '#ff4081',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <AdminSidebar activeItem={activeItem} adminName={adminName} />

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
                  <People style={{ fontSize: 24, color: '#900000' }} />
                </div>
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  User Management
                </h1>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.open('http://127.0.0.1:8000/api/admin/download-users/', '_blank')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{ backgroundColor: '#f5f5f5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e0e0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                >
                  <Download style={{ fontSize: 22, color: '#666' }} titleAccess="Download PDF Report" />
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
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1">
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
                  placeholder="Search by name, email, phone, or district..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-900 transition-colors"
                  style={{ paddingLeft: '40px' }}
                />
              </div>

              {/* Blood Group Filter */}
              <div className="flex items-center gap-2">
                <FilterList style={{ color: '#666', fontSize: 20 }} />
                <select
                  value={filterBloodGroup}
                  onChange={(e) => setFilterBloodGroup(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-900 transition-colors"
                  style={{ minWidth: '150px' }}
                >
                  {bloodGroups.map(bg => (
                    <option key={bg} value={bg}>
                      {bg === 'all' ? 'All Blood Groups' : bg}
                    </option>
                  ))}
                </select>
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
              <People style={{ fontSize: 64, color: '#ccc', marginBottom: 16 }} />
              <p className="text-xl text-gray-600">
                No users found
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
                  deleteUser={deleteUser}
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