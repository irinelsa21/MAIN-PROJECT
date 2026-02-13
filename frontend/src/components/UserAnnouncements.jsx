import React, { useState, useEffect } from 'react';
import {
  Bloodtype,
  LocalHospital,
  CheckCircle,
  Campaign,
  History,
  Person,
  Warning,
  Event,
  AccessTime,
  LocationOn,
  Info,
  LightbulbOutlined,
  ErrorOutline,
  Announcement
} from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';


const AnnouncementCard = ({ announcement, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getTypeConfig = (type) => {
    const configs = {
      'Emergency': {
        icon: Warning,
        color: '#d32f2f',
        bgGradient: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
        lightBg: 'rgba(211, 47, 47, 0.05)',
        borderColor: '#d32f2f',
      },
      'Blood Camp': {
        icon: Bloodtype,
        color: '#900000',
        bgGradient: 'linear-gradient(135deg, #900000 0%, #b71c1c 100%)',
        lightBg: 'rgba(144, 0, 0, 0.05)',
        borderColor: '#900000',
      },
      'Awareness': {
        icon: LightbulbOutlined,
        color: '#1976d2',
        bgGradient: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        lightBg: 'rgba(25, 118, 210, 0.05)',
        borderColor: '#1976d2',
      },
      'General': {
        icon: Announcement,
        color: '#689f38',
        bgGradient: 'linear-gradient(135deg, #689f38 0%, #8bc34a 100%)',
        lightBg: 'rgba(104, 159, 56, 0.05)',
        borderColor: '#689f38',
      },
    };
    return configs[type] || configs['General'];
  };

  const isExpired = () => {
    const today = new Date();
    const expiryDate = new Date(announcement.expiry_date);
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  const config = getTypeConfig(announcement.campaign_type);
  const Icon = config.icon;
  const expired = isExpired();

  return (
    <div
      className="relative bg-white overflow-hidden transition-all duration-500"
      style={{
        borderRadius: '16px',
        transform: isHovered ? 'translateX(8px)' : 'translateX(0)',
        boxShadow: isHovered
          ? '0 8px 24px rgba(0, 0, 0, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
        animation: `slideInFromLeft 0.6s ease-out ${delay}s both`,
        opacity: expired ? 0.6 : 1,
        filter: expired ? 'grayscale(0.3)' : 'none',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left Color Bar */}
      <div
        className="absolute left-0 top-0 bottom-0 transition-all duration-500"
        style={{
          width: isHovered ? '6px' : '4px',
          background: config.bgGradient,
        }}
      />

      {/* Expired Overlay Animation */}
      {expired && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.03) 10px, rgba(0, 0, 0, 0.03) 20px)',
            animation: 'slidePattern 20s linear infinite',
          }}
        />
      )}

      <div className="flex items-start p-6 pl-8">
        {/* Icon Section */}
        <div className="flex-shrink-0 mr-5">
          <div
            className="relative transition-all duration-500"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: isHovered ? config.bgGradient : config.lightBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1) rotate(0)',
              boxShadow: isHovered ? `0 8px 16px ${config.color}40` : 'none',
            }}
          >
            <Icon
              style={{
                fontSize: 32,
                color: isHovered ? 'white' : config.color,
                transition: 'color 0.5s',
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-grow pr-4">
              <h3
                className="text-xl font-bold mb-2 transition-colors duration-300"
                style={{
                  color: isHovered ? config.color : '#1a1a1a',
                }}
              >
                {announcement.title}
              </h3>
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300"
                  style={{
                    background: isHovered ? config.bgGradient : config.lightBg,
                    color: isHovered ? 'white' : config.color,
                  }}
                >
                  {announcement.campaign_type}
                </span>
                {expired && (
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      color: '#666',
                      animation: 'fadeInScale 0.5s ease-out',
                    }}
                  >
                    EXPIRED
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p
            className="text-gray-700 leading-relaxed mb-4"
            style={{
              fontSize: '15px',
              lineHeight: '1.7',
            }}
          >
            {announcement.description}
          </p>

          {/* Footer - Expiry Date */}
          <div className="flex items-center">
            <div
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: expired ? 'rgba(211, 47, 47, 0.1)' : 'rgba(0, 0, 0, 0.04)',
                border: expired ? '1px solid rgba(211, 47, 47, 0.3)' : '1px solid transparent',
              }}
            >
              <AccessTime
                style={{
                  fontSize: 18,
                  color: expired ? '#d32f2f' : config.color,
                  animation: expired ? 'pulse 2s ease-in-out infinite' : 'none',
                }}
              />
              <span
                className="text-sm font-medium"
                style={{
                  color: expired ? '#d32f2f' : '#666',
                }}
              >
                {expired ? 'Expired on:' : 'Expires on:'} {announcement.expiry_date}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Gradient Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.03 : 0,
          background: config.bgGradient,
        }}
      />
    </div>
  );
};

