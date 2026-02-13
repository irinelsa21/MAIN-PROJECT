import React, { useEffect, useState } from "react";
import {
  Bloodtype,
  LocalHospital,
  CheckCircle,
  Campaign,
  History,
  Person,
  CloudUpload,
  Description,
  Warning,
  CheckCircleOutline,
  Cancel,
  Schedule,
  LocationOn,
  Email,
  Phone,
  Home,
  Cake,
  Wc,
  Map,
} from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';


const DonorRequestCard = ({ donor, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    PENDING: { color: '#ff9800', bg: '#fff3e0', label: 'Pending Review', icon: Schedule },
    APPROVED: { color: '#4caf50', bg: '#e8f5e9', label: 'Approved', icon: CheckCircleOutline },
    REJECTED: { color: '#f44336', bg: '#ffebee', label: 'Rejected', icon: Cancel },
    ASSIGNED: { color: '#686868', bg: '#eeeeee', label: 'Assigned (Unavailable)', icon: CheckCircle }
  };

  const config = statusConfig[donor.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

  const availableDistrictsArray = donor.available_districts
    ? donor.available_districts.split(',').map(d => d.trim()).filter(Boolean)
    : [];

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden transition-all duration-300"
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
          <StatusIcon style={{ fontSize: 20, color: config.color }} />
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

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">{donor.name}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-gray-700">
            <LocationOn style={{ fontSize: 18, color: '#900000' }} />
            <span className="text-sm">{donor.district}</span>
          </div>
        </div>

        {/* Available Districts */}
        {availableDistrictsArray.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Map style={{ fontSize: 18, color: '#900000' }} />
              <span className="text-sm font-semibold text-gray-900">
                Can Donate At:
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
      </div>
    </div>
  );
};

export default function DonorForm() {
  const [activeItem, setActiveItem] = useState('donate');
  const [userName, setUserName] = useState('');
  const [userBloodGroup, setUserBloodGroup] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  const user_id = localStorage.getItem("user_id");

  const districts = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
    "Kottayam", "Idukki", "Ernakulam", "Thrissur",
    "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
    "Kannur", "Kasaragod"
  ];

  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    district: "",
    blood_group: "",
    available_districts: [],
    confirmed: false,
    file: null
  });

  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  // Fetch user info
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/donor/user/${user_id}/`)
      .then(res => res.json())
      .then(data => {
        setForm(f => ({ ...f, ...data }));
        setUserName(data.name);
        setUserBloodGroup(data.blood_group);
        setProfilePicture(data.profile_picture);
      });

    fetchHistory();
  }, []);

  // Fetch submitted donors
  const fetchHistory = () => {
    fetch(`http://127.0.0.1:8000/api/donor/my/${user_id}/`)
      .then(res => res.json())
      .then(data => setHistory(data));
  };

  // Multi select districts
  const toggleDistrict = (d) => {
    let arr = [...form.available_districts];
    arr.includes(d) ? arr = arr.filter(x => x !== d) : arr.push(d);
    setForm({ ...form, available_districts: arr });
  };

  // File upload
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes("image") && file.type !== "application/pdf") {
      setError("Only image or PDF allowed");
      return;
    }

    setError("");
    setForm({ ...form, file });
  };

  // Submit
  const submit = () => {
    if (!form.confirmed) return setError("Please confirm information");
    if (form.available_districts.length === 0) return setError("Select districts");
    if (!form.file) return setError("Upload document");

    const fd = new FormData();

    Object.keys(form).forEach(k => {
      if (k === "available_districts")
        fd.append(k, form.available_districts.join(","));
      else if (k === "file")
        fd.append("confirmation_file", form.file);
      else
        fd.append(k, form[k]);
    });

    fd.append("user", user_id);

    fetch("http://127.0.0.1:8000/api/donor/submit/", {
      method: "POST",
      body: fd
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Submission failed");
        }
        return data;
      })
      .then(() => {
        alert("Request submitted successfully!");
        setForm({ ...form, available_districts: [], confirmed: false, file: null });
        fetchHistory();
      })
      .catch(err => setError(err.message));
  };


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Sidebar */}
      <UserSidebar activeItem={activeItem} userName={userName} bloodGroup={userBloodGroup} profilePicture={profilePicture} />

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
                <Bloodtype style={{ fontSize: 28, color: '#900000' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Donate Blood</h1>
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
          className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          {/* Error Message */}
          {error && (
            <div
              className="mb-6 p-4 rounded-xl flex items-center space-x-3"
              style={{
                backgroundColor: '#ffebee',
                border: '1px solid #f44336',
                animation: 'fadeInUp 0.3s ease-out',
              }}
            >
              <Warning style={{ color: '#f44336', fontSize: 24 }} />
              <p style={{ color: '#f44336', fontWeight: 500 }}>{error}</p>
            </div>
          )}

          {/* Form Section */}
          <div
            className="bg-white rounded-2xl p-8 mb-8"
            style={{
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              animation: 'fadeInUp 0.6s ease-out 0.3s both',
            }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>
              Personal Information
            </h2>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Person style={{ fontSize: 18, color: '#900000' }} />
                  <span>Full Name</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Cake style={{ fontSize: 18, color: '#900000' }} />
                  <span>Date of Birth</span>
                </label>
                <input
                  type="text"
                  value={form.dob}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Wc style={{ fontSize: 18, color: '#900000' }} />
                  <span>Gender</span>
                </label>
                <input
                  type="text"
                  value={form.gender}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Bloodtype style={{ fontSize: 18, color: '#900000' }} />
                  <span>Blood Group</span>
                </label>
                <input
                  type="text"
                  value={form.blood_group}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Email style={{ fontSize: 18, color: '#900000' }} />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone style={{ fontSize: 18, color: '#900000' }} />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Home style={{ fontSize: 18, color: '#900000' }} />
                  <span>Address</span>
                </label>
                <input
                  type="text"
                  value={form.address}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <LocationOn style={{ fontSize: 18, color: '#900000' }} />
                  <span>Home District</span>
                </label>
                <input
                  type="text"
                  value={form.district}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            {/* Compatibility Hub Section */}
            <div
              className="bg-white rounded-2xl p-8 mb-8 overflow-hidden relative"
              style={{
                boxShadow: '0 8px 32px rgba(144, 0, 0, 0.08)',
                animation: 'fadeInUp 0.6s ease-out 0.4s both',
                border: '1px solid rgba(144, 0, 0, 0.1)',
                background: 'linear-gradient(to bottom right, #ffffff, #fffdfd)'
              }}
            >
              {/* Decorative background element */}
              <div
                className="absolute -right-6 -top-6 w-32 h-32 opacity-5 pointer-events-none"
                style={{ color: '#900000' }}
              >
                <Bloodtype style={{ fontSize: 128 }} />
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div
                    className="p-3 rounded-2xl shadow-inner"
                    style={{ backgroundColor: 'rgba(144,0,0,0.05)' }}
                  >
                    <Bloodtype style={{ fontSize: 28, color: '#900000' }} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Compatibility Hub</h3>
                    <p className="text-sm font-medium text-gray-400">Your unique blood network profile</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 px-4 py-2 rounded-xl bg-red-900 text-white font-bold flex items-center shadow-lg">
                  <span className="mr-2 opacity-70 text-xs uppercase tracking-widest">Type</span>
                  <span className="text-xl">{userBloodGroup || '--'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* GIVE SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">You Can Give To</h4>
                  </div>

                  <div
                    className="p-6 rounded-3xl border-2 transition-all duration-500 hover:shadow-xl group"
                    style={{
                      borderColor: 'rgba(144, 0, 0, 0.1)',
                      background: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(() => {
                        const giveMap = {
                          'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
                          'O+': ['O+', 'A+', 'B+', 'AB+'],
                          'A-': ['A-', 'A+', 'AB-', 'AB+'],
                          'A+': ['A+', 'AB+'],
                          'B-': ['B-', 'B+', 'AB-', 'AB+'],
                          'B+': ['B+', 'AB+'],
                          'AB-': ['AB-', 'AB+'],
                          'AB+': ['AB+']
                        };
                        const recipients = giveMap[userBloodGroup] || [];
                        return recipients.map((group, idx) => (
                          <div
                            key={group}
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 transform group-hover:scale-110"
                            style={{
                              backgroundColor: 'white',
                              color: '#900000',
                              border: '1.5px solid #900000',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                              animation: `scaleIn 0.3s ease-out ${0.1 + idx * 0.05}s both`
                            }}
                          >
                            {group}
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="flex items-center text-xs font-semibold text-gray-500 bg-white/50 p-3 rounded-xl border border-dashed border-gray-200">
                      <LocalHospital style={{ fontSize: 16, marginRight: 8, color: '#900000' }} />
                      <span>
                        {userBloodGroup === 'O-' ? 'Universal Donor: Your blood helps everyone in critical emergencies.' : `Your ${userBloodGroup} blood is a match for these groups.`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RECEIVE SECTION */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 px-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest">You Can Receive From</h4>
                  </div>

                  <div
                    className="p-6 rounded-3xl border-2 transition-all duration-500 hover:shadow-xl group"
                    style={{
                      borderColor: 'rgba(25, 118, 210, 0.1)',
                      background: 'rgba(255, 255, 255, 0.5)'
                    }}
                  >
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(() => {
                        const receiveMap = {
                          'O-': ['O-'],
                          'O+': ['O-', 'O+'],
                          'A-': ['O-', 'A-'],
                          'A+': ['O-', 'O+', 'A-', 'A+'],
                          'B-': ['O-', 'B-'],
                          'B+': ['O-', 'O+', 'B-', 'B+'],
                          'AB-': ['O-', 'A-', 'B-', 'AB-'],
                          'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
                        };
                        const donors = receiveMap[userBloodGroup] || [];
                        return donors.map((group, idx) => (
                          <div
                            key={group}
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm transition-all duration-300 transform group-hover:scale-110"
                            style={{
                              backgroundColor: 'white',
                              color: '#1976d2',
                              border: '1.5px solid #1976d2',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                              animation: `scaleIn 0.3s ease-out ${0.1 + idx * 0.05}s both`
                            }}
                          >
                            {group}
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="flex items-center text-xs font-semibold text-gray-500 bg-white/50 p-3 rounded-xl border border-dashed border-gray-200">
                      <CheckCircle style={{ fontSize: 16, marginRight: 8, color: '#1976d2' }} />
                      <span>
                        {userBloodGroup === 'AB+' ? 'Universal Recipient: You can receive blood from any blood group!' : `Donors with these groups can safely provide blood for you.`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Bar */}
              <div className="mt-8 flex items-center justify-center space-x-8 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Bloodtype className="text-red-900" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <LocalHospital className="text-red-900" />
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                <CheckCircle className="text-red-900" />
              </div>
            </div>

            {/* Available Districts Section */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Map style={{ fontSize: 24, color: '#900000' }} />
                <h3 className="text-xl font-bold" style={{ color: '#1a1a1a' }}>
                  Where Can You Donate Blood?
                </h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Select all districts where you're willing to travel to donate blood
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {districts.map(d => {
                  const isSelected = form.available_districts.includes(d);
                  return (
                    <button
                      key={d}
                      onClick={() => toggleDistrict(d)}
                      className="px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300"
                      style={{
                        backgroundColor: isSelected ? '#900000' : 'white',
                        color: isSelected ? 'white' : '#666',
                        border: `2px solid ${isSelected ? '#900000' : '#e0e0e0'}`,
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected ? '0 4px 12px rgba(144, 0, 0, 0.2)' : 'none',
                      }}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <CloudUpload style={{ fontSize: 18, color: '#900000' }} />
                <span>Upload Eligibility check document which you have received via email(Image or PDF)</span>
              </label>
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300"
                style={{
                  borderColor: form.file ? '#4caf50' : '#e0e0e0',
                  backgroundColor: form.file ? '#e8f5e9' : '#f8f9fa',
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFile}
                  accept="image/*,.pdf"
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  {form.file ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircleOutline style={{ fontSize: 32, color: '#4caf50' }} />
                      <div>
                        <p className="font-semibold" style={{ color: '#4caf50' }}>
                          File Selected
                        </p>
                        <p className="text-sm text-gray-600">{form.file.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <CloudUpload style={{ fontSize: 48, color: '#900000', marginBottom: 8 }} />
                      <p className="font-semibold text-gray-700 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, or PDF (max. 5MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="mb-8">
              <label
                className="flex items-start space-x-3 cursor-pointer p-4 rounded-xl transition-all duration-300"
                style={{
                  backgroundColor: form.confirmed ? 'rgba(144, 0, 0, 0.05)' : 'transparent',
                  border: `2px solid ${form.confirmed ? '#900000' : '#e0e0e0'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={form.confirmed}
                  onChange={e => setForm({ ...form, confirmed: e.target.checked })}
                  style={{
                    width: 20,
                    height: 20,
                    marginTop: 2,
                    accentColor: '#900000',
                  }}
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    I confirm that all information is true and accurate
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    By checking this box, you agree that the information provided is correct and you're eligible to donate blood.
                  </p>
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={submit}
              className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300"
              style={{
                backgroundColor: '#900000',
                boxShadow: '0 4px 12px rgba(144, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#700000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(144, 0, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#900000';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(144, 0, 0, 0.3)';
              }}
            >
              Submit Donor Request
            </button>
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{
                  color: '#1a1a1a',
                  animation: 'fadeInUp 0.6s ease-out 0.5s both',
                }}
              >
                My Donor Requests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((h, idx) => (
                  <DonorRequestCard key={h.id} donor={h} delay={0.6 + idx * 0.1} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}