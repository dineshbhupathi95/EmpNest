import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import ManageUsers from './pages/ManageUsers';
import OrgChart from './pages/OrgChart';
import LeaveRequest from './pages/LeaveRequest';
import Profile from './pages/UserProfile';
import HRJobPostings from './pages/HrJobPostings';
import JobBoard from './pages/JobBoard';
import TimesheetEntry from './pages/Timesheet';
import SubordinateDetails from './pages/SubOrdinates';
import Login from './components/Login';

const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

const AppLayout = ({ children }) => (
  <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f9fafb' }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Topbar />
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>{children}</Box>
    </Box>
  </Box>
);

function App() {
  return (
    <Router>
      <Routes>
      <Route
  path="/login"
  element={
    isAuthenticated() ? <Navigate to="/" replace /> : <Login />
  }
/>

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/manage-users" element={<ManageUsers />} />
                  <Route path="/org-chart" element={<OrgChart />} />
                  <Route path="/leave" element={<LeaveRequest />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/jobs/hr" element={<HRJobPostings />} />
                  <Route path="/jobs" element={<JobBoard />} />
                  <Route path="/timesheet" element={<TimesheetEntry />} />
                  <Route path="/reportees-view" element={<SubordinateDetails />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
