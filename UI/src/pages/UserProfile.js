import React, { useEffect, useState } from 'react';
import {
  Box, Avatar, Typography, Paper, Grid, Divider
} from '@mui/material';
import axios from 'axios';
import config from '../config'; // Make sure this includes BASE_URL

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      console.error("User ID not found in localStorage");
      return;
    }

    axios.get(`${config.BASE_URL}/users/${userId}`)
      .then(res => setUser(res.data))
      .catch(err => {
        console.error("Error fetching user profile:", err);
        setUser({
          first_name: 'Dinesh',
          last_name: 'Bhupathi',
          email: 'dinesh@example.com',
          role: 'Team Lead',
          department: 'Engineering',
          designation: 'Senior Developer',
          phone: '9876543210',
          photo_url: 'https://i.pravatar.cc/150?img=3'
        });
      });
  }, []);

  if (!user) return null;

  const fullName = `${user.first_name || ''} ${user.last_name || ''}`;

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item>
            <Avatar src={user.photo_url} sx={{ width: 100, height: 100 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h5" fontWeight="bold">{fullName}</Typography>
            <Typography variant="body1" color="textSecondary">{user.email}</Typography>
            <Typography variant="body2">{user.role} • {user.designation}</Typography>
            <Typography variant="body2">Department: {user.department}</Typography>
            <Typography variant="body2">Phone: {user.phone}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="textSecondary">
          Joined on: {user.joining_date ? new Date(user.joining_date).toLocaleDateString() : 'N/A'}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