const FilterButton = ({ active, onClick, children, count, color }) => {
  return (
    <button
      onClick={onClick}
      className="px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
      style={{
        backgroundColor: active ? color : 'white',
        color: active ? 'white' : '#666',
        border: active ? 'none' : '2px solid #e0e0e0',
        transform: active ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: active ? `0 4px 12px ${color}40` : '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = color;
          e.currentTarget.style.color = color;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.borderColor = '#e0e0e0';
          e.currentTarget.style.color = '#666';
        }
      }}
    >
      {children}
      {count > 0 && (
        <span
          className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            backgroundColor: active ? 'rgba(255, 255, 255, 0.3)' : `${color}20`,
            color: active ? 'white' : color,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
};

const UserAnnouncements = () => {
  const [activeItem, setActiveItem] = useState('announcements');
  const [announcements, setAnnouncements] = useState([]);
  const [userName, setUserName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    // Mark as seen
    localStorage.setItem(`last_seen_announcements_${userId}`, new Date().toISOString());

    // Fetch user profile
    fetch(`http://127.0.0.1:8000/api/user-profile/${userId}/`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.name);
        setBloodGroup(data.blood_group);
        setProfilePicture(data.profile_picture);
      })
      .catch(err => console.error(err));

    // Fetch announcements
    fetch("http://127.0.0.1:8000/api/user/announcements/")
      .then(res => res.json())
      .then(data => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);


  const getFilteredAnnouncements = () => {
    if (filter === 'All') return announcements;
    return announcements.filter(a => a.campaign_type === filter);
  };

  const getTypeCount = (type) => {
    if (type === 'All') return announcements.length;
    return announcements.filter(a => a.campaign_type === type).length;
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      {/* Sidebar */}
      <UserSidebar activeItem={activeItem} userName={userName} bloodGroup={bloodGroup} profilePicture={profilePicture} />

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px' }}>
        {/* Header */}
        <header
          className="sticky top-0 z-40"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
            animation: 'slideInRight 0.5s ease-out 0.2s both',
            height: '72px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div className="px-8 h-full">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #900000 0%, #b71c1c 100%)',
                  }}
                >
                  <Campaign style={{ fontSize: 26, color: 'white' }} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                    Announcements
                  </h1>
                  <p className="text-sm text-gray-500">Stay updated with latest information</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <UserAvatar name={userName} profilePicture={profilePicture} />
              </div>
            </div>
          </div>
        </header>

        {/* CSS Keyframes */}
        <style>{`
          @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
        `}</style>

        {/* Main Content */}
        <main
          className="max-w-6xl mx-auto px-8 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          {/* Filter Buttons */}
          <div
            className="mb-8"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
            }}
          >
            <div className="flex flex-wrap gap-3">
              <FilterButton
                active={filter === 'All'}
                onClick={() => setFilter('All')}
                count={getTypeCount('All')}
                color="#555"
              >
                All
              </FilterButton>
              <FilterButton
                active={filter === 'Emergency'}
                onClick={() => setFilter('Emergency')}
                count={getTypeCount('Emergency')}
                color="#d32f2f"
              >
                Emergency
              </FilterButton>
              <FilterButton
                active={filter === 'Blood Camp'}
                onClick={() => setFilter('Blood Camp')}
                count={getTypeCount('Blood Camp')}
                color="#900000"
              >
                Blood Camp
              </FilterButton>
              <FilterButton
                active={filter === 'Awareness'}
                onClick={() => setFilter('Awareness')}
                count={getTypeCount('Awareness')}
                color="#1976d2"
              >
                Awareness
              </FilterButton>
              <FilterButton
                active={filter === 'General'}
                onClick={() => setFilter('General')}
                count={getTypeCount('General')}
                color="#689f38"
              >
                General
              </FilterButton>
            </div>
          </div>

          {/* Announcements List */}
          <div>
            {loading ? (
              <div
                className="text-center py-20"
                style={{
                  animation: 'fadeIn 0.5s ease-out',
                }}
              >
                <div
                  className="inline-block w-12 h-12 rounded-full"
                  style={{
                    border: '4px solid rgba(144, 0, 0, 0.2)',
                    borderTopColor: '#900000',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <p className="mt-4 text-gray-600 font-medium">Loading announcements...</p>
              </div>
            ) : filteredAnnouncements.length === 0 ? (
              <div
                className="bg-white rounded-2xl p-16 text-center"
                style={{
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                  animation: 'fadeInUp 0.5s ease-out 0.5s both',
                }}
              >
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundColor: 'rgba(144, 0, 0, 0.08)',
                  }}
                >
                  <Info style={{ fontSize: 48, color: '#900000' }} />
                </div>
                <h3 className="text-2xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
                  No Announcements Found
                </h3>
                <p className="text-gray-600 text-lg">
                  {filter === 'All'
                    ? 'There are no announcements available at the moment.'
                    : `No ${filter} announcements found. Try another category.`}
                </p>
              </div>
            ) : (
              <div className="space-y-5 pb-8">
                {filteredAnnouncements.map((announcement, idx) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    delay={0.4 + idx * 0.08}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slidePattern {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 40px 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserAnnouncements;