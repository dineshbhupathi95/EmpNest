import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import HRDashboard from './pages/Dashboard';
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
import AccessManager from './components/access_manager/AccessManager';
import { RoleProtectedRoute } from './utils/ProtectedRoute';
import Unauthorized from './pages/UnAuthorizedAccess';
import NotFound from './pages/NoFoundPage';

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
                  {/* <Route path="/" element={<HRDashboard />} /> */}
                  <Route
                    path="/manage-users"
                    element={
                      <RoleProtectedRoute category="Sidenav" feature="Manage Users">
                        <ManageUsers />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route path="/org-chart"
                    element={
                      <RoleProtectedRoute category="Sidenav" feature="Org Chart">
                        <OrgChart />
                      </RoleProtectedRoute>
                    }
                  />
                  <Route path="/leave" 
                  element={
                    <RoleProtectedRoute category="Sidenav" feature="Leave Request">
                      <LeaveRequest />
                    </RoleProtectedRoute>
                  }
                  />
                  <Route path="/profile" 
                  element={
                    <RoleProtectedRoute category="Sidenav" feature="My Profile">
                      <Profile />
                    </RoleProtectedRoute>
                  }
                   />
                  <Route path="/jobs/hr"
                  element={
                    <RoleProtectedRoute category="Sidenav" feature="Job Postings">
                      <HRJobPostings />
                    </RoleProtectedRoute>
                  }
                  />
                  <Route path="/jobs" 
                  element={
                    <RoleProtectedRoute category="Sidenav" feature="Job Board">
                      <JobBoard />
                    </RoleProtectedRoute>
                  }
                  />
                  <Route path="/timesheet" 
                  element={
                    <RoleProtectedRoute category="Sidenav" feature="Time sheet Entry">
                      <TimesheetEntry />
                    </RoleProtectedRoute>
                  }
                  />
                  <Route path="/reportees-view" 
                  element={
                    <RoleProtectedRoute category="Sidenav" feature="Reportees">
                      <SubordinateDetails />
                    </RoleProtectedRoute>
                  }
                  />
                  <Route path="/access-manager" 
                  element={
                    <RoleProtectedRoute category="Sidenav" feature="Manage Users">
                      <AccessManager />
                    </RoleProtectedRoute>
                  }
                  />
                  <Route path="/not-authorized" element={<Unauthorized />} />

                  <Route path="*" element={<NotFound />} />
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
