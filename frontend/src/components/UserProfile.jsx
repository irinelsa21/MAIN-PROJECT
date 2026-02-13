import React, { useState, useEffect } from 'react';
import { Person, CheckCircleOutline, ErrorOutline, Close, Edit, Save, Cancel, PhotoCamera } from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';

const CustomAlert = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === 'success' ? CheckCircleOutline : ErrorOutline;
  const bg = type === 'success' ? '#10b981' : '#ef4444';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        background: bg,
        borderRadius: '12px',
        padding: '14px 18px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        opacity: isVisible ? 1 : 0,
        color: 'white',
        transition: 'opacity 0.3s ease-out',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <Icon style={{ fontSize: 24 }} />
      <p style={{ fontWeight: 600, flex: 1, margin: 0 }}>{message}</p>
      <button
        onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          color: 'white'
        }}
      >
        <Close style={{ fontSize: 18 }} />
      </button>
    </div>
  );
};

const UserProfile = () => {
  const userId = localStorage.getItem('user_id') || 3;
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeItem, setActiveItem] = useState('profile');
  const [alertConfig, setAlertConfig] = useState({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/user-profile/${userId}/`);
      const data = await res.json();
      setProfile(data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("email", profile.email);
    formData.append("phone", profile.phone);
    formData.append("address", profile.address);
    formData.append("district", profile.district || "");
    if (image) formData.append("profile_picture", image);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/user-profile/${userId}/`, { method: 'PUT', body: formData });
      if (res.ok) {
        setAlertConfig({ show: true, message: "Profile Updated Successfully!", type: "success" });
        setIsEditing(false);
        setImagePreview(null);
        fetchProfile();
      } else setAlertConfig({ show: true, message: "Failed to update profile", type: "error" });
    } catch (err) {
      setAlertConfig({ show: true, message: "Server error", type: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgb(254, 250, 250) 0%, #ffffff 100%)' }}>
        <div className="text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #900000 0%, #c62828 100%)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            <Person style={{ fontSize: 40, color: 'white' }} />
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fa' }}>
      <UserSidebar activeItem={activeItem} userName={profile.name} bloodGroup={profile.blood_group} profilePicture={profile.profile_picture} />

      <div style={{ marginLeft: '280px' }}>
        <header
          className="sticky top-0 z-40 transition-all duration-300"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            animation: 'slideInRight 0.5s ease-out 0.2s both',
            height: '64px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div className="px-12 h-full flex justify-between items-center">
            <h1 className="text-2xl font-bold" style={{ color: '#1a1a1a' }}>User Profile</h1>
            <UserAvatar name={profile.name} profilePicture={profile.profile_picture} />
          </div>
        </header>

        <main
          className="max-w-7xl mx-auto px-12 py-8"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          {alertConfig.show && (
            <CustomAlert
              message={alertConfig.message}
              type={alertConfig.type}
              onClose={() => setAlertConfig({ ...alertConfig, show: false })}
            />
          )}

          <style>{`
            .avatar{width:100px;height:100px;border-radius:50%;object-fit:cover;border:4px solid white}
            .avatar-placeholder{width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;border:4px solid white}
            .camera-btn{position:absolute;bottom:0;right:0;width:32px;height:32px;border-radius:50%;background:white;border:2px solid #900000;display:flex;align-items:center;justify-content:center;cursor:pointer}
            .form-input,.form-select,.form-textarea{width:100%;padding:12px;border:2px solid #ddd;border-radius:8px;font-size:14px;font-weight:600;color:#333}
            .form-input:focus,.form-select:focus,.form-textarea:focus{outline:none;border-color:#900000;box-shadow:0 0 0 3px rgba(144,0,0,0.1)}
            .form-textarea{resize:vertical;min-height:80px}
            
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

          <div className="max-w-2xl mx-auto">
            <div
              style={{
                background: '#900000',
                padding: '30px',
                borderRadius: '16px 16px 0 0',
                textAlign: 'center',
                animation: 'fadeInUp 0.5s ease-out 0.4s both',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  marginBottom: '15px',
                  animation: 'scaleIn 0.5s ease-out 0.6s both',
                }}
              >
                {imagePreview || profile.profile_picture ? (
                  <img className="avatar" src={imagePreview || `http://127.0.0.1:8000${profile.profile_picture}`} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">
                    <span style={{ fontSize: 40, color: 'white', fontWeight: 'bold' }}>
                      {profile.name ? (profile.name.trim().split(/\s+/).length > 1 ? (profile.name.trim().split(/\s+/)[0].charAt(0) + profile.name.trim().split(/\s+/).slice(-1)[0].charAt(0)).toUpperCase() : profile.name.charAt(0).toUpperCase()) : '??'}
                    </span>
                  </div>
                )}
                {isEditing && (
                  <label className="camera-btn">
                    <PhotoCamera style={{ fontSize: 16, color: '#900000' }} />
                    <input type="file" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
                  </label>
                )}
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 800, color: 'white', marginBottom: '5px', textTransform: 'uppercase' }}>
                {profile.name}
              </h1>
              <div style={{ display: 'inline-block', background: 'white', color: '#900000', padding: '6px 16px', borderRadius: '20px', fontWeight: 700 }}>
                {profile.blood_group}
              </div>
            </div>

            <div
              style={{
                background: 'white',
                padding: '25px',
                borderRadius: '0 0 16px 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                animation: 'fadeInUp 0.5s ease-out 0.5s both',
              }}
            >
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '25px' }}>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '10px 24px',
                      background: '#900000',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(144, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Edit style={{ fontSize: 16, marginRight: '6px' }} />Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleUpdate}
                      style={{
                        padding: '10px 24px',
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Save style={{ fontSize: 16, marginRight: '6px' }} />Save
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); setImagePreview(null); fetchProfile(); }}
                      style={{
                        padding: '10px 24px',
                        background: 'white',
                        color: '#666',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = '#900000';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = '#ddd';
                      }}
                    >
                      <Cancel style={{ fontSize: 16, marginRight: '6px' }} />Cancel
                    </button>
                  </>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                {[
                  { label: 'Date of Birth', value: profile.dob, editable: false },
                  { label: 'Gender', value: profile.gender, editable: false },
                ].map((field, idx) => (
                  <div
                    key={idx}
                    style={{ animation: `fadeInUp 0.4s ease-out ${0.6 + idx * 0.1}s both` }}
                  >
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#900000', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      {field.label}
                    </label>
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontWeight: 600 }}>
                      {field.value}
                    </div>
                  </div>
                ))}

                <div style={{ animation: 'fadeInUp 0.4s ease-out 0.8s both' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#900000', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email</label>
                  {isEditing ? (
                    <input className="form-input" name="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontWeight: 600 }}>{profile.email}</div>
                  )}
                </div>

                <div style={{ animation: 'fadeInUp 0.4s ease-out 0.9s both' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#900000', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Phone</label>
                  {isEditing ? (
                    <input className="form-input" name="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontWeight: 600 }}>{profile.phone}</div>
                  )}
                </div>

                <div style={{ animation: 'fadeInUp 0.4s ease-out 1s both' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#900000', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>District</label>
                  {isEditing ? (
                    <select className="form-select" value={profile.district || ""} onChange={(e) => setProfile({ ...profile, district: e.target.value })}>
                      <option value="">Select</option>
                      <option value="Alappuzha">Alappuzha</option>
                      <option value="Ernakulam">Ernakulam</option>
                      <option value="Idukki">Idukki</option>
                      <option value="Kannur">Kannur</option>
                      <option value="Kasaragod">Kasaragod</option>
                      <option value="Kollam">Kollam</option>
                      <option value="Kottayam">Kottayam</option>
                      <option value="Kozhikode">Kozhikode</option>
                      <option value="Malappuram">Malappuram</option>
                      <option value="Palakkad">Palakkad</option>
                      <option value="Pathanamthitta">Pathanamthitta</option>
                      <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                      <option value="Thrissur">Thrissur</option>
                      <option value="Wayanad">Wayanad</option>
                    </select>
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontWeight: 600 }}>{profile.district || "Not provided"}</div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1', animation: 'fadeInUp 0.4s ease-out 1.1s both' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#900000', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Address</label>
                  {isEditing ? (
                    <textarea className="form-textarea" value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                  ) : (
                    <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', fontWeight: 600 }}>{profile.address || "Not provided"}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;