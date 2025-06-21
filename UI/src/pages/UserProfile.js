// components/Profile.jsx
import React, { useEffect, useState } from 'react';
import {
  Box, Avatar, Typography, Paper, Grid
} from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('/profile')
      .then(res => setUser(res.data))
      .catch(() => {
        setUser({
          name: 'Dinesh Bhupathi',
          email: 'dinesh@example.com',
          role: 'Team Lead',
          photo_url: 'https://i.pravatar.cc/150?img=3'
        });
      });
  }, []);

  if (!user) return null;

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
        <Avatar src={user.photo_url} sx={{ width: 80, height: 80, mr: 3 }} />
        <Box>
          <Typography variant="h6">{user.name}</Typography>
          <Typography variant="body2" color="textSecondary">{user.email}</Typography>
          <Typography variant="body2">{user.role}</Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile;
