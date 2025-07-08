import React, { useState, useEffect, useRef } from 'react';
import {
  Box, TextField, Button, Typography, Paper,
  InputAdornment, IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState(localStorage.getItem('savedEmail') || '');
  const [password, setPassword] = useState(localStorage.getItem('savedPassword') || '');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const emailRef = useRef();

  // Autofocus on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${config.BASE_URL}/login`, { email, password });
      const token = res.data.access_token;

      localStorage.setItem('token', token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);

      // Store credentials for next time (optional)
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('savedPassword', password); // ⚠️ Store only in dev/testing, remove in production.

      const decodedToken = jwtDecode(token);
      const role = decodedToken.role;

      // Fetch access matrix
      const accessResponse = await axios.get(`${config.BASE_URL}/access/${role}`);
      const accessMatrix = {};

      accessResponse.data.forEach(({ category, feature, is_allowed }) => {
        if (!accessMatrix[category]) accessMatrix[category] = {};
        accessMatrix[category][feature] = is_allowed;
      });

      localStorage.setItem('roleAccess', JSON.stringify(accessMatrix));

      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  // Submit on Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper elevation={4} sx={{ p: 4, width: 400, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom align="center">Login</Typography>

        {error && <Typography color="error" align="center" mb={2}>{error}</Typography>}

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
          sx={{ mt: 3 }}
          onClick={handleLogin}
          disabled={!email || !password}
        >
          Sign In
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
