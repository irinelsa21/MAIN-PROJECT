import React, { useEffect, useState } from "react";
import {
  Assignment as AssignmentIcon, Dashboard, People, Bloodtype, LocalHospital, Campaign,
  HelpOutline, BarChart, Person, CheckCircle, Error, Close, CalendarToday, Edit, Delete,
  Add
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? '#4caf50' : '#f44336';
  const Icon = type === 'success' ? CheckCircle : Error;

  return (
    <div
      className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-white"
      style={{
        backgroundColor: bgColor,
        animation: 'slideInRight 0.3s ease-out',
        minWidth: '300px',
      }}
    >
      <Icon style={{ fontSize: 24 }} />
      <span className="font-semibold flex-1">{message}</span>
      <button
        onClick={onClose}
        className="hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-all"
      >
        <Close style={{ fontSize: 20 }} />
      </button>
    </div>
  );
};

const CustomAlert = ({ message, onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      <div
        className="bg-white rounded-2xl p-8 shadow-2xl"
        style={{
          maxWidth: '400px',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)' }}
          >
            <Error style={{ fontSize: 28, color: '#f44336' }} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Confirm Action</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-300"
            style={{
              backgroundColor: '#f5f5f5',
              color: '#666',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e0e0e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300"
            style={{
              backgroundColor: '#f44336',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d32f2f';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f44336';
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ announcement, onEdit, onDelete, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Blood Camp': return '#2196f3';
      case 'Emergency': return '#f44336';
      case 'Awareness': return '#4caf50';
      case 'General': return '#900000';
      default: return '#900000';
    }
  };

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
          background: `linear-gradient(135deg, ${getTypeColor(announcement.campaign_type)}10 0%, ${getTypeColor(announcement.campaign_type)}20 100%)`,
        }}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${getTypeColor(announcement.campaign_type)}20`,
                  color: getTypeColor(announcement.campaign_type),
                }}
              >
                {announcement.campaign_type}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <CalendarToday style={{ fontSize: 16, marginRight: 4 }} />
                {announcement.expiry_date}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {announcement.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {announcement.description}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onEdit(announcement)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300"
            style={{
              backgroundColor: 'rgba(144, 0, 0, 0.1)',
              color: '#900000',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#900000';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(144, 0, 0, 0.1)';
              e.currentTarget.style.color = '#900000';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Edit style={{ fontSize: 18 }} />
            Edit
          </button>
          <button
            onClick={() => onDelete(announcement.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300"
            style={{
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              color: '#f44336',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f44336';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
              e.currentTarget.style.color = '#f44336';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Delete style={{ fontSize: 18 }} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    campaign_type: "General",
    expiry_date: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [adminName] = useState('Irin');
  const [activeItem, setActiveItem] = useState('announcements');
  const [toast, setToast] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(null);

  const menuItems = [
    { id: 'dashboard', icon: Dashboard, label: 'Dashboard' },
    { id: 'users', icon: People, label: 'User Management' },
    { id: 'registration', icon: Person, label: 'Registration Requests' },
    { id: 'donors', icon: Bloodtype, label: 'Donor Management' },
    { id: 'requests', icon: LocalHospital, label: 'Blood Requests' },
    { id: 'assignments', icon: AssignmentIcon, label: 'Assignments' },
    { id: 'announcements', icon: Campaign, label: 'Announcements' },
    { id: 'queries', icon: HelpOutline, label: 'Queries Management' },
    { id: 'statistics', icon: BarChart, label: 'Statistics & Reports' },
  ];

  const showToast = (message, type) => {
    setToast({ message, type });
  };

  const fetchAnnouncements = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/announcements/all/");
    const data = await res.json();
    setAnnouncements(data);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.expiry_date) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const url = editingId
      ? `http://127.0.0.1:8000/api/announcements/update/${editingId}/`
      : "http://127.0.0.1:8000/api/announcements/create/";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    showToast(
      editingId ? 'Announcement updated successfully!' : 'Announcement published successfully!',
      'success'
    );

    setForm({ title: "", description: "", campaign_type: "General", expiry_date: "" });
    setEditingId(null);
    setShowForm(false);
    fetchAnnouncements();
  };

  const deleteAnnouncement = async (id) => {
    await fetch(`http://127.0.0.1:8000/api/announcements/delete/${id}/`, {
      method: "DELETE",
    });
    showToast('Announcement deleted successfully!', 'error');
    setShowDeleteAlert(null);
    fetchAnnouncements();
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setForm(announcement);
    setShowForm(true);
  };

  const handleMenuClick = (itemId) => {
    if (itemId === 'registration') {
      window.location.href = '/registration-requests';
    } else if (itemId === 'dashboard') {
      window.location.href = '/admin-dashboard';
    } else if (itemId === 'users') {
      window.location.href = '/user-management';
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
      setActiveItem(itemId);
      console.log(`Navigated to: ${itemId}`);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showDeleteAlert && (
        <CustomAlert
          message="Are you sure you want to delete this announcement? This action cannot be undone."
          onConfirm={() => deleteAnnouncement(showDeleteAlert)}
          onCancel={() => setShowDeleteAlert(null)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar activeItem={activeItem} onItemClick={handleMenuClick} adminName={adminName} />
      {/* Main Content Area */}
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
                <Campaign style={{ fontSize: 32, color: '#900000' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Announcements</h1>
              </div>

              <div className="flex items-center space-x-4">
                {!showForm && (
                  <button
                    onClick={() => {
                      setShowForm(true);
                      setEditingId(null);
                      setForm({ title: "", description: "", campaign_type: "General", expiry_date: "" });
                    }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: '#900000',
                      color: 'white',
                      boxShadow: '0 4px 12px rgba(144, 0, 0, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(144, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(144, 0, 0, 0.2)';
                    }}
                  >
                    <Add />
                    New Announcement
                  </button>
                )}

                {/* Notification button removed */}
              </div>
            </div>
          </div>
        </header>

        <main
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          {showForm && (
            <div
              className="bg-white rounded-2xl p-8 mb-8"
              style={{
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                animation: 'fadeInUp 0.4s ease-out',
              }}
            >
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>
                {editingId ? 'Edit Announcement' : 'Create New Announcement'}
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter announcement title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 outline-none transition-all duration-300"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Enter announcement description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 outline-none transition-all duration-300 resize-none"
                    style={{ fontSize: '16px' }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Campaign Type
                    </label>
                    <select
                      value={form.campaign_type}
                      onChange={e => setForm({ ...form, campaign_type: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 outline-none transition-all duration-300"
                      style={{ fontSize: '16px' }}
                    >
                      <option>Blood Camp</option>
                      <option>Emergency</option>
                      <option>Awareness</option>
                      <option>General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={form.expiry_date}
                      onChange={e => setForm({ ...form, expiry_date: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 outline-none transition-all duration-300"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-300"
                    style={{
                      backgroundColor: '#900000',
                      boxShadow: '0 4px 12px rgba(144, 0, 0, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(144, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(144, 0, 0, 0.2)';
                    }}
                  >
                    {editingId ? 'Update' : 'Publish'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm({ title: "", description: "", campaign_type: "General", expiry_date: "" });
                    }}
                    className="px-6 py-2.5 rounded-xl font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#e0e0e0';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="mb-6"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
            }}
          >
            <h2 className="text-3xl font-bold" style={{ color: '#1a1a1a' }}>
              All Announcements
            </h2>
            <p className="text-gray-600 mt-2">
              Manage and monitor all system announcements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {announcements.map((announcement, idx) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={handleEdit}
                onDelete={(id) => setShowDeleteAlert(id)}
                delay={0.4 + idx * 0.1}
              />
            ))}
          </div>

          {announcements.length === 0 && (
            <div
              className="text-center py-16"
              style={{
                animation: 'fadeInUp 0.6s ease-out',
              }}
            >
              <Campaign style={{ fontSize: 80, color: '#ddd', marginBottom: 16 }} />
              <p className="text-gray-500 text-lg">No announcements yet. Create your first one!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}