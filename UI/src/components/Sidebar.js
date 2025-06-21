import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Tooltip
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkIcon from '@mui/icons-material/Work';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(prev => !prev);

  const drawerWidth = isOpen ? 240 : 70;

  // Simulate role from localStorage
  const role = localStorage.getItem('role'); // "admin", "hr", or "employee"

  const baseLinks = [
    // { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  ];

  const roleLinks = {
    string: [
      { label: 'Manage Users', icon: <PeopleIcon />, path: '/manage-users' },      
      { label: 'Reportees', path: '/reportees-view', icon: <FactCheckIcon /> },
      { label: 'Time sheet Entry', path: '/timesheet', icon: <AccessTimeIcon /> },
      { label: 'Leave Requests', icon: <AssignmentIcon />, path: '/leave' },
      { label: 'Job Board', path: '/jobs', icon: <WorkIcon /> },
      { label: 'My Profile', icon: <AccountCircleIcon />, path: '/profile' },
      { label: 'Org Chart', path: '/org-chart', icon: <AccountTreeIcon /> },

    ],
    hr: [
      { label: 'Leave Requests', icon: <AssignmentIcon />, path: '/leave' },
      { label: 'My Profile', icon: <AccountCircleIcon />, path: '/profile' },
      { label: 'Org Chart', path: '/org-chart', icon: <AccountTreeIcon /> },
      { label: 'Time sheet Entry', path: '/timesheet', icon: <AccessTimeIcon /> },
      { label: 'Job Postings', path: '/jobs/hr', icon: <AdminPanelSettingsIcon /> },

    ],
    employee: [
      { label: 'My Profile', icon: <AccountCircleIcon />, path: '/profile' },
      { label: 'Leave Requests', icon: <AssignmentIcon />, path: '/leave' },
      { label: 'Org Chart', path: '/org-chart', icon: <AccountTreeIcon /> },
      { label: 'Time sheet Entry', path: '/timesheet', icon: <AccessTimeIcon /> },
      { label: 'Job Board', path: '/jobs', icon: <WorkIcon /> },
      { label: 'Reportees', path: '/reportees-view', icon: <FactCheckIcon /> },

    ],
  };

  const navItems = [...baseLinks, ...(roleLinks[role] || [])];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.3s',
        },
      }}
    >
      <div style={{ display: 'flex', justifyContent: isOpen ? 'flex-end' : 'center', padding: 8 }}>
        <IconButton onClick={toggleDrawer}>
          {isOpen ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </div>
      <Divider />
      <List>
  {navItems.map(({ label, icon, path }) => {
    const isSelected = location.pathname === path;
    return (
      <ListItem
        button
        key={label}
        component={Link}
        to={path}
        selected={isSelected}
        sx={{
          bgcolor: isSelected ? '#19047a' : 'transparent',
          color: isSelected ? 'white' : 'inherit',
          '&:hover': {
            bgcolor: isSelected ? '#19047a' : 'action.hover',
          },
          '& .MuiListItemIcon-root': {
            color: isSelected ? 'white' : 'inherit',
          },
        }}
      >
        <Tooltip title={label} placement="right" disableHoverListener={isOpen}>
          <ListItemIcon>{icon}</ListItemIcon>
        </Tooltip>
        {isOpen && <ListItemText primary={label} />}
      </ListItem>
    );
  })}
</List>

    </Drawer>
  );
};

export default Sidebar;
