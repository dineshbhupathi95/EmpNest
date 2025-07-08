// src/components/EmployeeListCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemAvatar, ListItemText, Button, Chip } from '@mui/material';
import Avatar from '@mui/material/Avatar'; // Or use custom Avatars if needed

const EmployeeListCard = () => {
  const employees = [
    { name: 'Brooklyn Simmons', email: 'brook-simmons@mail.com', department: 'Design', jobTitle: 'UI Designer', avatarInitials: 'BS', avatarColor: '#FFC107' },
    { name: 'Cody Fisher', email: 'cody.fisher99@mail.com', department: 'Development', jobTitle: 'Front-End', avatarInitials: 'CF', avatarColor: '#4CAF50' },
    { name: 'Ralph Edwards', email: 'ralp_uxdmg@mail.com', department: 'Design', jobTitle: 'UX Designer', avatarInitials: 'RE', avatarColor: '#2196F3' },
  ];

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, minWidth: 350 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Employee</Typography>
          <Button variant="text" sx={{ textTransform: 'none', color: '#1976d2' }}>See Details</Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, px: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 2 }}>Employee Name</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>Department</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>Job Title</Typography>
        </Box>
        <List>
          {employees.map((employee, index) => (
            <ListItem key={index} sx={{ borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: employee.avatarColor, width: 32, height: 32, fontSize: '0.8rem' }}>{employee.avatarInitials}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography component="span" variant="body1" sx={{ fontWeight: 'medium' }}>
                      {employee.name}
                    </Typography>
                    <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                      {employee.email}
                    </Typography>
                  </Box>
                }
                sx={{ flex: 2 }}
              />
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={employee.department}
                  size="small"
                  sx={{
                    backgroundColor: employee.department === 'Design' ? '#e0f2f7' : '#e8f5e9', // Light blue for Design, light green for Development
                    color: employee.department === 'Design' ? '#0288d1' : '#2e7d32', // Darker color for text
                    fontWeight: 'bold',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.primary" sx={{ flex: 1 }}>
                {employee.jobTitle}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EmployeeListCard;