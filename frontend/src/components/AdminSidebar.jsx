import React, { useState, useEffect } from 'react';
import {
    Dashboard,
    People,
    BarChart, ExitToApp, Person,
    Bloodtype, LocalHospital, Campaign, HelpOutline,
    Assignment as AssignmentIcon,
    RateReview
} from '@mui/icons-material';
import Logo from './Logo';

const AdminSidebar = ({ activeItem, adminName = "Irin" }) => {
    const [counts, setCounts] = useState({
        registration: 0,
        donors: 0,
        requests: 0,
        queries: 0,
        feedbacks: 0
    });

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/admin/statistics/')
            .then(res => res.json())
            .then(data => {
                if (data.pendingCounts) {
                    setCounts(data.pendingCounts);
                }
            })
            .catch(err => console.error("Error fetching notification counts:", err));
    }, []);

    const menuItems = [
        { id: 'dashboard', icon: Dashboard, label: 'Dashboard', route: '/admin-dashboard' },
        { id: 'users', icon: People, label: 'User Management', route: '/user-management' },
        { id: 'registration', icon: Person, label: 'Registration Requests', route: '/registration-requests', count: counts.registration },
        { id: 'donors', icon: Bloodtype, label: 'Donor Management', route: '/admin-donor-management', count: counts.donors },
        { id: 'requests', icon: LocalHospital, label: 'Blood Requests', route: '/admin-blood-requests', count: counts.requests },
        { id: 'assignments', icon: AssignmentIcon, label: 'Assignments', route: '/admin-assignments' },
        { id: 'announcements', icon: Campaign, label: 'Announcements', route: '/admin-announcements' },
        { id: 'feedbacks', icon: RateReview, label: 'Manage Feedback', route: '/admin-feedbacks', count: counts.feedbacks },
        { id: 'queries', icon: HelpOutline, label: 'Queries Management', route: '/admin-help-support', count: counts.queries },
        { id: 'statistics', icon: BarChart, label: 'Statistics & Reports', route: '/admin-statistics' },
    ];

    const handleMenuClick = (route) => {
        window.location.href = route;
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    return (
        <div
            className="fixed top-0 left-0 h-full bg-white z-50"
            style={{
                width: '280px',
                display: 'flex',
                flexDirection: 'column',
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
                    <div className="flex items-center justify-center" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
                        <Logo size={42} color="#ffffff" />
                    </div>
                </div>
            </div>

            {/* Admin Profile Section */}
            <div
                className="p-6 border-b border-gray-200"
                style={{ animation: 'fadeIn 0.6s ease-out 0.2s both' }}
            >
                <div className="flex items-center space-x-3">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: 'rgba(144, 0, 0, 0.1)',
                            animation: 'scaleIn 0.5s ease-out 0.3s both',
                        }}
                    >
                        <Person style={{ fontSize: 24, color: '#900000' }} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{adminName}</p>
                        <p className="text-sm text-gray-500">Administrator</p>
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <nav className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item, idx) => {
                    const isActive = activeItem === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.route)}
                            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300"
                            style={{
                                backgroundColor: isActive ? 'rgba(144, 0, 0, 0.1)' : 'transparent',
                                transform: isActive ? 'translateX(8px) scale(1.02)' : 'translateX(0) scale(1)',
                                animation: `slideInLeft 0.4s ease-out ${0.1 + idx * 0.05}s both`,
                                boxShadow: isActive ? '0 4px 12px rgba(144, 0, 0, 0.1)' : 'none',
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
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                }}
                            >
                                {item.label}
                            </span>
                            {item.count > 0 && (
                                <div
                                    style={{
                                        marginLeft: 'auto',
                                        backgroundColor: '#900000',
                                        color: 'white',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        minWidth: '20px',
                                        textAlign: 'center',
                                        animation: 'pulse 2s ease-in-out infinite',
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
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300"
                    style={{
                        color: '#d32f2f',
                        marginTop: '8px',
                        animation: `slideInLeft 0.4s ease-out ${0.1 + menuItems.length * 0.05}s both`,
                    }}
                >
                    <ExitToApp style={{ fontSize: 22 }} />
                    <span className="font-medium">Logout</span>
                </button>
            </nav>

            <style>{`
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(144, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(144, 0, 0, 0.4);
        }
      `}</style>
        </div >
    );
};

export default AdminSidebar;
