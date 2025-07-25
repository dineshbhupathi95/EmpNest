import React, { useState,useEffect } from 'react';
import { TextField, Button, Box, Typography, InputLabel } from '@mui/material';
import { SketchPicker } from 'react-color';
import config from '../../config';

const ConfigurationPanel = ({ onConfigChange }) => {
  const [orgName, setOrgName] = useState('');
  const [topbarColor, setTopbarColor] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  useEffect(() => {
    console.log(config.BASE_URL,'lll')
    fetch(`${config.BASE_URL}/config`)
      .then((res) => res.json())
      .then((data) => {
        
          setOrgName(data.org_name)
          setTopbarColor(data.topbar_color)
          setLogo(data.logo_url)
      })
      .catch((err) => {
        console.error('Failed to load config', err);
      });
  }, []);
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result); // Base64 preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = async () => {
    const formData = new FormData();
    formData.append('org_name', orgName);
    formData.append('topbar_color', topbarColor);
    if (logo) formData.append('logo', logo);
  
    const response = await fetch(`${config.BASE_URL}/config`, {
      method: 'POST',
      body: formData
    });
  
    if (response.ok) {
      const updated = await fetch(`${config.BASE_URL}/config`).then(res => res.json());
      onConfigChange({
        orgName: updated.org_name,
        topbarColor: updated.topbar_color,
        logo: updated.logo_url
      });
      alert('Configuration updated!');
    } else {
      alert('Failed to update config');
    }
  };
  

  return (
    <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>Configuration Panel</Typography>

      <TextField
        fullWidth
        label="Organization Name"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
        sx={{ mb: 2 }}
      />

      <InputLabel sx={{ mb: 1 }}>Topbar Color</InputLabel>
      <SketchPicker
        color={topbarColor}
        onChangeComplete={(color) => setTopbarColor(color.hex)}
      />

<Box sx={{ mt: 3 }}>
  <InputLabel>Upload Logo</InputLabel>
  <input type="file" accept="image/*" onChange={handleLogoChange} />
  
  <Box mt={2}>
    <img
      src={logoPreview || `${config.BASE_URL}${logo}`}
      alt="Logo"
      style={{ height: 50, borderRadius: 8 }}
    />
  </Box>
</Box>


      <Button variant="contained" sx={{ mt: 3 }} onClick={handleApply}>
        Apply Changes
      </Button>
    </Box>
  );
};

export default ConfigurationPanel;
