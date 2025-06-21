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
import { useNavigate } from 'react-router-dom'; 

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    // navigate or open profile
    alert('View Profile clicked');
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    window.location.href = '/login';
    };

  return (
    <AppBar position="static" sx={{ background: '#19047a', mb: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          EmpNest
        </Typography>

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
