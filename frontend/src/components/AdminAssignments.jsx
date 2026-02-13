import React, { useEffect, useState } from "react";
import {
    ExitToApp, Person, CalendarToday, LocationOn, Phone, BarChart, Campaign, LocalHospital,
    Assignment as AssignmentIcon, Download
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';

/* ================= SIDEBAR ================= */


/* ================= MAIN COMPONENT ================= */

export default function AdminAssignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/admin/assignments/")
            .then(res => res.json())
            .then(data => {
                setAssignments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching assignments:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
            <AdminSidebar activeItem="assignments" adminName="Irin" />

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
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                                    style={{ backgroundColor: '#900000' }}
                                >
                                    <AssignmentIcon className="text-white" style={{ fontSize: 24 }} />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Donor Assignments
                                </h1>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => window.open('http://127.0.0.1:8000/api/admin/download-assignments/', '_blank')}
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

                <main
                    className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
                >

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-900 border-t-transparent absolute top-0"></div>
                            </div>
                        </div>
                    ) : assignments.length === 0 ? (
                        <div className="max-w-md mx-auto bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
                                <AssignmentIcon className="text-gray-300" style={{ fontSize: 36 }} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No assignments found</h3>
                            <p className="text-gray-500 mt-2">Assignments will appear here once you match donors to requests.</p>
                        </div>
                    ) : (
                        <div className="max-w-5xl space-y-6">
                            {assignments.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-white rounded-3xl shadow-md border-2 border-gray-100 hover:border-red-200 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
                                    style={{
                                        animation: `slideIn 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    {/* Subtle gradient background on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-50/0 to-red-50/0 group-hover:from-red-50/30 group-hover:to-transparent transition-all duration-700"></div>

                                    {/* Subtle glow effects */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-red-900/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                    {/* Header with Badge */}
                                    <div className="relative px-6 py-4 flex items-center justify-between border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500">
                                                    <span className="text-white text-xs font-bold">#{item.id}</span>
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Match Success</span>
                                                <div className="h-0.5 w-0 group-hover:w-full bg-red-900 transition-all duration-700 rounded-full mt-0.5"></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-all duration-500">
                                            <CalendarToday className="text-gray-400 group-hover:text-red-900 transition-colors duration-500" style={{ fontSize: 14 }} />
                                            <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors duration-500">
                                                {new Date(item.assigned_at).toLocaleDateString('en-GB')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="relative p-6">
                                        <div className="flex items-center gap-5">
                                            {/* DONOR Card */}
                                            <div className="flex-1 relative group/donor">
                                                <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-xl opacity-0 group-hover/donor:opacity-100 transition-opacity duration-500"></div>
                                                <div className="relative flex items-center gap-4 bg-gradient-to-br from-blue-50 to-blue-50/30 rounded-2xl p-5 border-2 border-blue-100 group-hover/donor:border-blue-400 transition-all duration-500 group-hover/donor:shadow-lg">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg transform group-hover/donor:scale-110 transition-all duration-500">
                                                            <span className="text-white text-xl font-bold">{item.donor.blood_group}</span>
                                                        </div>
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 backdrop-blur-sm mb-2 group-hover/donor:bg-blue-200 transition-colors duration-500">
                                                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">● Donor</span>
                                                        </div>
                                                        <p className="font-bold text-gray-900 text-base truncate mb-2 group-hover/donor:text-blue-900 transition-colors duration-300">{item.donor.name}</p>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 group-hover/donor:text-blue-700 transition-colors duration-300">
                                                                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                                    <Phone style={{ fontSize: 12 }} />
                                                                </div>
                                                                <span className="font-semibold">{item.donor.phone}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 group-hover/donor:text-blue-700 transition-colors duration-300">
                                                                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                                    <LocationOn style={{ fontSize: 12 }} />
                                                                </div>
                                                                <span className="font-semibold">{item.donor.district}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Animated Arrow */}
                                            <div className="flex-shrink-0 relative">
                                                <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-red-900 to-red-800 flex items-center justify-center shadow-lg group-hover:scale-125 transition-all duration-700">
                                                    <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* PATIENT Card */}
                                            <div className="flex-1 relative group/patient">
                                                <div className="absolute inset-0 bg-red-900/5 rounded-2xl blur-xl opacity-0 group-hover/patient:opacity-100 transition-opacity duration-500"></div>
                                                <div className="relative flex items-center gap-4 bg-gradient-to-br from-red-50 to-red-50/30 rounded-2xl p-5 border-2 border-red-100 group-hover/patient:border-red-400 transition-all duration-500 group-hover/patient:shadow-lg">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-900 to-red-800 flex items-center justify-center shadow-lg transform group-hover/patient:scale-110 transition-all duration-500">
                                                            <span className="text-white text-xl font-bold">{item.patient.blood_group}</span>
                                                        </div>
                                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                                                            <LocalHospital className="text-white" style={{ fontSize: 14 }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 backdrop-blur-sm mb-2 group-hover/patient:bg-red-200 transition-colors duration-500">
                                                            <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">● Beneficiary</span>
                                                        </div>
                                                        <p className="font-bold text-gray-900 text-base truncate mb-2 group-hover/patient:text-red-900 transition-colors duration-300">{item.patient.name}</p>
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2 text-xs text-gray-600 group-hover/patient:text-red-700 transition-colors duration-300">
                                                                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                                    <LocalHospital style={{ fontSize: 12 }} />
                                                                </div>
                                                                <span className="font-semibold truncate">{item.patient.hospital}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-red-100 group-hover/patient:bg-red-200 transition-colors duration-500">
                                                                <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                                                    <CalendarToday className="text-red-900" style={{ fontSize: 12 }} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <span className="text-[9px] text-red-700 font-bold uppercase tracking-wide block">Required</span>
                                                                    <span className="text-xs font-bold text-red-900 block">
                                                                        {new Date(item.patient.hospital_date).toLocaleDateString('en-GB')}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bottom accent line */}
                                    <div className="h-1 bg-gradient-to-r from-blue-500 via-red-900 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}