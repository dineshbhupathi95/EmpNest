import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Grid
} from '@mui/material';
import axios from 'axios';

const HRJobPostings = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', description: '' });

  const fetchJobs = () => {
    axios.get('/jobs').then(res => setJobs(res.data));
  };

  const handlePost = () => {
    axios.post('/jobs', newJob).then(() => {
      fetchJobs();
      setNewJob({ title: '', description: '' });
    });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Manage Job Postings</Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1">Post New Job</Typography>
        <TextField
          fullWidth label="Job Title" margin="normal"
          value={newJob.title}
          onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
        />
        <TextField
          fullWidth label="Description" multiline rows={4}
          value={newJob.description}
          onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
        />
        <Button variant="contained" sx={{ mt: 2 }} onClick={handlePost}>Post Job</Button>
      </Paper>

      <Typography variant="subtitle1" mb={1}>Posted Jobs</Typography>
      <Grid container spacing={2}>
        {jobs.map(job => (
          <Grid item xs={12} md={6} key={job.id}>
            <Paper sx={{ p: 2 }}>
              <Typography fontWeight="bold">{job.title}</Typography>
              <Typography variant="body2">{job.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HRJobPostings;
