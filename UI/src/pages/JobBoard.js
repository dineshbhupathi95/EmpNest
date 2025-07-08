import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Button, Dialog, TextField
} from '@mui/material';
import axios from 'axios';

const JobBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [note, setNote] = useState('');

  const fetchJobs = () => {
    axios.get('/jobs')
      .then(res => setJobs(res.data))
      .catch(err => {
        console.error("API failed, using dummy job data:", err);
        setJobs([
          {
            id: 1,
            title: "Frontend Developer",
            description: "Build and maintain internal UI applications using React."
          },
          {
            id: 2,
            title: "Backend Developer",
            description: "Develop APIs and services with FastAPI and PostgreSQL."
          },
          {
            id: 3,
            title: "HR Executive",
            description: "Manage recruitment and employee relations activities."
          }
        ]);
      });
  };
    const applyToJob = () => {
    axios.post(`/jobs/${selectedJob.id}/apply`, { note }).then(() => {
      setOpen(false);
      setNote('');
    });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>In-House Job Opportunities</Typography>
      <Grid container spacing={3}>
        {Array.isArray(jobs) && jobs.map(job => (
          <Grid item xs={12} md={6} key={job.id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{job.title}</Typography>
              <Typography variant="body2" mb={2}>{job.description}</Typography>
              <Button variant="outlined" onClick={() => {
                setSelectedJob(job);
                setOpen(true);
              }}>Apply</Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Box p={3} width={400}>
          <Typography variant="h6">Apply for: {selectedJob?.title}</Typography>
          <TextField
            fullWidth multiline rows={4}
            label="Application Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button variant="contained" sx={{ mt: 2 }} onClick={applyToJob}>Submit Application</Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default JobBoard;
