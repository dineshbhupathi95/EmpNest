import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      textAlign="center"
      p={4}
    >
      <Typography variant="h3" color="error" gutterBottom>
        403 - Unauthorized
      </Typography>
      <Typography variant="h6" gutterBottom>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;
