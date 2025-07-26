import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, Grid, Snackbar, Alert,
  InputAdornment, IconButton, MenuItem, Avatar, Divider, Fade
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

const roles = ['admin', 'hr', 'employee'];
const statuses = ['Active', 'Inactive'];

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    role: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    department: '',
    designation: '',
    joining_date: '',
    reporting_to: '',
    status: 'Active',
  });

  const [showPass, setShowPass] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async () => {
    try {
      await axios.post(`${config.BASE_URL}/users`, formData);
      setSnackbar({ open: true, type: 'success', message: 'Signup successful!' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        type: 'error',
        message: error.response?.data?.message || 'Signup failed!',
      });
    }
  };

  const isFormValid = Object.values(formData).every(val => val);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(to right, #e3f2fd, #bbdefb)',
        p: 2,
      }}
    >
      <Fade in timeout={700}>
        <Paper elevation={6} sx={{ p: 4, width: 700, borderRadius: 4 }}>
          <Box textAlign="center" mb={3}>
            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', width: 56, height: 56 }}>
              <PersonAddAltIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Create Your HRMS Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join your team and manage employee data easily
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField name="first_name" label="First Name" fullWidth value={formData.first_name} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="last_name" label="Last Name" fullWidth value={formData.last_name} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="email" label="Email" type="email" fullWidth value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="password"
                label="Password"
                fullWidth
                type={showPass ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} edge="end">
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField name="phone" label="Phone" fullWidth value={formData.phone} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="department" label="Department" fullWidth value={formData.department} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField name="designation" label="Designation" fullWidth value={formData.designation} onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <TextField
                name="joining_date"
                label="Joining Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.joining_date}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField name="reporting_to" label="Reporting To (User ID)" fullWidth value={formData.reporting_to} onChange={handleChange} />
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="role"
                select
                label="Role"
                fullWidth
                value={formData.role}
                onChange={handleChange}
                sx={{width:150}}
              >
                {roles.map(role => <MenuItem key={role} value={role}>{role}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={3}>
              <TextField
                name="status"
                select
                label="Status"
                fullWidth
                value={formData.status}
                onChange={handleChange}
                sx={{width:150}}
              >
                {statuses.map(stat => <MenuItem key={stat} value={stat}>{stat}</MenuItem>)}
              </TextField>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 4, py: 1.5, fontWeight: 'bold' }}
            disabled={!isFormValid}
            onClick={handleSignup}
          >
            Sign Up
          </Button>

          <Typography align="center" mt={3}>
            Already have an account?{' '}
            <span
              style={{ color: '#1976d2', cursor: 'pointer', fontWeight: 500 }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </span>
          </Typography>
        </Paper>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Signup;
