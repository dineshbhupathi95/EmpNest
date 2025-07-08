import React, { useEffect, useState } from 'react';
import {
  Box, Typography, List, ListItem, ListItemButton, Tabs, Tab,
  Switch, Paper, Divider, Card, CardContent, Button, CircularProgress
} from '@mui/material';
import axios from 'axios';
import config from '../../config';

const roles = ['admin', 'hr', 'employee'];
const staticTabs = ['Sidenav', 'Buttons', 'APIs'];

const AccessManager = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [selectedTab, setSelectedTab] = useState(0);
  const [accessMatrix, setAccessMatrix] = useState({});
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const currentTab = staticTabs[selectedTab];

  useEffect(() => {
    fetchAccessMatrix(selectedRole);
  }, [selectedRole]);

  const fetchAccessMatrix = async (role) => {
    setLoading(true);
    try {
      const res = await axios.get(`${config.BASE_URL}/access/${role}`);
      const matrix = { Sidenav: {}, Buttons: {}, APIs: {} };

      res.data.forEach(({ category, feature, is_allowed }) => {
        if (!matrix[category]) matrix[category] = {};
        matrix[category][feature] = is_allowed;
      });

      setAccessMatrix({ [role]: matrix });
    } catch (err) {
      console.error('Error fetching access:', err);
      setAccessMatrix({ [role]: { Sidenav: {}, Buttons: {}, APIs: {} } });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (feature) => {
    setAccessMatrix(prev => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [currentTab]: {
          ...prev[selectedRole][currentTab],
          [feature]: !prev[selectedRole][currentTab][feature]
        }
      }
    }));
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      const payload = [];
      const current = accessMatrix[selectedRole];
  
      Object.entries(current).forEach(([category, features]) => {
        Object.entries(features).forEach(([feature, is_allowed]) => {
          payload.push({ category, feature, is_allowed });
        });
      });
  
      // PUT update request
      await axios.put(`${config.BASE_URL}/access/${selectedRole}`, payload);
  
      // Re-fetch updated access matrix
      const updatedAccess = await axios.get(`${config.BASE_URL}/access/${selectedRole}`);
      const updatedMatrix = { Sidenav: {}, Buttons: {}, APIs: {} };
  
      updatedAccess.data.forEach(({ category, feature, is_allowed }) => {
        if (!updatedMatrix[category]) updatedMatrix[category] = {};
        updatedMatrix[category][feature] = is_allowed;
      });
  
      // Update component state
      setAccessMatrix(prev => ({
        ...prev,
        [selectedRole]: updatedMatrix
      }));
  
      // If logged-in user's role matches updated role, update localStorage
      const currentUserRole = localStorage.getItem('role');
      if (currentUserRole === selectedRole) {
        localStorage.setItem('roleAccess', JSON.stringify(updatedMatrix));
      }
  
      alert('Access saved and updated locally!');
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save access');
    } finally {
      setSaveLoading(false);
    }
  };
  

  return (
    <Box display="flex" height="calc(100vh - 64px)" p={2} bgcolor="#f5f7fa">
      {/* Side Nav */}
      <Paper elevation={1} sx={{ width: 220, borderRadius: 2, p: 2, mr: 3, bgcolor: '#fff' }}>
        <Typography variant="h6" gutterBottom>Roles</Typography>
        <Divider sx={{ mb: 1 }} />
        <List>
          {roles.map(role => (
            <ListItem key={role} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedRole === role}
                onClick={() => setSelectedRole(role)}
                sx={{
                  borderRadius: 1,
                  color: selectedRole === role ? 'white' : 'inherit',
                  '&.Mui-selected': {
                    bgcolor: '#19047a',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#150265'
                    }
                  },
                  '&:hover': {
                    bgcolor: selectedRole === role ? '#150265' : 'grey.100'
                  }
                }}
              >
                <Typography fontWeight={500}>{role.charAt(0).toUpperCase() + role.slice(1)}</Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main Panel */}
      <Box flexGrow={1}>
        <Card sx={{ borderRadius: 3, p: 3 }}>
          <Typography variant="h5" mb={2}>{selectedRole.toUpperCase()} Access Management</Typography>

          {/* Static Tabs */}
          <Tabs
            value={selectedTab}
            onChange={(e, newVal) => setSelectedTab(newVal)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            {staticTabs.map(tab => (
              <Tab key={tab} label={tab} sx={{ textTransform: 'none', fontWeight: 500 }} />
            ))}
          </Tabs>

          {/* Tab Content */}
          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {accessMatrix?.[selectedRole]?.[currentTab] &&
                Object.keys(accessMatrix[selectedRole][currentTab]).length > 0 ? (
                  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                    {Object.entries(accessMatrix[selectedRole][currentTab]).map(
                      ([feature, is_allowed]) => (
                        <Box
                          key={feature}
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          p={2}
                          bgcolor="#f0f2f5"
                          borderRadius={2}
                        >
                          <Typography>{feature}</Typography>
                          <Switch
                            checked={is_allowed}
                            onChange={() => handleToggle(feature)}
                            color="primary"
                          />
                        </Box>
                      )
                    )}
                  </Box>
                ) : (
                  <Typography textAlign="center" color="text.secondary">No data</Typography>
                )}
              </>
            )}
          </CardContent>

          <Box textAlign="right" mt={2}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saveLoading}
              startIcon={saveLoading ? <CircularProgress size={20} /> : null}
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default AccessManager;
