import React from 'react';
import { Card, CardContent, Typography, Button, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person'; // Example icon, you might want more specific ones

const WhatsOnJanuaryCard = () => {
  const employees = [
    { name: 'Elanoire Maggie', role: 'UI UX Designer', status: 'Sick Leave', avatarColor: '#F44336' }, // Example avatar color
    { name: 'Kevin Malona', role: 'UI UX Designer', status: 'Annual Leave', avatarColor: '#2196F3' },
    { name: 'Jeremy Gemoy', role: 'Graphic Design', status: 'Work From Home', avatarColor: '#4CAF50' },
  ];

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, minWidth: 300 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          What's on January?
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="contained" disableElevation sx={{ textTransform: 'none', backgroundColor: '#e0e0e0', color: '#333' }}>Time Off</Button>
          <Button variant="outlined" sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#555' }}>Birthday</Button>
        </Box>
        <List>
          {employees.map((employee, index) => (
            <ListItem key={index} disablePadding>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: employee.avatarColor }}>
                  {employee.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={employee.name}
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {employee.role}
                    </Typography>
                    {" — "}
                    <Typography
                      sx={{ display: 'inline', color: '#777' }} // Adjust color as needed
                      component="span"
                      variant="body2"
                    >
                      {employee.status}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default WhatsOnJanuaryCard;