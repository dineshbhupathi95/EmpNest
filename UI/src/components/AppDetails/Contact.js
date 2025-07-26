import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper } from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just alert the form data
    alert(`Thank you, ${formData.name}! We received your message.`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h3" gutterBottom>
        Contact Us
      </Typography>

      <Grid container spacing={4}>
        {/* Address Info */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Our Office</Typography>
            <Typography>
              EmpNest Technologies Pvt. Ltd.<br />
              123, Corporate Park,<br />
              4th Floor, Tech City,<br />
              Bangalore, Karnataka - 560001<br />
              India
            </Typography>
            <Typography mt={2}>Phone: +91 98765 43210</Typography>
            <Typography>Email: support@empnest.com</Typography>
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
                margin="normal"
                required
              />
              <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
                Send Message
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;
