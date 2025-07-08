// src/pages/NotFound.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      p={4}
    >
      <Typography variant="h2" color="error" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" gutterBottom>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
      {/* <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go Back
      </Button> */}
    </Box>
  );
};

export default NotFound;
