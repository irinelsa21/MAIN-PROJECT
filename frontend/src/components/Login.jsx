import React, { useState } from "react";
import Logo from "./Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email.includes('@')) {
      setError("Invalid email format");
      setIsSubmitting(false);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();

      // Store email and user_id in localStorage
      localStorage.setItem("email", email);
      if (data.user_id) {
        localStorage.setItem("user_id", data.user_id);
      }

      // ✅ ROLE-BASED REDIRECT
      if (data.role === "admin") {
        window.location.href = "/admin-dashboard";
      } else if (data.role === "user") {
        window.location.href = "/user-dashboard";
      }
    } catch (err) {
      setError(err.message || "Login failed");
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    window.location.href = '/';
  };

  const handleRegisterRedirect = () => {
    window.location.href = '/register';
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

        .login-container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          position: relative;
        }

        .login-form {
          background: white;
          padding: 50px 40px 50px;
          width: 100%;
          max-width: 450px;
          border-radius: 24px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
          animation: slideIn 0.5s ease-out;
          position: relative;
          overflow: hidden;
        }

        .login-form::before {
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

        .login-form > * {
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
          width: 80px;
          height: 80px;
          fill: #900000;
          filter: drop-shadow(0 4px 12px rgba(144, 0, 0, 0.3));
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .login-form h2 {
          text-align: center;
          color: #900000;
          margin-bottom: 25px;
          margin-top: 10px;
          font-size: 24px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .login-form p {
          text-align: center;
          color: #666;
          margin-bottom: 35px;
          font-size: 14px;
          position: relative;
        }

        .login-form p::after {
          content: '🩸';
          margin-left: 8px;
          font-size: 16px;
        }

        .form-group {
          margin-bottom: 20px;
          position: relative;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.3s ease;
          background: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #900000;
          box-shadow: 0 0 0 3px rgba(144, 0, 0, 0.1);
        }

        .error-message {
          color: #e74c3c;
          font-size: 13px;
          margin-top: 15px;
          display: block;
          text-align: center;
          padding: 12px;
          background: #ffe6e6;
          border-radius: 8px;
          border-left: 4px solid #e74c3c;
        }

        .input-error {
          border-color: #e74c3c !important;
        }

        .login-form button {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #900000 0%, #b00000 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          position: relative;
          overflow: hidden;
        }

        .login-form button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .login-form button:hover:not(:disabled)::before {
          left: 100%;
        }

        .login-form button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(144, 0, 0, 0.4);
        }

        .login-form button:disabled {
          background: #cccccc;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .login-form button:active {
          transform: translateY(0);
        }

        @media (max-width: 600px) {
          .login-form {
            padding: 40px 30px 40px;
            max-width: 380px;
          }

          .login-form h2 {
            font-size: 30px;
            margin-top: 10px;
          }

          .icon-header {
            margin-top: 25px;
          }

          .icon-header svg {
            width: 60px;
            height: 60px;
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

        .register-link {
          text-align: center;
          margin-top: 25px;
          font-size: 14px;
          color: #666;
        }

        .register-link a {
          color: #900000;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .register-link a:hover {
          color: #b00000;
          text-decoration: underline;
        }

        .forgot-password {
          text-align: right;
          margin-top: 10px;
          margin-bottom: 5px;
        }

        .forgot-password a {
          color: #900000;
          font-size: 13px;
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
          font-weight: 500;
        }

        .forgot-password a:hover {
          color: #b00000;
          text-decoration: underline;
        }
      `}</style>

      <div className="login-container">
        <div className={`login-form ${shake ? "shake" : ""}`}>
          <button className="close-button" onClick={handleClose} type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>

          <div className="icon-header">
            <Logo size={100} />
          </div>


          <p>Log in to continue your journey</p>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? "input-error" : ""}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "input-error" : ""}
              required
            />
          </div>



          {error && <span className="error-message">{error}</span>}

          <button onClick={handleLogin} disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <div className="register-link">
            Don't have an account? <a onClick={handleRegisterRedirect}>Register now</a>
          </div>
        </div>
      </div>
    </>
  );
}