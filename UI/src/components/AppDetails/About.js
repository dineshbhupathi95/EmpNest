import React from 'react';
import { Box, Typography } from '@mui/material';

const About = () => (
  <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
    <Typography variant="h3" gutterBottom>
      About EmpNest
    </Typography>
    <Typography variant="body1" paragraph>
      EmpNest is an innovative HR management portal designed to simplify and streamline
      all your human resource operations. From recruitment, onboarding, payroll management,
      to performance tracking, our platform offers an all-in-one solution to empower HR
      teams and enhance employee experience.
    </Typography>
    <Typography variant="body1" paragraph>
      Founded in 2024, EmpNest aims to bridge the gap between employees and management with
      seamless digital workflows, real-time analytics, and intuitive tools designed for
      businesses of all sizes.
    </Typography>
    <Typography variant="body1" paragraph>
      Join us to experience a smarter, faster, and more efficient way to manage your workforce.
    </Typography>
  </Box>
);

export default About;
