// src/components/JuniorFrontendDeveloperCard.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Button, Avatar, Divider } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const JuniorFrontendDeveloperCard = () => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, minWidth: 300 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Active until: Jan 31, 2024
        </Typography>
        <Typography variant="h6" gutterBottom>
          Junior Frontend Developer
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          A front-end developer is basically a web develope
          has a specialization in creating user interface for
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
          <Button
            variant="contained"
            disableElevation
            sx={{
              textTransform: 'none',
              backgroundColor: '#e0e0e0',
              color: '#333',
              borderRadius: 2,
              '&:hover': {
                backgroundColor: '#d0d0d0',
              },
            }}
          >
            Development
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: '#555',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#c0c0c0',
              },
            }}
          >
            Full Time
          </Button>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderColor: '#e0e0e0',
              color: '#555',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#c0c0c0',
              },
            }}
          >
            Remote
          </Button>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Avatar src="/path/to/cody_fisher_avatar.jpg" sx={{ mr: 1, width: 40, height: 40 }}>
            CF
          </Avatar>
          <Box>
            <Typography variant="body1">Cody Fisher</Typography>
            <Typography variant="body2" color="text.secondary">cody.fisher99@mail.com</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CallIcon sx={{ fontSize: 18, mr: 0.5, color: '#777' }} />
            <Typography variant="body2" color="text.primary">(+62) 928 7273 7262</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5, color: '#777' }} />
            <Typography variant="body2" color="text.primary">120h 32m</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JuniorFrontendDeveloperCard;