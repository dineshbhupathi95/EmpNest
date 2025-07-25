import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import config from '../config';

const Topbar = ({ orgName = 'EmpNest', topbarColor = '#19047a',logo }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfile = () => {
    handleMenuClose();
    alert('View Profile clicked');
  };
  const handleLogout = () => {
    handleMenuClose();
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <AppBar position="static" sx={{ background: topbarColor, mb: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {logo && (
            <img src={`${config.BASE_URL}${logo}`} alt="Logo" style={{ height: 60, borderRadius: 32,width:60 }} />
          )}
          <Typography variant="h6" component="div">
            {orgName}
          </Typography>
        </Box>

        <Box>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: 'white', color: '#1976d2' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleProfile}>My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
