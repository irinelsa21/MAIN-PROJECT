import React, { useEffect, useState } from "react";
import {
  Bloodtype,
  CheckCircle,
  Person,
  MonitorWeight,
  Science,
  CalendarMonth,
  Medication,
  Brush,
  HealthAndSafety,
  Email,
  Close,
  ErrorOutline,
  ArrowForward,
  ArrowBack,
  Verified,
} from '@mui/icons-material';
import UserSidebar from './UserSidebar';
import UserAvatar from './UserAvatar';

const StepIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {[...Array(totalSteps)].map((_, idx) => (
          <div key={idx} className="flex items-center" style={{ flex: idx < totalSteps - 1 ? 1 : 'initial' }}>
            <div
              className="relative flex items-center justify-center transition-all duration-500"
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: idx < currentStep ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
                  idx === currentStep ? 'linear-gradient(135deg, #900000 0%, #c62828 100%)' : '#e5e7eb',
                boxShadow: idx === currentStep ? '0 4px 20px rgba(144, 0, 0, 0.3)' : 'none',
                transform: idx === currentStep ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {idx < currentStep ? (
                <CheckCircle style={{ fontSize: 24, color: 'white' }} />
              ) : (
                <span className="font-bold" style={{ color: idx === currentStep ? 'white' : '#9ca3af' }}>
                  {idx + 1}
                </span>
              )}
              {idx === currentStep && (
                <div
                  style={{
                    position: 'absolute',
                    inset: -4,
                    borderRadius: '50%',
                    border: '3px solid #900000',
                    opacity: 0.3,
                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  }}
                />
              )}
            </div>
            {idx < totalSteps - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '3px',
                  marginLeft: '12px',
                  marginRight: '12px',
                  background: idx < currentStep ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : '#e5e7eb',
                  transition: 'all 0.5s',
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-3">
        {['Basic Info', 'Health Data', 'Medical History'].map((label, idx) => (
          <span
            key={idx}
            className="text-xs font-medium"
            style={{
              color: idx <= currentStep ? '#900000' : '#9ca3af',
              width: '100px',
              textAlign: idx === 0 ? 'left' : idx === 2 ? 'right' : 'center',
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

const FloatingLabelInput = ({ icon: Icon, label, type = "text", name, value, onChange, placeholder, error, disabled }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="mb-6 relative">
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=" "
          disabled={disabled}
          className={`peer w-full pl-12 pr-4 py-4 rounded-xl transition-all duration-300 text-sm ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white cursor-text'}`}
          style={{
            border: `2px solid ${error ? '#ef4444' : isFocused ? '#900000' : '#e5e7eb'}`,
            outline: 'none',
          }}
        />
        <label
          className="absolute left-12 transition-all duration-300 pointer-events-none"
          style={{
            top: isFocused || hasValue ? '-10px' : '16px',
            fontSize: isFocused || hasValue ? '11px' : '14px',
            fontWeight: isFocused || hasValue ? '600' : '500',
            color: error ? '#ef4444' : isFocused ? '#900000' : '#9ca3af',
            backgroundColor: isFocused || hasValue ? 'white' : 'transparent',
            padding: isFocused || hasValue ? '0 6px' : '0',
          }}
        >
          {label}
        </label>
        <div
          className="absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300"
          style={{ color: error ? '#ef4444' : isFocused ? '#900000' : '#9ca3af' }}
        >
          <Icon style={{ fontSize: 20 }} />
        </div>
        {error && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <ErrorOutline style={{ fontSize: 20, color: '#ef4444' }} />
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 ml-1 flex items-center">
          <span>{error}</span>
        </p>
      )}
      {!error && isFocused && placeholder && (
        <p className="text-xs text-gray-500 mt-1 ml-1">{placeholder}</p>
      )}
    </div>
  );
};

const AnimatedRadioCard = ({ icon: Icon, question, name, value, onChange, options = ['Yes', 'No'] }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
          style={{
            background: 'linear-gradient(135deg, rgba(144, 0, 0, 0.1) 0%, rgba(144, 0, 0, 0.05) 100%)',
          }}
        >
          <Icon style={{ fontSize: 20, color: '#900000' }} />
        </div>
        <p className="text-sm font-semibold text-gray-800">{question}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => {
          const isSelected = value === (option.toLowerCase() === 'yes').toString();
          return (
            <label
              key={option}
              className="relative cursor-pointer group"
            >
              <input
                type="radio"
                name={name}
                value={option.toLowerCase() === 'yes'}
                checked={isSelected}
                onChange={onChange}
                className="hidden"
              />
              <div
                className="p-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
                style={{
                  border: `2px solid ${isSelected ? '#900000' : '#e5e7eb'}`,
                  backgroundColor: isSelected ? 'rgba(144, 0, 0, 0.05)' : 'white',
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: isSelected ? '0 4px 12px rgba(144, 0, 0, 0.15)' : 'none',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    border: `2px solid ${isSelected ? '#900000' : '#d1d5db'}`,
                    backgroundColor: isSelected ? '#900000' : 'white',
                  }}
                >
                  {isSelected && <CheckCircle style={{ fontSize: 14, color: 'white' }} />}
                </div>
                <span
                  className="font-semibold text-sm"
                  style={{ color: isSelected ? '#900000' : '#6b7280' }}
                >
                  {option}
                </span>
              </div>
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.2)',
                  }}
                />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

const ProgressAlert = ({ type, message, onClose }) => {
  const isSuccess = type === 'success';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{
          width: '480px',
          animation: 'slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          color: '#900000',
          marginBottom: '8px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            height: '4px',
            background: isSuccess
              ? 'linear-gradient(90deg, #10b981, #059669)'
              : 'linear-gradient(90deg, #900000, #900000)',
            animation: 'shimmer 2s infinite',
          }}
        />

        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div
              className="relative"
              style={{
                animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: isSuccess
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #900000 0%, #900000 100%)',
                  boxShadow: isSuccess
                    ? '0 8px 32px rgba(16, 185, 129, 0.4)'
                    : '0 8px 32px rgba(144, 0, 0, 0.4)',
                }}
              >
                {isSuccess ? (
                  <Verified style={{ fontSize: 48, color: 'white' }} />
                ) : (
                  <ErrorOutline style={{ fontSize: 48, color: 'white' }} />
                )}
              </div>
              <div
                style={{
                  position: 'absolute',
                  inset: -8,
                  borderRadius: '50%',
                  border: `3px solid ${isSuccess ? '#10b981' : '#900000'}`,
                  opacity: 0.3,
                  animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                }}
              />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-center mb-4" style={{ color: '#1f2937' }}>
            {isSuccess ? 'Assessment Complete!' : 'Validation Error'}
          </h3>

          <p className="text-gray-600 text-center leading-relaxed mb-8">
            {message}
          </p>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden"
            style={{
              background: isSuccess
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #900000 0%, #900000 100%)',
              boxShadow: isSuccess
                ? '0 4px 20px rgba(16, 185, 129, 0.3)'
                : '0 4px 20px rgba(144, 0, 0, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isSuccess
                ? '0 6px 30px rgba(16, 185, 129, 0.4)'
                : '0 6px 30px rgba(144, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isSuccess
                ? '0 4px 20px rgba(16, 185, 129, 0.3)'
                : '0 4px 20px rgba(144, 0, 0, 0.3)';
            }}
          >
            {isSuccess ? 'Perfect!' : 'Got it'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all duration-200"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <Close style={{ fontSize: 20, color: '#6b7280' }} />
        </button>
      </div>
    </div>
  );
};

export default function EligibilityCheck() {
  const user_id = localStorage.getItem("user_id");
  const [activeItem, setActiveItem] = useState('eligibility');
  const [currentStep, setCurrentStep] = useState(0);
  const [user, setUser] = useState({});
  const [form, setForm] = useState({
    weight: "",
    hemoglobin: "",
    last_donation_date: "",
    medications: "false",
    tattoo: "false",
    illness: "false",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDatePreFilled, setIsDatePreFilled] = useState(false);

  useEffect(() => {
    if (!user_id) {
      window.location.href = '/login';
      return;
    }

    fetch(`http://127.0.0.1:8000/api/eligibility/user/${user_id}/`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        if (data.last_donated_at) {
          setForm(prev => ({ ...prev, last_donation_date: data.last_donated_at }));
          setIsDatePreFilled(true);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [user_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!form.weight) newErrors.weight = 'Weight is required';
      else if (parseFloat(form.weight) < 50) newErrors.weight = 'Minimum 50 kg required';

      if (!form.hemoglobin) newErrors.hemoglobin = 'Hemoglobin is required';
      else if (parseFloat(form.hemoglobin) < 12.5) newErrors.hemoglobin = 'Minimum 12.5 g/dl required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!user.dob || !user.email) {
      setAlert({
        type: 'error',
        message: 'User information is incomplete. Please update your profile.',
      });
      return;
    }

    const payload = {
      user_id: user_id,
      dob: user.dob,
      weight: form.weight,
      hemoglobin: form.hemoglobin,
      last_donation_date: form.last_donation_date || "",
      medications: form.medications,
      tattoo: form.tattoo,
      illness: form.illness,
      email: user.email,
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/eligibility/check/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setAlert({
          type: 'error',
          message: data.details || 'Unable to process your eligibility check. Please verify your information.',
        });
        return;
      }

      setAlert({
        type: 'success',
        message: 'Your comprehensive eligibility report has been generated and sent to your email. Check your inbox!',
      });

    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Unable to connect to the server. Please check your connection and try again.',
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ animation: 'fadeInRight 0.4s ease-out' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: '#1f2937' }}>
              <Person style={{ fontSize: 24, color: '#900000', marginRight: 8 }} />
              Profile Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', value: user.name, icon: Person },
                { label: 'Date of Birth', value: user.dob, icon: CalendarMonth },
                { label: 'Email Address', value: user.email, icon: Email },
                { label: 'Phone Number', value: user.phone, icon: Person }, // Changed from Dashboard to Person, assuming Dashboard was a placeholder
                { label: 'Gender', value: user.gender, icon: Person },
                { label: 'Blood Type', value: user.blood_group, icon: Bloodtype },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
                    border: '1px solid #e5e7eb',
                    animation: `fadeInUp 0.4s ease-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="flex items-center mb-2">
                    <item.icon style={{ fontSize: 16, color: '#900000', marginRight: 6 }} />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
                  </div>
                  <p className="text-base font-bold text-gray-900">{item.value || 'Not provided'}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div style={{ animation: 'fadeInRight 0.4s ease-out' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: '#1f2937' }}>
              <HealthAndSafety style={{ fontSize: 24, color: '#900000', marginRight: 8 }} />
              Health Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FloatingLabelInput
                icon={MonitorWeight}
                label="Weight (kg)"
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="Minimum 50 kg required for donation"
                error={errors.weight}
              />
              <FloatingLabelInput
                icon={Science}
                label="Hemoglobin Level (g/dl)"
                type="number"
                name="hemoglobin"
                value={form.hemoglobin}
                onChange={handleChange}
                placeholder="Minimum 12.5 g/dl required"
                error={errors.hemoglobin}
              />
            </div>
            <FloatingLabelInput
              icon={CalendarMonth}
              label="Last Donation Date (Optional)"
              type="date"
              name="last_donation_date"
              value={form.last_donation_date}
              onChange={handleChange}
              disabled={isDatePreFilled}
              placeholder={isDatePreFilled ? "This date is pre-filled from your donation history" : "Leave blank if this is your first donation"}
            />
          </div>
        );

      case 2:
        return (
          <div style={{ animation: 'fadeInRight 0.4s ease-out' }}>
            <h3 className="text-xl font-bold mb-6 flex items-center" style={{ color: '#1f2937' }}>
              <Medication style={{ fontSize: 24, color: '#900000', marginRight: 8 }} />
              Medical Screening
            </h3>

            <AnimatedRadioCard
              icon={Medication}
              question="Have you taken any medications in the past 48 hours?"
              name="medications"
              value={form.medications}
              onChange={handleChange}
            />

            <AnimatedRadioCard
              icon={Brush}
              question="Have you gotten a tattoo or piercing in the last 6 months?"
              name="tattoo"
              value={form.tattoo}
              onChange={handleChange}
            />

            <AnimatedRadioCard
              icon={HealthAndSafety}
              question="Do you have any history of major illness or chronic conditions?"
              name="illness"
              value={form.illness}
              onChange={handleChange}
            />
          </div>
        );

      default:
        return null;
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
            <Bloodtype style={{ fontSize: 40, color: 'white' }} />
          </div>
          <p className="text-gray-600 font-medium">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, rgb(254, 250, 250) 0%, #ffffff 100%)' }}>
      <UserSidebar activeItem={activeItem} userName={user.name || 'User'} bloodGroup={user.blood_group || 'N/A'} profilePicture={user.profile_picture} />

      <div style={{ marginLeft: '280px' }}>
        <header
          className="sticky top-0 z-40 transition-all duration-300"
          style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            animation: 'slideInRight 0.5s ease-out 0.2s both',
            height: '64px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div className="px-8 h-full flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #900000 0%, #c62828 100%)',
                  boxShadow: '0 4px 12px rgba(144, 0, 0, 0.2)',
                }}
              >
                <CheckCircle style={{ fontSize: 20, color: 'white' }} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Eligibility Assessment</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Verification Step {currentStep + 1} of 3</p>
              </div>
            </div>

            <UserAvatar name={user.name || 'User'} profilePicture={user.profile_picture} />
          </div>
        </header>

        <main
          className="max-w-4xl mx-auto px-8 py-10"
          style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
        >
          <StepIndicator currentStep={currentStep} totalSteps={3} />

          <div
            className="p-8 rounded-3xl mb-6"
            style={{
              backgroundColor: 'white',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(0, 0, 0, 0.05)',
              animation: 'fadeInUp 0.5s ease-out 0.5s both',
            }}
          >
            {renderStepContent()}
          </div>

          <div
            className="flex justify-between items-center"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.6s both' }}
          >
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              style={{
                backgroundColor: currentStep === 0 ? '#f3f4f6' : 'white',
                color: currentStep === 0 ? '#9ca3af' : '#374151',
                border: '2px solid #e5e7eb',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              <ArrowBack style={{ fontSize: 20 }} />
              <span>Back</span>
            </button>

            {currentStep < 2 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #900000 0%, #c62828 100%)',
                  boxShadow: '0 4px 16px rgba(144, 0, 0, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(144, 0, 0, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(144, 0, 0, 0.25)';
                }}
              >
                <span>Continue</span>
                <ArrowForward style={{ fontSize: 20 }} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 flex items-center space-x-2"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.25)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(16, 185, 129, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.25)';
                }}
              >
                <Email style={{ fontSize: 20 }} />
                <span>Submit & Email Report</span>
              </button>
            )}
          </div>
        </main>
      </div>

      {alert && (
        <ProgressAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes ping { 
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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
      `}</style>
    </div>
  );
}