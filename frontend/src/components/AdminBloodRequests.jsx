import React, { useEffect, useState } from "react";
import {
  Visibility, CheckCircle, Warning, AccessTime, Done, Lock, PersonAdd, Send, Assignment as AssignmentIcon, TrendingUp, MoreVert,
  Person, Bloodtype, LocalHospital, Phone, Email, LocationOn, Home, Business, CalendarToday, Description, FamilyRestroom, Cake, Wc, Close, Schedule, FilterList
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar';

/* ================= PATIENT DETAILS MODAL ================= */

const PatientDetailsModal = ({ request, onClose }) => {
  if (!request) return null;

  const detailItems = [
    { icon: Person, label: "Patient Name", value: request.patient_name },
    { icon: Cake, label: "Date of Birth", value: request.patient_dob },
    { icon: Wc, label: "Gender", value: request.gender },
    { icon: Bloodtype, label: "Blood Group", value: request.blood_group },
    { icon: Description, label: "Blood Component", value: request.blood_component },
    { icon: Email, label: "Email", value: request.email },
    { icon: Phone, label: "Phone", value: request.phone },
    { icon: FamilyRestroom, label: "Relative Phone", value: request.relative_phone },
    { icon: LocationOn, label: "District", value: request.district },
    { icon: Home, label: "Address", value: request.address },
    { icon: LocalHospital, label: "Hospital", value: request.hospital_name },
    { icon: Business, label: "Hospital IP Number", value: request.hospital_ip_number },
    { icon: CalendarToday, label: "Hospital Date", value: request.hospital_date },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      style={{ animation: 'fadeIn 0.3s ease-out' }}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
        style={{
          animation: 'scaleIn 0.3s ease-out',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Modal Header */}
        <div className="p-6 border-b flex items-center justify-between" style={{ backgroundColor: '#900000', color: 'white' }}>
          <div className="flex items-center space-x-3">
            <Visibility style={{ fontSize: 24 }} />
            <h2 className="text-xl font-bold">Patient Full Details</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Close style={{ fontSize: 24 }} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center">
                <Person className="mr-2" style={{ color: '#900000' }} /> Personal Information
              </h3>
              <div className="space-y-3">
                {detailItems.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-gray-800 border-b pb-2 mt-6 flex items-center">
                <Phone className="mr-2" style={{ color: '#900000' }} /> Contact Details
              </h3>
              <div className="space-y-3">
                {detailItems.slice(5, 8).map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center">
                <LocationOn className="mr-2" style={{ color: '#900000' }} /> Location & Hospital
              </h3>
              <div className="space-y-3">
                {detailItems.slice(8, 13).map((item, idx) => (
                  <div key={idx} className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium uppercase">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900 whitespace-pre-wrap">{item.value}</span>
                  </div>
                ))}
              </div>

              {request.id_proof && (
                <div className="mt-6">
                  <h3 className="font-bold text-gray-800 border-b pb-2 mb-3 flex items-center">
                    <Description className="mr-2" style={{ color: '#900000' }} /> ID Proof
                  </h3>
                  <a
                    href={`http://127.0.0.1:8000${request.id_proof}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:underline bg-blue-50 p-3 rounded-lg w-full"
                  >
                    <Visibility fontSize="small" />
                    <span>View Uploaded ID Proof</span>
                  </a >
                </div >
              )}
            </div >
          </div >
        </div >

        {/* Modal Footer */}
        < div className="p-4 border-t bg-white flex justify-end" >
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-bold text-white transition-all duration-300"
            style={{ backgroundColor: '#900000' }}
          >
            Close
          </button>
        </div >
      </div >
    </div >
  );
};

/* ================= ENHANCED REQUEST CARD WITH CONDITIONAL LOGIC ================= */

const BloodRequestCard = ({ request, onMarkSeen, onAssign, onSubmit, onViewDetails, delay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isNotSeen = request.status === "NOT_SEEN";
  const canInteract = !isNotSeen; // Other buttons only enabled after marking as seen

  const getStatusBadge = () => {
    if (request.is_fulfilled) {
      return {
        text: 'Fulfilled',
        color: '#4caf50',
        icon: CheckCircle
      };
    }
    if (isNotSeen) {
      return {
        text: 'Needs Review',
        color: '#f44336',
        icon: Warning
      };
    }
    return {
      text: 'In Progress',
      color: '#ff9800',
      icon: AccessTime
    };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  return (
    <div
      className={`bg-white rounded-xl p-5 transition-all duration-300 relative overflow-hidden border-2 ${request.is_fulfilled ? "opacity-75" : ""
        }`}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 12px 24px rgba(144, 0, 0, 0.12)'
          : '0 2px 8px rgba(0, 0, 0, 0.06)',
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
        borderColor: isNotSeen ? '#f44336' : (request.is_fulfilled ? '#4caf50' : '#e0e0e0'),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status indicator stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: `linear-gradient(90deg, ${status.color}, ${status.color}AA)`,
          animation: isNotSeen ? 'pulse 2s ease-in-out infinite' : 'none',
        }}
      />

      <div className="relative z-10">
        {/* Header with Status Badge & View Details */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-lg" style={{ color: '#1a1a1a' }}>
                  {request.patient_name}
                </h3>
                {isNotSeen && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: '#f44336',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                )}
              </div>
              <button
                onClick={() => onViewDetails(request)}
                className="text-[#900000] hover:text-[#700000] p-1 rounded-full hover:bg-[#90000010] transition-colors"
                title="View Full Details"
              >
                <MoreVert />
              </button>
            </div>
            <div
              className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: `${status.color}15`,
                color: status.color,
              }}
            >
              <StatusIcon style={{ fontSize: 12 }} />
              <span>{status.text}</span>
            </div>
          </div>

          <div
            className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm"
            style={{
              backgroundColor: 'rgba(144, 0, 0, 0.08)',
              color: '#900000',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s',
            }}
          >
            {request.blood_group}
          </div>
        </div>

        {/* Details Grid */}
        <div className="space-y-2 mb-4 bg-gray-50 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-sm">
            <Person style={{ fontSize: 16, color: '#666' }} />
            <div className="flex-1">
              <span className="text-gray-600">Requested by: </span>
              <span className="font-semibold text-gray-900">{request.user_name}</span>
              <span className="text-gray-500 ml-2">({request.user_phone})</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <Business style={{ fontSize: 16, color: '#666' }} />
            <div className="flex-1">
              <span className="text-gray-600">Hospital: </span>
              <span className="font-semibold text-gray-900">{request.hospital_name}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm">
            <CalendarToday style={{ fontSize: 16, color: '#666' }} />
            <div className="flex-1">
              <span className="text-gray-600">Required: </span>
              <span className="font-semibold text-gray-900">{request.hospital_date}</span>
            </div>
          </div>
        </div>

        {/* Assignment Counter */}
        {request.assigned_count > 0 && (
          <div
            className="mb-3 p-3 rounded-lg flex items-center justify-between"
            style={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '1px solid rgba(76, 175, 80, 0.3)',
            }}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle style={{ color: '#4caf50', fontSize: 18 }} />
              <span className="font-bold text-sm text-green-700">
                {request.assigned_count} Donor(s) Assigned
              </span>
            </div>
            <TrendingUp style={{ color: '#4caf50', fontSize: 18 }} />
          </div>
        )}

        {/* Fulfilled Status */}
        {request.is_fulfilled && (
          <div
            className="p-3 rounded-lg text-center font-bold flex items-center justify-center space-x-2"
            style={{
              backgroundColor: 'rgba(76, 175, 80, 0.15)',
              color: '#4caf50',
            }}
          >
            <Done style={{ fontSize: 20 }} />
            <span>Request Fulfilled</span>
          </div>
        )}

        {/* Action Buttons with Conditional Logic */}
        {!request.is_fulfilled && (
          <div className="space-y-2">
            {/* Mark as Seen Button - Only shows for NOT_SEEN */}
            {isNotSeen && (
              <button
                onClick={() => onMarkSeen(request.id)}
                className="w-full p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#45a049';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4caf50';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Visibility fontSize="small" />
                <span>Mark as Seen to Continue</span>
              </button>
            )}

            {/* Other Action Buttons - Disabled if NOT_SEEN */}
            <div className="grid grid-cols-2 gap-2 relative">
              {/* Disabled Overlay for NOT_SEEN requests */}
              {isNotSeen && (
                <div
                  className="absolute inset-0 bg-white bg-opacity-70 backdrop-blur-[2px] rounded-lg z-10 flex items-center justify-center"
                  style={{
                    animation: 'fadeIn 0.3s ease-out',
                  }}
                >
                  <div className="text-center">
                    <Lock
                      style={{
                        fontSize: 24,
                        color: '#900000',
                        marginBottom: 4,
                        animation: 'shake 0.5s ease-in-out',
                      }}
                    />
                    <p className="font-semibold text-xs text-gray-700">Mark as Seen First</p>
                  </div>
                </div>
              )}

              {/* Assign Donor Button */}
              <button
                onClick={() => canInteract && onAssign(request)}
                disabled={!canInteract}
                className="p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor: canInteract ? '#900000' : '#e0e0e0',
                  color: canInteract ? 'white' : '#999',
                  cursor: canInteract ? 'pointer' : 'not-allowed',
                  opacity: canInteract ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (canInteract) {
                    e.currentTarget.style.backgroundColor = '#700000';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canInteract) {
                    e.currentTarget.style.backgroundColor = '#900000';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <PersonAdd fontSize="small" />
                <span>Assign</span>
              </button>

              {/* Submit Button */}
              <button
                onClick={() => canInteract && request.assigned_count > 0 && onSubmit(request)}
                disabled={!canInteract || request.assigned_count === 0}
                className="p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                style={{
                  backgroundColor:
                    canInteract && request.assigned_count > 0 ? '#2196f3' : '#e0e0e0',
                  color: canInteract && request.assigned_count > 0 ? 'white' : '#999',
                  cursor: canInteract && request.assigned_count > 0 ? 'pointer' : 'not-allowed',
                  opacity: canInteract && request.assigned_count > 0 ? 1 : 0.6,
                }}
                onMouseEnter={(e) => {
                  if (canInteract && request.assigned_count > 0) {
                    e.currentTarget.style.backgroundColor = '#1976d2';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (canInteract && request.assigned_count > 0) {
                    e.currentTarget.style.backgroundColor = '#2196f3';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <Send fontSize="small" />
                <span>Submit</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= STATS CARD ================= */

const StatsCard = ({ icon: Icon, label, value, color, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white rounded-xl p-5 transition-all duration-300 relative overflow-hidden border border-gray-100"
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered
          ? '0 8px 16px rgba(0, 0, 0, 0.1)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          transform: isHovered ? 'scale(1.5)' : 'scale(1)',
          transition: 'all 0.3s',
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-xs font-semibold uppercase tracking-wide mb-1">{label}</p>
          <p className="text-3xl font-bold" style={{ color }}>
            {value}
          </p>
        </div>

        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
          style={{
            backgroundColor: `${color}15`,
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0)',
          }}
        >
          <Icon
            style={{
              fontSize: 24,
              color: color,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */

export default function AdminBloodRequests() {
  const [activeItem] = useState("requests");
  const [adminName] = useState("Irin");
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  /* Assign Donor Modal */
  const [showModal, setShowModal] = useState(false);
  const [donors, setDonors] = useState([]);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [currentRequest, setCurrentRequest] = useState(null);

  /* Patient Full Details Modal */
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsRequest, setDetailsRequest] = useState(null);

  /* Open Details Modal */
  const openDetails = (request) => {
    setDetailsRequest(request);
    setShowDetailsModal(true);
  };

  /* Fetch Requests */
  const fetchRequests = () => {
    fetch("http://127.0.0.1:8000/api/admin/blood-requests/")
      .then(res => res.json())
      .then(data => setRequests(data));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* Mark Seen */
  const markSeen = (id) => {
    fetch(`http://127.0.0.1:8000/api/admin/blood-requests/seen/${id}/`, {
      method: "POST"
    }).then(fetchRequests);
  };

  /* Open Assign Modal */
  const openAssign = (request) => {
    setCurrentRequest(request);
    fetch(`http://127.0.0.1:8000/api/admin/get-compatible-donors/${request.id}/`)
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setSelectedDonors([]);
        setShowModal(true);
      });
  };

  /* Assign Donors */
  const assignDonors = () => {
    fetch(
      `http://127.0.0.1:8000/api/admin/assign-donors/${currentRequest.id}/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ donors: selectedDonors })
      }
    ).then(() => {
      setShowModal(false);
      fetchRequests();
    });
  };

  /* Submit Request */
  const submitRequest = (request) => {
    if (window.confirm(`Are you sure you want to submit the request for ${request.patient_name}? This will finalize the assignments.`)) {
      fetch(`http://127.0.0.1:8000/api/admin/submit-assignment/${request.id}/`, {
        method: 'POST'
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message || data.error);
          fetchRequests();
        });
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'new') return r.status === 'NOT_SEEN';
    if (filterStatus === 'in-progress') return !r.is_fulfilled && r.status !== 'NOT_SEEN';
    if (filterStatus === 'fulfilled') return r.is_fulfilled;
    return true;
  });

  // Calculate stats
  const stats = [
    {
      icon: LocalHospital,
      label: 'Total Requests',
      value: requests.length,
      color: '#900000',
    },
    {
      icon: Warning,
      label: 'New Requests',
      value: requests.filter(r => r.status === 'NOT_SEEN').length,
      color: '#f44336',
    },
    {
      icon: Schedule,
      label: 'In Progress',
      value: requests.filter(r => !r.is_fulfilled && r.status !== 'NOT_SEEN').length,
      color: '#ff9800',
    },
    {
      icon: CheckCircle,
      label: 'Fulfilled',
      value: requests.filter(r => r.is_fulfilled).length,
      color: '#4caf50',
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <AdminSidebar
        activeItem={activeItem}
        adminName={adminName}
      />

      <div style={{ marginLeft: '280px' }}>
        {/* Header */}
        <header
          className="sticky top-0 z-40 bg-white"
          style={{
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            animation: 'slideInRight 0.5s ease-out both',
            height: '64px',
          }}
        >
          <div className="px-6 sm:px-8 lg:px-12 h-full">
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center space-x-3">
                <LocalHospital style={{ fontSize: 28, color: '#900000' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>
                  Blood Requests Management
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notification button removed */}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main
          className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
        >
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
              <StatsCard
                key={idx}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                color={stat.color}
                delay={0.3 + idx * 0.1}
              />
            ))}
          </div>

          {/* Filter Section */}
          <div
            className="bg-white rounded-xl p-4 mb-6 border border-gray-100"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              animation: 'fadeInUp 0.6s ease-out 0.7s both',
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <FilterList style={{ color: '#900000', fontSize: 22 }} />
                <h3 className="text-base font-bold" style={{ color: '#1a1a1a' }}>
                  Filter Requests
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'new', 'in-progress', 'fulfilled'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterStatus(filter)}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
                    style={{
                      backgroundColor: filterStatus === filter ? '#900000' : 'transparent',
                      color: filterStatus === filter ? 'white' : '#666',
                      border: filterStatus === filter ? 'none' : '1px solid #ddd',
                    }}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Requests Grid */}
          {filteredRequests.length === 0 ? (
            <div
              className="bg-white rounded-xl p-12 text-center border border-gray-100"
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                animation: 'fadeInUp 0.6s ease-out 0.8s both',
              }}
            >
              <LocalHospital style={{ fontSize: 56, color: '#ccc', marginBottom: 12 }} />
              <h3 className="text-lg font-bold text-gray-400 mb-1">No Requests Found</h3>
              <p className="text-sm text-gray-500">There are no blood requests matching your filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRequests.map((r, idx) => (
                <BloodRequestCard
                  key={r.id}
                  request={r}
                  onMarkSeen={markSeen}
                  onAssign={openAssign}
                  onSubmit={submitRequest}
                  onViewDetails={openDetails}
                  delay={0.8 + idx * 0.05}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
          style={{
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto"
            style={{
              animation: 'scaleIn 0.3s ease-out',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(144, 0, 0, 0.1)',
                  }}
                >
                  <PersonAdd style={{ fontSize: 22, color: '#900000' }} />
                </div>
                <div>
                  <h2 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
                    Assign Donors
                  </h2>
                  <p className="text-xs text-gray-600">
                    Blood Group: <span className="font-bold text-red-800">{currentRequest?.blood_group}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100"
              >
                <Close style={{ fontSize: 22, color: '#666' }} />
              </button>
            </div>

            {donors.length === 0 ? (
              <div className="text-center py-8">
                <Bloodtype style={{ fontSize: 48, color: '#ccc', marginBottom: 12 }} />
                <p className="text-gray-500">No compatible donors found</p>
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                {donors.map((d, idx) => (
                  <label
                    key={d.id}
                    className="flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer border-2"
                    style={{
                      backgroundColor: selectedDonors.includes(d.id) ? 'rgba(144, 0, 0, 0.05)' : '#f9f9f9',
                      borderColor: selectedDonors.includes(d.id) ? '#900000' : 'transparent',
                      animation: `fadeInUp 0.3s ease-out ${idx * 0.05}s both`,
                    }}
                  >
                    <input
                      type="checkbox"
                      value={d.id}
                      checked={selectedDonors.includes(d.id)}
                      onChange={(e) => {
                        const id = parseInt(e.target.value);
                        setSelectedDonors(prev =>
                          e.target.checked
                            ? [...prev, id]
                            : prev.filter(x => x !== id)
                        );
                      }}
                      className="w-5 h-5 mr-3"
                      style={{
                        accentColor: '#900000',
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-base" style={{ color: '#1a1a1a' }}>{d.name}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-xs text-gray-600 flex items-center">
                          <Bloodtype style={{ fontSize: 12, marginRight: 4 }} />
                          {d.blood_group}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center">
                          <LocationOn style={{ fontSize: 12, marginRight: 4 }} />
                          {d.district}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-lg font-semibold transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={assignDonors}
                disabled={selectedDonors.length === 0}
                className={`px-5 py-2 rounded-lg font-semibold transition-all duration-300 ${selectedDonors.length === 0 ? 'cursor-not-allowed' : ''
                  }`}
                style={{
                  backgroundColor: selectedDonors.length > 0 ? '#900000' : '#ccc',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  if (selectedDonors.length > 0) {
                    e.currentTarget.style.backgroundColor = '#700000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDonors.length > 0) {
                    e.currentTarget.style.backgroundColor = '#900000';
                  }
                }}
              >
                Assign {selectedDonors.length > 0 && `(${selectedDonors.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DETAILS MODAL ================= */}
      {showDetailsModal && (
        <PatientDetailsModal
          request={detailsRequest}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}