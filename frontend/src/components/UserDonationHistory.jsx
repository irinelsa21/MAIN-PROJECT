import React, { useState, useEffect } from 'react';
import {
    History,
    Person,
    LocationOn,
    Phone,
    MedicalServices,
    CalendarMonth,
    CheckCircle,
    AccessTime,
    ArrowForward
} from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';

const HistoryRow = ({ assignment, idx }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative border-b transition-all duration-300"
            style={{
                backgroundColor: isHovered ? '#fafafa' : 'white',
                borderColor: '#f0f0f0',
                animation: `fadeInUp 0.4s ease-out ${0.05 + idx * 0.05}s both`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                {/* Blood Group */}
                <div className="col-span-1">
                    <div
                        className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300"
                        style={{
                            backgroundColor: isHovered ? '#900000' : '#90000010',
                            color: isHovered ? 'white' : '#900000',
                            border: `1.5px solid ${isHovered ? '#900000' : 'transparent'}`,
                        }}
                    >
                        {assignment.blood_group}
                    </div>
                </div>

                {/* Patient Info */}
                <div className="col-span-3">
                    <div className="flex items-center gap-2">
                        <MedicalServices style={{ fontSize: 16, color: '#90000060' }} />
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Patient</p>
                            <p className="text-sm font-semibold text-gray-900">{assignment.patient_name}</p>
                        </div>
                    </div>
                </div>

                {/* Hospital & Location */}
                <div className="col-span-4">
                    <div className="flex items-center gap-2">
                        <LocationOn style={{ fontSize: 16, color: '#90000060' }} />
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Hospital</p>
                            <p className="text-sm font-semibold text-gray-900 leading-tight">{assignment.hospital_name}</p>
                            <p className="text-xs text-gray-500">{assignment.district}</p>
                        </div>
                    </div>
                </div>

                {/* Requester */}
                <div className="col-span-2">
                    <div className="flex items-center gap-2">
                        <Person style={{ fontSize: 16, color: '#90000060' }} />
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Requester</p>
                            <p className="text-sm font-semibold text-gray-900">{assignment.requester_name}</p>
                            <p className="text-xs text-gray-600">{assignment.requester_phone}</p>
                        </div>
                    </div>
                </div>

                {/* Date */}
                <div className="col-span-2">
                    <div className="flex items-center gap-2">
                        <CalendarMonth style={{ fontSize: 16, color: '#90000060' }} />
                        <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Required</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {new Date(assignment.required_date).toLocaleDateString(undefined, {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Status & Action */}
                {/* Removed as per request */}
            </div>

            {/* Hover indicator bar */}
            <div
                className="absolute left-0 top-0 h-full w-1 transition-all duration-300"
                style={{
                    backgroundColor: '#900000',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'scaleY(1)' : 'scaleY(0.5)'
                }}
            />
        </div>
    );
};

export default function UserDonationHistory() {
    const [assignments, setAssignments] = useState([]);
    const [activeItem, setActiveItem] = useState('history');
    const [userName, setUserName] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            window.location.href = '/login';
            return;
        }

        // Fetch user profile
        fetch(`http://127.0.0.1:8000/api/user-profile/${userId}/`)
            .then(res => res.json())
            .then(data => {
                setUserName(data.name);
                setBloodGroup(data.blood_group);
                setProfilePicture(data.profile_picture);
            })
            .catch(err => console.error(err));

        // Fetch assignment history
        fetch(`http://127.0.0.1:8000/api/user/assignments/${userId}/`)
            .then(res => res.json())
            .then(data => {
                setAssignments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'white' }}>
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-3 border-t-transparent rounded-full animate-spin mb-3" style={{ borderColor: '#900000', borderTopColor: 'transparent', borderWidth: '3px' }} />
                    <p className="text-sm text-gray-500 font-semibold">Loading your history...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'white' }}>
            <UserSidebar activeItem={activeItem} userName={userName} bloodGroup={bloodGroup} profilePicture={profilePicture} />

            <div style={{ marginLeft: '280px' }}>
                <header
                    className="sticky top-0 z-40 transition-all duration-300"
                    style={{
                        height: '64px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                        animation: 'slideInRight 0.5s ease-out 0.2s both',
                        borderBottom: '1px solid #f0f0f0'
                    }}
                >
                    <div className="px-8 h-full flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#90000010' }}>
                                <History style={{ fontSize: 20, color: '#900000' }} />
                            </div>
                            <h1 className="text-lg font-bold text-gray-900">Donation History</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm font-semibold text-gray-500 mr-2">
                                <span style={{ color: '#900000', fontWeight: 'bold' }}>{assignments.length}</span> {assignments.length === 1 ? 'record' : 'records'}
                            </div>
                            <UserAvatar name={userName} profilePicture={profilePicture} />
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

                <main
                    className="px-8 py-8"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
                >
                    {assignments.length === 0 ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl p-12 text-center border" style={{ borderColor: '#f0f0f0' }}>
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f5f5f5' }}>
                                    <History style={{ fontSize: 32, color: '#ccc' }} />
                                </div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2">No Donations Yet</h2>
                                <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">Your donation history is empty. Start your journey and save lives.</p>
                                <button
                                    onClick={() => window.location.href = '/donor-form'}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                                    style={{
                                        backgroundColor: '#900000',
                                        color: 'white',
                                        boxShadow: '0 4px 12px rgba(144, 0, 0, 0.2)'
                                    }}
                                >
                                    Schedule Donation
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-7xl mx-auto">
                            {/* Table Header */}
                            <div className="bg-gray-50 border-b-2" style={{ borderColor: '#900000' }}>
                                <div className="grid grid-cols-12 gap-4 px-6 py-3">
                                    <div className="col-span-1">
                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Group</p>
                                    </div>
                                    <div className="col-span-3">
                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Patient</p>
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Hospital & Location</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Requester</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Required Date</p>
                                    </div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="bg-white border border-t-0 rounded-b-2xl overflow-hidden" style={{ borderColor: '#f0f0f0' }}>
                                {assignments.map((a, idx) => (
                                    <HistoryRow key={a.id} assignment={a} idx={idx} />
                                ))}
                            </div>

                            {/* Summary Footer */}
                            <div className="mt-6 flex items-center justify-between px-4">
                                <p className="text-sm text-gray-500">
                                    Showing <span className="font-bold text-gray-900">{assignments.length}</span> donation {assignments.length === 1 ? 'record' : 'records'}
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Removed internal style block as it's now in the header section */}
        </div>
    );
}