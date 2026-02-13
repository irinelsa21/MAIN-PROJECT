import React, { useState } from "react";
import Logo from "./Logo";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    blood_group: "",
    dob: "",
    address: "",
    district: "",
    password: "",
    confirm_password: "",
    gender: ""
  });

  const [errors, setErrors] = useState({});
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    isValid: false,
  });

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);




    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    };
  };

  const validateAge = (dob) => {
    if (!dob) return false;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const [emailAvailable, setEmailAvailable] = React.useState(true);
  const [isCheckingEmail, setIsCheckingEmail] = React.useState(false);

  React.useEffect(() => {
    const checkEmail = async () => {
      if (!formData.email || !formData.email.includes('@')) {
        setEmailAvailable(true);
        return;
      }

      setIsCheckingEmail(true);
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/check-email/?email=${formData.email}`);
        const data = await response.json();
        setEmailAvailable(data.available);
      } catch (error) {
        console.error("Email check failed:", error);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const debounceTimer = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.email]);

  const handleChange = (e) => {
    let { name, value } = e.target;

    // Restrict phone field to numbers only
    if (name === "phone") {
      value = value.replace(/[^0-9]/g, '');
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    if (name === "password") {
      setPasswordValidation(validatePassword(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!validateAge(formData.dob)) {
      newErrors.dob = "You must be at least 18 years old";
    }

    if (!formData.email.includes('@')) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }


    if (!validatePassword(formData.password).isValid) {
      newErrors.password = "Password does not meet requirements";
    }

    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      setShowSuccessModal(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        blood_group: "",
        dob: "",
        address: "",
        password: "",
        confirm_password: "",
        gender: ""
      });
      setErrors({});
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      alert(error.message || "Server not reachable");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    window.location.href = '/login';
  };

  const handleClose = () => {
    window.location.href = '/';
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #900000 0%, #240b36 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        body::before {
          content: '';
          position: fixed;
          top: -10%;
          right: -5%;
          width: 400px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(144, 0, 0, 0.15) 0%, transparent 70%);
          border-radius: 50% 50% 40% 60% / 60% 40% 60% 40%;
          pointer-events: none;
          animation: float 8s ease-in-out infinite;
        }

        body::after {
          content: '';
          position: fixed;
          bottom: -15%;
          left: -8%;
          width: 450px;
          height: 550px;
          background: radial-gradient(ellipse, rgba(144, 0, 0, 0.12) 0%, transparent 70%);
          border-radius: 60% 40% 50% 50% / 40% 60% 40% 60%;
          pointer-events: none;
          animation: float 10s ease-in-out infinite reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        .register-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .register-form {
          background: white;
          padding: 40px 35px 50px;
          width: 100%;
          max-width: 520px;
          border-radius: 24px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
          animation: slideIn 0.5s ease-out;
          position: relative;
          overflow: hidden;
        }

        .register-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #900000, #b00000, #900000);
          background-size: 200% 100%;
          animation: gradientShift 3s ease infinite;
          z-index: 0;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .register-form > * {
          position: relative;
          z-index: 1;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-10px) rotate(-1deg); }
          20% { transform: translateX(10px) rotate(1deg); }
          30% { transform: translateX(-10px) rotate(-1deg); }
          40% { transform: translateX(10px) rotate(1deg); }
          50% { transform: translateX(-10px) rotate(-1deg); }
          60% { transform: translateX(10px) rotate(1deg); }
          70% { transform: translateX(-10px) rotate(-1deg); }
          80% { transform: translateX(10px) rotate(1deg); }
          90% { transform: translateX(-10px) rotate(-1deg); }
        }

        .shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }

        .icon-header {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          margin-bottom: 15px;
        }

        .icon-header svg {
          width: 70px;
          height: 70px;
          fill: #900000;
          filter: drop-shadow(0 4px 12px rgba(144, 0, 0, 0.3));
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .register-form h2 {
          text-align: center;
          color: #900000;
          margin-bottom: 8px;
          margin-top: 10px;
          font-size: 32px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .register-form p {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 14px;
          position: relative;
        }

        .register-form p::after {
          content: '💉';
          margin-left: 8px;
          font-size: 16px;
        }

        .form-group {
          margin-bottom: 16px;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          color: #333;
          font-weight: 600;
          font-size: 13px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 13px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #900000;
          box-shadow: 0 0 0 3px rgba(144, 0, 0, 0.1);
        }

        .form-group input:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
          color: #999;
        }

        .form-group textarea {
          resize: none;
          height: 70px;
          font-family: inherit;
        }

        .form-group select {
          cursor: pointer;
        }

        .error-message {
          color: #e74c3c;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .input-error {
          border-color: #e74c3c !important;
        }

        .password-requirements {
          margin-top: 10px;
          padding: 12px;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 12px;
        }

        .password-requirements h4 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 13px;
        }

        .requirement {
          display: flex;
          align-items: center;
          margin: 4px 0;
          color: #666;
        }

        .requirement.met {
          color: #27ae60;
        }

        .requirement::before {
          content: "✗";
          margin-right: 8px;
          font-weight: bold;
        }

        .requirement.met::before {
          content: "✓";
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .register-form button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #900000 0%, #b00000 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
        }

        .register-form button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .register-form button:hover:not(:disabled)::before {
          left: 100%;
        }

        .register-form button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(144, 0, 0, 0.4);
        }

        .register-form button:disabled {
          background: #cccccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .register-form button:active {
          transform: translateY(0);
        }

        @media (max-width: 600px) {
          .register-form {
            padding: 30px 25px 40px;
            max-width: 420px;
          }

          .register-form h2 {
            font-size: 26px;
            margin-top: 10px;
          }

          .icon-header {
            margin-top: 25px;
          }

          .icon-header svg {
            width: 50px;
            height: 50px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .close-button {
          position: absolute !important;
          top: 15px !important;
          right: 15px !important;
          width: 20px !important;
          height: 20px !important;
          background: transparent !important;
          border: none !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
          z-index: 10 !important;
          padding: 0 !important;
        }

        .close-button:hover svg {
          fill: #900000 !important;
          transform: scale(1.1) !important;
        }

        .close-button svg {
          width: 16px !important;
          height: 16px !important;
          fill: #666 !important;
          transition: all 0.3s ease !important;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }

        .login-link a {
          color: #900000;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .login-link a:hover {
          color: #b00000;
          text-decoration: underline;
        }

        .success-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .success-modal {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 400px;
          width: 90%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.4s ease;
          position: relative;
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

        .success-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #900000 0%, #b00000 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: scaleIn 0.5s ease 0.2s both;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        .success-icon svg {
          width: 40px;
          height: 40px;
          fill: white;
        }

        .success-modal h3 {
          color: #333;
          font-size: 28px;
          margin: 0 0 10px 0;
          font-weight: 700;
        }

        .success-modal p {
          color: #666;
          font-size: 16px;
          margin: 0 0 30px 0;
          line-height: 1.5;
        }

        .success-modal button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #900000 0%, #b00000 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .success-modal button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(144, 0, 0, 0.4);
        }
      `}</style>

      <div className="register-container">
        <form
          className={`register-form ${shake ? "shake" : ""}`}
          onSubmit={handleSubmit}
        >
          <button className="close-button" onClick={handleClose} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          <div className="icon-header">
            <Logo size={90} />
          </div>

          <p>Join us today! Fill in your details below</p>

          <div className="form-group">
            <label>Full Name</label>
            <input
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              className={errors.dob ? "input-error" : ""}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              required
            />
            {errors.dob && <span className="error-message">{errors.dob}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={!emailAvailable ? "input-error" : ""}
                required
              />
              {isCheckingEmail && (
                <span className="text-gray-500" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  <div className="w-3 h-3 border-2 border-t-transparent border-[#900000] rounded-full animate-spin mr-2" />
                  Checking availability...
                </span>
              )}
              {!emailAvailable && !isCheckingEmail && (
                <span className="error-message" style={{ fontWeight: 'bold' }}>
                  ⚠️ This email is already registered.
                </span>
              )}
              {emailAvailable && formData.email && formData.email.includes('@') && !isCheckingEmail && (
                <span className="text-green-600" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  ✓ Email is available
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                name="phone"
                placeholder="10-digit number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                className={errors.phone ? "input-error" : ""}
                required
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Blood Group</label>
              <select
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                required
              >
                <option value="">Select your blood group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>District</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            >
              <option value="">Select District</option>

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
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "input-error" : ""}
              required
            />
            {formData.password && (
              <div className="password-requirements">
                <h4>Password Requirements:</h4>
                <div className={`requirement ${passwordValidation.minLength ? "met" : ""}`}>
                  At least 8 characters
                </div>
                <div className={`requirement ${passwordValidation.hasUpper ? "met" : ""}`}>
                  One uppercase letter
                </div>
                <div className={`requirement ${passwordValidation.hasLower ? "met" : ""}`}>
                  One lowercase letter
                </div>
                <div className={`requirement ${passwordValidation.hasNumber ? "met" : ""}`}>
                  One number
                </div>
                <div className={`requirement ${passwordValidation.hasSpecial ? "met" : ""}`}>
                  One special character (!@#$%^&*)
                </div>
              </div>
            )}
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              name="confirm_password"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirm_password}
              onChange={handleChange}
              className={errors.confirm_password ? "input-error" : ""}
              required
            />
            {errors.confirm_password && (
              <span className="error-message">{errors.confirm_password}</span>
            )}
          </div>

          <button type="submit" disabled={isSubmitting || !emailAvailable || isCheckingEmail}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>

          <div className="login-link">
            Already have an account? <a onClick={handleLoginRedirect}>Log in</a>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <h3>Success!</h3>
            <p>Your account has been created successfully. You can now log in and start your blood donation journey.</p>
            <button onClick={handleCloseModal}>Go to Login</button>
          </div>
        </div>
      )}
    </>
  );
}