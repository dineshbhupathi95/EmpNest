// src/components/RalphEdwardsLeaveCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Button, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const RalphEdwardsLeaveCard = () => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, minWidth: 320 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="/path/to/ralph_edwards_avatar.jpg" sx={{ mr: 1, width: 40, height: 40 }}>
              RE
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="medium">Ralph Edwards</Typography>
              <Typography variant="body2" color="text.secondary">Leave for -4 day(s)</Typography>
            </Box>
          </Box>
          <Chip label="Pending" size="small" sx={{ backgroundColor: '#fff3e0', color: '#ff6f00', fontWeight: 'bold' }} />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">Leave From:</Typography>
            <Typography variant="body1" fontWeight="medium">Jan 23, 2024</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">To:</Typography>
            <Typography variant="body1" fontWeight="medium">Jan 27, 2024</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" disableElevation color="primary" sx={{ flexGrow: 1, textTransform: 'none', backgroundColor: '#e0e0e0', color: '#333', '&:hover': { backgroundColor: '#d0d0d0' } }}>
            Approve
          </Button>
          <Button variant="contained" disableElevation color="error" sx={{ flexGrow: 1, textTransform: 'none', backgroundColor: '#ef9a9a', color: '#b71c1c', '&:hover': { backgroundColor: '#e57373' } }}>
            Reject
          </Button>
        </Box>
        <Chip label="Sick Leave" size="small" sx={{ position: 'absolute', top: 16, left: 16, backgroundColor: '#fbe9e7', color: '#d84315', fontWeight: 'bold' }} />
      </CardContent>
    </Card>
  );
};

export default RalphEdwardsLeaveCard;