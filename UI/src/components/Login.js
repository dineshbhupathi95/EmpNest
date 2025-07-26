import React, { useState, useEffect, useRef } from 'react';
import {
  Box, TextField, Button, Typography, Paper,
  InputAdornment, IconButton, Fade,AppBar,Toolbar
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import config from '../config';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import app_logo from '../static/images/empnest.jpg';

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('savedEmail') || '');
  const [password, setPassword] = useState(localStorage.getItem('savedPassword') || '');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${config.BASE_URL}/login`, { email, password });
      const token = res.data.access_token;

      localStorage.setItem('token', token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('savedPassword', password);

      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      const accessResponse = await axios.get(`${config.BASE_URL}/access/${role}`);
      const accessMatrix = {};

      accessResponse.data.forEach(({ category, feature, is_allowed }) => {
        if (!accessMatrix[category]) accessMatrix[category] = {};
        accessMatrix[category][feature] = is_allowed;
      });

      localStorage.setItem('roleAccess', JSON.stringify(accessMatrix));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(to right, #4facfe, #00f2fe)',
        px: 2
      }}
    >
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={app_logo}
              alt="Company Logo"
              sx={{ height: 40, mr: 1 }}
            />
            <Typography variant="h6" fontWeight="bold" color="primary">
              EmpNest
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button>
          <Link to="/" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Home
            </Link>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Fade in timeout={500}>
        <Paper elevation={6} sx={{ p: 4, width: '100%', maxWidth: 420, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            Welcome Back
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" mb={2}>
            Sign in to continue to your dashboard
          </Typography>

          {error && (
            <Typography color="error" align="center" mb={2}>
              {error}
            </Typography>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            inputRef={emailRef}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            onKeyDown={handleKeyDown}
          />

          <TextField
            fullWidth
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            onKeyDown={handleKeyDown}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPass((prev) => !prev)} edge="end">
                    {showPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5 }}
            onClick={handleLogin}
            disabled={!email || !password || loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Typography align="center" mt={3}>
            Don’t have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Login;
