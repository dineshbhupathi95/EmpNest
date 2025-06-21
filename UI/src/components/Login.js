import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper,
  InputAdornment, IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import config from '../config';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();  // 👈 add this

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${config.BASE_URL}/login`, { email, password });
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_id', res.data.user_id);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
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
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          type={showPass ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
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
