import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CustomThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Public Pages
import Home from './pages/Public/Home';
import Login from './pages/Public/Login';
import Register from './pages/Public/Register';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfile from './pages/Student/StudentProfile';
import StudentCompanies from './pages/Student/StudentCompanies';
import StudentApplications from './pages/Student/StudentApplications';
import CalendarView from './pages/Student/CalendarView';
import ForumPage from './pages/Student/Forum';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageStudents from './pages/Admin/ManageStudents';
import ManageCompanies from './pages/Admin/ManageCompanies';
import ManageApplications from './pages/Admin/ManageApplications';
import ManageInterviews from './pages/Admin/ManageInterviews';
import Reports from './pages/Admin/Reports';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <CustomThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Student Portal Paths */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<StudentDashboard />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="companies" element={<StudentCompanies />} />
              <Route path="applications" element={<StudentApplications />} />
              <Route path="calendar" element={<CalendarView />} />
              <Route path="forum" element={<ForumPage />} />
              {/* Redirect /student directly to dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Protected Admin Portal Paths */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="students" element={<ManageStudents />} />
              <Route path="companies" element={<ManageCompanies />} />
              <Route path="applications" element={<ManageApplications />} />
              <Route path="interviews" element={<ManageInterviews />} />
              <Route path="reports" element={<Reports />} />
              {/* Redirect /admin directly to dashboard */}
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </CustomThemeProvider>
    </BrowserRouter>
  );
};

export default App;
