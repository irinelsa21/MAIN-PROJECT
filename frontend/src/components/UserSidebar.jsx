import React, { useState } from 'react';
import {
    Bloodtype,
    LocalHospital,
    CheckCircle,
    Campaign,
    History,
    Person,
    Dashboard,
    Help,
    ExitToApp,
    DeleteOutline
} from '@mui/icons-material';
import Logo from './Logo';

const UserSidebar = ({ activeItem, userName, bloodGroup, profilePicture }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
    const [announcementCount, setAnnouncementCount] = useState(0);
    const [helpCount, setHelpCount] = useState(0);
    const [userProfile, setUserProfile] = useState(null);

    const userId = localStorage.getItem("user_id");

    React.useEffect(() => {
        // Fetch user profile
        fetch(`http://127.0.0.1:8000/api/user-profile/${userId}/`)
            .then(res => res.json())
            .then(data => setUserProfile(data))
            .catch(err => console.error(err));

        // Fetch announcements
        fetch("http://127.0.0.1:8000/api/user/announcements/")
            .then(res => res.json())
            .then(data => {
                const lastSeen = localStorage.getItem(`last_seen_announcements_${userId}`);
                if (lastSeen) {
                    const newCount = data.filter(a => new Date(a.created_at) > new Date(lastSeen)).length;
                    setAnnouncementCount(newCount);
                } else {
                    setAnnouncementCount(data.length);
                }
            })
            .catch(err => console.error(err));

        // Fetch help queries
        fetch(`http://127.0.0.1:8000/api/help/my/?user_id=${userId}`)
            .then(res => res.json())
            .then(data => {
                const lastSeen = localStorage.getItem(`last_seen_help_${userId}`);
                if (lastSeen) {
                    const newCount = data.filter(q => q.replied_at && new Date(q.replied_at) > new Date(lastSeen)).length;
                    setHelpCount(newCount);
                } else {
                    const repliedCount = data.filter(q => q.replied_at).length;
                    setHelpCount(repliedCount);
                }
            })
            .catch(err => console.error(err));
    }, [userId]);

    const menuItems = [
        { id: 'dashboard', icon: Dashboard, label: 'Dashboard', path: '/user-dashboard' },
        { id: 'donate', icon: Bloodtype, label: 'Donate Blood', path: '/donor-form' },
        { id: 'request', icon: LocalHospital, label: 'Request Blood', path: '/blood-request' },
        { id: 'eligibility', icon: CheckCircle, label: 'Eligibility Check', path: '/eligibility-check' },
        { id: 'announcements', icon: Campaign, label: 'Announcements', path: '/user-announcements', count: announcementCount },
        { id: 'history', icon: History, label: 'Donation History', path: '/user-donation-history' },
        { id: 'help', icon: Help, label: 'Help & Support', path: '/user-help-support', count: helpCount },
        { id: 'profile', icon: Person, label: 'User Profile', path: '/user-profile' },
    ];

    const handleMenuClick = (path) => {
        window.location.href = path;
    };

    const handleDeleteAccount = async () => {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/delete-user/${userId}/`,
                { method: "DELETE" }
            );
            if (res.ok) {
                setShowDeleteConfirm(false);
                setShowDeleteSuccess(true);

                // Wait for animation, then redirect
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = "/login";
                }, 2500);
            } else {
                alert("Failed to delete account");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };

    return (
        <>
            <div
                className="fixed top-0 left-0 h-full bg-white z-50"
                style={{
                    width: '280px',
                    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.08)',
                    animation: 'slideInLeft 0.5s ease-out',
                }}
            >
                {/* Sidebar Header */}
                <div
                    className="px-6 flex items-center"
                    style={{
                        backgroundColor: '#900000',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        height: '80px',
                    }}
                >
                    <div className="flex items-center justify-center w-full">
                        <div
                            className="flex items-center justify-center"
                            style={{
                                animation: 'pulse 2s ease-in-out infinite',
                            }}
                        >
                            <Logo size={42} color="#ffffff" />
                        </div>
                    </div>
                </div>

                {/* User Profile Section */}
                <div
                    className="p-6 border-b border-gray-200"
                    style={{
                        animation: 'fadeIn 0.6s ease-out 0.2s both',
                    }}
                >
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden"
                            style={{
                                backgroundColor: 'rgba(144, 0, 0, 0.1)',
                                animation: 'scaleIn 0.5s ease-out 0.3s both',
                                border: (userProfile?.profile_picture || profilePicture) ? '2px solid rgba(144, 0, 0, 0.2)' : 'none'
                            }}
                        >
                            {(userProfile?.profile_picture || profilePicture) ? (
                                <img
                                    src={(userProfile?.profile_picture || profilePicture).startsWith('http')
                                        ? (userProfile?.profile_picture || profilePicture)
                                        : `http://127.0.0.1:8000${userProfile?.profile_picture || profilePicture}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Person style={{ fontSize: 24, color: '#900000' }} />
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">{userProfile?.name || userName || 'User'}</p>
                            <p className="text-sm text-gray-500">Blood Type: {userProfile?.blood_group || bloodGroup || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="p-4 flex-1 overflow-y-auto">
                    {menuItems.map((item, idx) => {
                        const isActive = activeItem === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleMenuClick(item.path)}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300"
                                style={{
                                    backgroundColor: isActive ? 'rgba(144, 0, 0, 0.1)' : 'transparent',
                                    transform: isActive ? 'translateX(8px) scale(1.02)' : 'translateX(0) scale(1)',
                                    animation: `slideInLeft 0.4s ease-out ${0.1 + idx * 0.05}s both`,
                                    boxShadow: isActive ? '0 4px 12px rgba(144, 0, 0, 0.1)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'rgba(144, 0, 0, 0.05)';
                                        e.currentTarget.style.transform = 'translateX(4px)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.transform = 'translateX(0)';
                                    }
                                }}
                            >
                                <item.icon
                                    style={{
                                        fontSize: 22,
                                        color: isActive ? '#900000' : '#666',
                                        transition: 'all 0.3s',
                                    }}
                                />
                                <span
                                    className="font-medium"
                                    style={{
                                        color: isActive ? '#900000' : '#666',
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    {item.label}
                                </span>
                                {item.count > 0 && (
                                    <div
                                        className="flex items-center justify-center text-white font-bold"
                                        style={{
                                            marginLeft: 'auto',
                                            backgroundColor: '#d32f2f',
                                            minWidth: '20px',
                                            height: '20px',
                                            borderRadius: '10px',
                                            fontSize: '11px',
                                            padding: '0 6px',
                                            boxShadow: '0 2px 6px rgba(211, 47, 47, 0.4)',
                                            animation: 'scaleIn 0.3s ease-out',
                                        }}
                                    >
                                        {item.count}
                                    </div>
                                )}
                                {isActive && !item.count && (
                                    <div
                                        style={{
                                            marginLeft: 'auto',
                                            width: '4px',
                                            height: '4px',
                                            borderRadius: '50%',
                                            backgroundColor: '#900000',
                                            animation: 'pulse 2s ease-in-out infinite',
                                        }}
                                    />
                                )}
                            </button>
                        );
                    })}

                    {/* Logout Button */}
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300"
                        style={{
                            color: '#d32f2f',
                            marginTop: '8px',
                            animation: `slideInLeft 0.4s ease-out ${0.1 + menuItems.length * 0.05}s both`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(211, 47, 47, 0.1)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <ExitToApp style={{ fontSize: 22 }} />
                        <span className="font-medium">Logout</span>
                    </button>

                    {/* Delete Account Button */}
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300"
                        style={{
                            color: '#b71c1c',
                            marginTop: '4px',
                            animation: `slideInLeft 0.4s ease-out ${0.1 + (menuItems.length + 1) * 0.05}s both`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(183, 28, 28, 0.1)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'translateX(0)';
                        }}
                    >
                        <DeleteOutline style={{ fontSize: 22 }} />
                        <span className="font-medium">Delete Account</span>
                    </button>
                </nav>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            animation: 'fadeIn 0.2s ease-out',
                            backdropFilter: 'blur(4px)',
                        }}
                        onClick={() => setShowDeleteConfirm(false)}
                    >
                        <div
                            className="bg-white rounded-2xl p-8 shadow-2xl"
                            style={{
                                width: '420px',
                                animation: 'scaleIn 0.3s ease-out',
                                border: '2px solid rgba(183, 28, 28, 0.2)',
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: 'rgba(183, 28, 28, 0.1)',
                                        animation: 'pulse 2s ease-in-out infinite',
                                    }}
                                >
                                    <DeleteOutline style={{ fontSize: 32, color: '#b71c1c' }} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-center" style={{ color: '#b71c1c' }}>
                                Permanent Delete
                            </h3>
                            <p className="text-gray-600 mb-6 text-center leading-relaxed">
                                This action will permanently delete your account and all related data.
                                <strong className="block mt-2 text-gray-800">This cannot be undone.</strong>
                            </p>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="flex-1 py-3 rounded-xl font-semibold transition-all duration-300"
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
                                <button
                                    onClick={handleDeleteAccount}
                                    className="flex-1 py-3 rounded-xl font-semibold text-white transition-all duration-300"
                                    style={{
                                        backgroundColor: '#b71c1c',
                                        boxShadow: '0 4px 12px rgba(183, 28, 28, 0.3)',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#8b0000';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(183, 28, 28, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#b71c1c';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(183, 28, 28, 0.3)';
                                    }}
                                >
                                    Delete Permanently
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Success Alert */}
                {showDeleteSuccess && (
                    <div
                        className="fixed inset-0 z-[60] flex items-center justify-center"
                        style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            animation: 'fadeIn 0.3s ease-out',
                            backdropFilter: 'blur(6px)',
                        }}
                    >
                        <div
                            className="bg-white rounded-2xl p-8 shadow-2xl"
                            style={{
                                width: '420px',
                                animation: 'slideUp 0.4s ease-out',
                                border: '2px solid rgba(76, 175, 80, 0.3)',
                            }}
                        >
                            <div className="flex justify-center mb-4">
                                <div
                                    className="w-20 h-20 rounded-full flex items-center justify-center"
                                    style={{
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        animation: 'successPulse 1.5s ease-in-out infinite',
                                    }}
                                >
                                    <CheckCircle style={{ fontSize: 48, color: '#4caf50' }} />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold mb-3 text-center" style={{ color: '#4caf50' }}>
                                Account Deleted Successfully
                            </h3>
                            <p className="text-gray-600 text-center leading-relaxed mb-4">
                                Your account has been permanently deleted.
                            </p>
                            <p className="text-gray-500 text-sm text-center">
                                Redirecting to login page...
                            </p>

                            {/* Progress Bar */}
                            <div className="mt-6 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        backgroundColor: '#4caf50',
                                        animation: 'progressBar 2.5s linear forwards',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <style>{`
          @keyframes slideInLeft {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes successPulse {
            0%, 100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
            }
            50% {
              transform: scale(1.05);
              box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
            }
          }

          @keyframes progressBar {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
            </div >
        </>
    );
};
export default UserSidebar;