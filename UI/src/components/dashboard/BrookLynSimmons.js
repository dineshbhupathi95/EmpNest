// src/components/BrooklynSimmonsCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, IconButton, Chip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CallIcon from '@mui/icons-material/Call';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const BrooklynSimmonsCard = () => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, minWidth: 320 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar src="/path/to/brooklyn_simmons_avatar.jpg" sx={{ mr: 1, width: 50, height: 50 }}>
              BS
            </Avatar>
            <Box>
              <Typography variant="h6">Brooklyn Simmons</Typography>
              <Typography variant="body2" color="text.secondary">brook-simmons@mail.com</Typography>
            </Box>
          </Box>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CallIcon sx={{ fontSize: 18, mr: 0.5, color: '#777' }} />
          <Typography variant="body2" color="text.primary">(+62) 852 9292 2322</Typography>
          <AccessTimeIcon sx={{ fontSize: 18, ml: 2, mr: 0.5, color: '#777' }} />
          <Typography variant="body2" color="text.primary">120h 32m</Typography>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Department:</Typography>
          <Chip
            label="Design"
            size="small"
            sx={{
              backgroundColor: '#e0f2f7',
              color: '#0288d1',
              fontWeight: 'bold',
              padding: '2px 8px',
              borderRadius: '4px'
            }}
          />
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">Job Title:</Typography>
          <Typography variant="body1">Creative Director</Typography>
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">Contract Type:</Typography>
          <Typography variant="body1">Onsite - Fulltime</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BrooklynSimmonsCard;