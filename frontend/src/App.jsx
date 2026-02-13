import React from 'react'
import './App.css'
import './animations.css'
import Bloodhome from "./components/Bloodhome"
import Register from './components/Register'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import Login from './components/Login'
import UserDashboard from './components/UserDashboard'
import UserProfile from './components/UserProfile'
import AdminDashboard from './components/AdminDashboard'
import RegistrationRequests from './components/RegistrationRequests'
import AdminUserManagement from './components/AdminUserManagement'
import AdminAnnouncements from './components/AdminAnnouncement'
import UserAnnouncements from './components/UserAnnouncements'
import UserHelpSupport from './components/UserHelpSupport'
import AdminHelpSupport from './components/AdminHelpSupport'
import DonorForm from './components/DonorForm'
import AdminDonorManagement from './components/AdminDonorManagement'
import BloodRequestForm from './components/BloodRequestForm'
import AdminBloodRequests from './components/AdminBloodRequests'
import EligibilityCheck from './components/EligibilityCheck'
import UserDonationHistory from './components/UserDonationHistory'
import AdminStatistics from './components/AdminStatistics'
import AdminAssignments from './components/AdminAssignments'
import AdminFeedback from './components/AdminFeedback'

function App() {


  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Bloodhome />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/registration-requests" element={<RegistrationRequests />} />
          <Route path="/user-management" element={<AdminUserManagement />} />
          <Route path="/admin-announcements" element={<AdminAnnouncements />} />
          <Route path="/user-announcements" element={<UserAnnouncements />} />
          <Route path="/user-help-support" element={<UserHelpSupport />} />
          <Route path="/admin-help-support" element={<AdminHelpSupport />} />
          <Route path="/donor-form" element={<DonorForm />} />
          <Route path="/admin-donor-management" element={<AdminDonorManagement />} />
          <Route path="/blood-request" element={<BloodRequestForm />} />
          <Route path="/admin-blood-requests" element={<AdminBloodRequests />} />
          <Route path="/admin-assignments" element={<AdminAssignments />} />
          <Route path="/eligibility-check" element={<EligibilityCheck />} />
          <Route path="/user-donation-history" element={<UserDonationHistory />} />
          <Route path="/admin-statistics" element={<AdminStatistics />} />
          <Route path="/admin-feedbacks" element={<AdminFeedback />} />

        </Routes>

      </BrowserRouter>

    </div>



  )
}

export default App
