import React, { useEffect, useState } from "react";
import {
  Bloodtype,
  LocalHospital,
  Warning,
  CheckCircleOutline,
  Schedule,
  Email,
  Phone,
  Cake,
  Wc,
  LocationOn,
  Home,
  FamilyRestroom,
  CalendarToday,
  Assignment,
  CloudUpload,
  PersonOutline,
  Business,
  Person,
} from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';


const BloodRequestCard = ({ request, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    PENDING: { color: '#ff9800', bg: '#fff3e0', label: 'Pending', icon: Schedule },
    SEEN: { color: '#4caf50', bg: '#e8f5e9', label: 'Seen by Admin', icon: CheckCircleOutline },
  };

  const config = statusConfig[request.status] || statusConfig.PENDING;
  const StatusIcon = config.icon;

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
          {request.blood_group}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{request.patient_name}</h3>
        <p className="text-sm text-gray-600 mb-4">{request.blood_component}</p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-gray-700">
            <Business style={{ fontSize: 18, color: '#900000' }} />
            <span className="text-sm">{request.hospital_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BloodRequestForm() {
  const [activeItem, setActiveItem] = useState('request');
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

  const bloodComponents = ["Whole Blood", "Plasma", "Platelets"];

  const [form, setForm] = useState({
    requester_name: "",
    requester_phone: "",
    patient_name: "",
    patient_dob: "",
    gender: "",
    blood_group: "",
    blood_component: "",
    address: "",
    email: "",
    phone: "",
    district: "",
    relative_phone: "",
    hospital_name: "",
    hospital_date: "",
    hospital_ip_number: "",
    id_proof: null,
    confirmed: false,
  });

  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  // FETCH USER
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/blood-request/user/${user_id}/`)
      .then(res => res.json())
      .then(data => {
        setForm(f => ({
          ...f,
          requester_name: data.name,
          requester_phone: data.phone
        }));
        setUserName(data.name);
        setUserBloodGroup(data.blood_group || 'N/A');
        setProfilePicture(data.profile_picture);
      });

    fetchHistory();
  }, []);

  const fetchHistory = () => {
    fetch(`http://127.0.0.1:8000/api/blood-request/my/${user_id}/`)
      .then(res => res.json())
      .then(data => setHistory(data));
  };

  const handleChange = e => {
    let { name, value } = e.target;

    // Restrict phone fields to numbers only
    if (name === "phone" || name === "relative_phone") {
      value = value.replace(/[^0-9]/g, '');
    }

    setForm({ ...form, [name]: value });
  };

  const handleFile = e => {
    setForm({ ...form, id_proof: e.target.files[0] });
  };

  const validate = () => {
    for (let key in form) {
      if (!form[key] && key !== "confirmed") {
        setError("All fields are mandatory");
        return false;
      }
    }
    if (!form.email.includes('@')) {
      setError("Invalid patient email format");
      return false;
    }
    if (form.phone.length !== 10) {
      setError("Patient phone number must be 10 digits");
      return false;
    }
    if (form.relative_phone.length !== 10) {
      setError("Relative phone number must be 10 digits");
      return false;
    }
    if (!form.confirmed) {
      setError("Please confirm the information");
      return false;
    }
    return true;
  };

  const submit = () => {
    if (!validate()) return;

    const fd = new FormData();
    Object.keys(form).forEach(k => fd.append(k, form[k]));
    fd.append("user", user_id);

    fetch("http://127.0.0.1:8000/api/blood-request/submit/", {
      method: "POST",
      body: fd
    })
      .then(() => {
        setMsg(
          "A donor will be assigned soon. Details will be shared via patient email once admin marks it as seen."
        );
        setError("");
        fetchHistory();
      });
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
                <LocalHospital style={{ fontSize: 28, color: '#900000' }} />
                <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>Request Blood</h1>
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
          {/* Success Message */}
          {msg && (
            <div
              className="mb-6 p-4 rounded-xl flex items-start space-x-3"
              style={{
                backgroundColor: '#e8f5e9',
                border: '1px solid #4caf50',
                animation: 'fadeInUp 0.3s ease-out',
              }}
            >
              <CheckCircleOutline style={{ color: '#4caf50', fontSize: 24, flexShrink: 0 }} />
              <p style={{ color: '#2e7d32', fontWeight: 500 }}>{msg}</p>
            </div>
          )}

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
            {/* Requester Information */}
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>
              Requester Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <PersonOutline style={{ fontSize: 18, color: '#900000' }} />
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  value={form.requester_name}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone style={{ fontSize: 18, color: '#900000' }} />
                  <span>Your Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={form.requester_phone}
                  disabled
                  className="w-full px-4 py-3 rounded-xl bg-gray-100 border-2 border-gray-200"
                  style={{ color: '#666', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            {/* Patient Information */}
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#1a1a1a' }}>
              Patient Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <PersonOutline style={{ fontSize: 18, color: '#900000' }} />
                  <span>Patient Name</span>
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={form.patient_name}
                  placeholder="Enter patient name"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Cake style={{ fontSize: 18, color: '#900000' }} />
                  <span>Patient Date of Birth</span>
                </label>
                <input
                  type="date"
                  name="patient_dob"
                  value={form.patient_dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Wc style={{ fontSize: 18, color: '#900000' }} />
                  <span>Gender</span>
                </label>
                <select
                  name="gender"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                  style={{ color: form.gender ? '#1a1a1a' : '#999' }}
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Bloodtype style={{ fontSize: 18, color: '#900000' }} />
                  <span>Blood Group</span>
                </label>
                <select
                  name="blood_group"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                  style={{ color: form.blood_group ? '#1a1a1a' : '#999' }}
                >
                  <option value="">Select Blood Group</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Bloodtype style={{ fontSize: 18, color: '#900000' }} />
                  <span>Blood Component</span>
                </label>
                <select
                  name="blood_component"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                  style={{ color: form.blood_component ? '#1a1a1a' : '#999' }}
                >
                  <option value="">Select Blood Component</option>
                  {bloodComponents.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Email style={{ fontSize: 18, color: '#900000' }} />
                  <span>Patient Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="patient@example.com"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone style={{ fontSize: 18, color: '#900000' }} />
                  <span>Patient Phone</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <LocationOn style={{ fontSize: 18, color: '#900000' }} />
                  <span>District</span>
                </label>
                <select
                  name="district"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                  style={{ color: form.district ? '#1a1a1a' : '#999' }}
                >
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Home style={{ fontSize: 18, color: '#900000' }} />
                  <span>Address</span>
                </label>
                <textarea
                  name="address"
                  placeholder="Enter full address"
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <FamilyRestroom style={{ fontSize: 18, color: '#900000' }} />
                  <span>Relative Phone Number</span>
                </label>
                <input
                  type="tel"
                  name="relative_phone"
                  placeholder="10-digit number"
                  value={form.relative_phone}
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Hospital Information */}
            <h2 className="text-2xl font-bold mb-6 pt-8 border-t border-gray-200" style={{ color: '#1a1a1a' }}>
              Hospital Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Business style={{ fontSize: 18, color: '#900000' }} />
                  <span>Hospital Name</span>
                </label>
                <input
                  type="text"
                  name="hospital_name"
                  placeholder="Enter hospital name"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <CalendarToday style={{ fontSize: 18, color: '#900000' }} />
                  <span>Required Date</span>
                </label>
                <input
                  type="date"
                  name="hospital_date"
                  value={form.hospital_date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Assignment style={{ fontSize: 18, color: '#900000' }} />
                  <span>Hospital IP Number</span>
                </label>
                <input
                  type="text"
                  name="hospital_ip_number"
                  placeholder="Enter IP number"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-8">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <CloudUpload style={{ fontSize: 18, color: '#900000' }} />
                <span>Upload ID Proof</span>
              </label>
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300"
                style={{
                  borderColor: form.id_proof ? '#4caf50' : '#e0e0e0',
                  backgroundColor: form.id_proof ? '#e8f5e9' : '#f8f9fa',
                }}
              >
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFile}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                  {form.id_proof ? (
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircleOutline style={{ fontSize: 32, color: '#4caf50' }} />
                      <div>
                        <p className="font-semibold" style={{ color: '#4caf50' }}>
                          File Selected
                        </p>
                        <p className="text-sm text-gray-600">{form.id_proof.name}</p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <CloudUpload style={{ fontSize: 48, color: '#900000', marginBottom: 8 }} />
                      <p className="font-semibold text-gray-700 mb-1">
                        Click to upload ID proof
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
                    I confirm that all information provided is true and accurate
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    By checking this box, you agree that the information is correct and understand that false information may delay the blood request process.
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
              Submit Blood Request
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
                My Blood Requests
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((h, idx) => (
                  <BloodRequestCard key={h.id} request={h} delay={0.6 + idx * 0.1} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}