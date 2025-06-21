import React, { useState } from 'react';
import {
  Modal, Box, Typography, TextField, Button, Grid, InputLabel
} from '@mui/material';
import { Select, MenuItem, FormControl } from '@mui/material';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ClientModal = ({ open, onClose }) => {
  const [form, setForm] = useState({
    client_name: '',
    industry: '',
    brand_color: '#1976d2',
    contact_email: '',
    contact_person: '',
    phone_number: '',
    website: '',
    address: '',
    subscription_plan: '',
    notes: '',
  });
  const [logo, setLogo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (logo) formData.append('logo', logo);

    try {
      await axios.post('/api/clients/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onClose();
    } catch (err) {
      console.error('Error creating client:', err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" mb={3}>New Client Onboarding</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField name="client_name" label="Client Name" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="industry" label="Industry" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="contact_email" label="Contact Email" type="email" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="contact_person" label="Contact Person" fullWidth required onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="phone_number" label="Phone Number" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField name="website" label="Website" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField name="address" label="Address" fullWidth multiline rows={2} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
  <FormControl fullWidth required>
    <InputLabel id="subscription-label">Subscription Plan</InputLabel>
    <Select
      labelId="subscription-label"
      name="subscription_plan"
      value={form.subscription_plan}
      label="Subscription Plan"
      onChange={handleChange}
    >
      <MenuItem value="Basic">Basic</MenuItem>
      <MenuItem value="Pro">Pro</MenuItem>
      <MenuItem value="Enterprise">Enterprise</MenuItem>
    </Select>
  </FormControl>
</Grid>

          <Grid item xs={12} sm={6}>
            <TextField name="notes" label="Notes" fullWidth onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel shrink htmlFor="logo">Upload Logo</InputLabel>
            <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files[0])} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel shrink htmlFor="brand_color">Brand Color</InputLabel>
            <input
              type="color"
              id="brand_color"
              name="brand_color"
              value={form.brand_color}
              onChange={handleChange}
              style={{ width: '100%', height: '40px', border: 'none', cursor: 'pointer' }}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={onClose} sx={{ mr: 2 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>Create</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClientModal;
