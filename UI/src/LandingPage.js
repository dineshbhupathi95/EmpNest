import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  TextField,
  Alert,
  Fade,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import hrAnimation from './static/assets/hr-animation.json';
import app_logo from './static/images/empnest.jpg';

const HrLandingPage = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (section) => {
    const refs = { home: homeRef, about: aboutRef, contact: contactRef };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const homeTop = homeRef.current.getBoundingClientRect().top;
      const aboutTop = aboutRef.current.getBoundingClientRect().top;
      const contactTop = contactRef.current.getBoundingClientRect().top;

      if (contactTop <= 150) setActiveSection('contact');
      else if (aboutTop <= 150) setActiveSection('about');
      else setActiveSection('home');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navButtonStyle = (section) => ({
    color: activeSection === section ? 'primary.main' : 'inherit',
    fontWeight: activeSection === section ? 'bold' : 'normal',
    textDecoration: 'none',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.message.trim()) errors.message = 'Message is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f0f4f8',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={app_logo}
              alt="Company Logo"
              sx={{ height: 40, mr: 1 }}
            />
            <Typography variant="h6" fontWeight="bold" color="primary">
              EmpNest
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button onClick={() => scrollToSection('home')} sx={navButtonStyle('home')}>
              Home
            </Button>
            <Button onClick={() => scrollToSection('about')} sx={navButtonStyle('about')}>
              About
            </Button>
            <Button onClick={() => scrollToSection('contact')} sx={navButtonStyle('contact')}>
              Contact
            </Button>
            <Button variant="contained" color="primary" component={Link} to="/login">
              Sign In / Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: 64 }} />

      {/* Home Section */}
      <Box
        ref={homeRef}
        id="home"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' },
          px: 4,
          py: 6,
          scrollMarginTop: '64px',
        }}
      >
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ maxWidth: 600 }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Welcome to EmpNest HR Portal
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Streamline your HR operations — from hiring to onboarding, payroll, and performance tracking — all in one place.
          </Typography>
          <Button variant="contained" color="secondary" size="large" onClick={() => scrollToSection('about')}>
            Learn More
          </Button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          style={{ width: '100%', maxWidth: 450 }}
        >
          <Lottie animationData={hrAnimation} loop />
        </motion.div>
      </Box>

      {/* About Section */}
      <Box
        ref={aboutRef}
        id="about"
        sx={{
          minHeight: '100vh',
          px: 4,
          py: 8,
          bgcolor: '#fff',
          maxWidth: 900,
          mx: 'auto',
          scrollMarginTop: '64px',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
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
          <Button variant="outlined" color="primary" onClick={() => scrollToSection('contact')}>
            Contact Us
          </Button>
        </motion.div>
      </Box>

      {/* Contact Section */}
      <Box
        ref={contactRef}
        id="contact"
        sx={{
          minHeight: '100vh',
          px: 4,
          py: 8,
          maxWidth: 900,
          mx: 'auto',
          scrollMarginTop: '64px',
        }}
      >
        <Typography variant="h3" gutterBottom>
          Contact Us
        </Typography>

        <Box
          sx={{
            bgcolor: '#e3f2fd',
            p: 3,
            borderRadius: 2,
            mb: 4,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Our Office
          </Typography>
          <Typography>
            We are remote || 
            Hyderabad
            India
          </Typography>
          <Typography mt={2}>Phone: +91 99595 57710</Typography>
          <Typography>Email: dk2chat@gmail.com</Typography>
        </Box>

        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
          {success && (
            <Fade in={success}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Thank you for contacting us! We will get back to you shortly.
              </Alert>
            </Fade>
          )}
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <TextField
            fullWidth
            label="Message"
            name="message"
            multiline
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            margin="normal"
            required
            error={!!formErrors.message}
            helperText={formErrors.message}
          />
          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Send Message
          </Button>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          bgcolor: '#1976d2',
          color: '#fff',
          mt: 'auto',
        }}
      >
        <Typography variant="body2">
          &copy; {new Date().getFullYear()} EmpNest Technologies Pvt. Ltd. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default HrLandingPage;
