import React, { useState, useEffect } from 'react';
import {
  Bloodtype,
  LocalHospital,
  CheckCircle,
  Campaign,
  History,
  Feedback,
  Person
} from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';


const QuickActionCard = ({ icon: Icon, title, description, onClick, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
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
      onClick={onClick}
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
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
          style={{
            backgroundColor: isHovered ? '#900000' : 'rgba(144, 0, 0, 0.1)',
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
          }}
        >
          <Icon
            style={{
              fontSize: 32,
              color: isHovered ? 'white' : '#900000',
              transition: 'color 0.3s',
            }}
          />
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
          Get Started →
        </div>
      </div>

      {/* Corner decoration */}
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full transition-all duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(144, 0, 0, 0.1) 0%, transparent 70%)',
          transform: isHovered ? 'scale(1.5) translate(10px, -10px)' : 'scale(1)',
        }}
      />
    </div>
  );
};

const UserDashboard = () => {
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [stats, setStats] = useState({
    total_donations: 0,
    lives_saved: 0,
    next_eligible: 'Checking...'
  });

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    fetch(`http://127.0.0.1:8000/api/user-profile/${userId}/`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.name);
        setBloodGroup(data.blood_group);
        setProfilePicture(data.profile_picture);
      })
      .catch(err => console.error(err));

    fetch(`http://127.0.0.1:8000/api/user/dashboard-stats/${userId}/`)
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    setIsLoaded(true);
  }, []);

  const handleActionClick = (title) => {
    const routes = {
      'Donate Blood': '/donor-form',
      'Request Blood': '/blood-request',
      'Eligibility Check': '/eligibility-check',
      'Announcements': '/user-announcements',
      'Donation History': '/user-donation-history',
      'Feedback': '/user-help-support'
    };
    if (routes[title]) window.location.href = routes[title];
  };

  const quickActions = [
    {
      icon: Bloodtype,
      title: 'Donate Blood',
      description: 'Schedule your next blood donation and save lives today',
    },
    {
      icon: LocalHospital,
      title: 'Request Blood',
      description: 'Find and request blood donors for urgent medical needs',
    },
    {
      icon: CheckCircle,
      title: 'Eligibility Check',
      description: 'Verify if you meet the requirements to donate blood',
    },
    {
      icon: Campaign,
      title: 'Announcements',
      description: 'Stay updated with blood drives and important notifications',
    },
    {
      icon: History,
      title: 'Donation History',
      description: 'View your complete blood donation records and impact',
    },
    {
      icon: Feedback,
      title: 'Feedback',
      description: 'Share your experience and help us improve our services',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <UserSidebar activeItem={activeItem} userName={userName} bloodGroup={bloodGroup} profilePicture={profilePicture} />

      {/* Main Content Area */}
      <div style={{ marginLeft: '280px' }}>
        {/* Header */}
        <header
          className="sticky top-0 z-40 transition-all duration-300"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            animation: 'slideInRight 0.5s ease-out 0.2s both',
            height: '64px',
          }}
        >
          <div className="px-6 sm:px-8 lg:px-12 h-full">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Dashboard</h1>
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
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          {/* Welcome Section */}
          <div
            className="mb-10"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
            }}
          >
            <h2 className="text-4xl font-bold mb-3" style={{ color: '#1a1a1a' }}>
              Welcome Back, {userName}! 👋
            </h2>
            <p className="text-gray-600 text-lg">
              Every drop counts. Choose an action below to continue making a difference.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Donations', value: stats.total_donations, color: '#900000' },
              { label: 'Lives Saved', value: stats.lives_saved, color: '#d32f2f' },
              { label: 'Next Eligible', value: stats.next_eligible, color: '#f44336' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  animation: `fadeInUp 0.5s ease-out ${0.4 + idx * 0.1}s both`,
                }}
              >
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <p className="text-4xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Actions Grid */}
          <div>
            <h3
              className="text-2xl font-bold mb-6"
              style={{
                color: '#1a1a1a',
                animation: 'fadeInUp 0.6s ease-out 0.7s both',
              }}
            >
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
              {quickActions.map((action, idx) => (
                <QuickActionCard
                  key={idx}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  onClick={() => handleActionClick(action.title)}
                  delay={0.8 + idx * 0.1}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;