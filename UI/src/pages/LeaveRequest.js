// components/LeaveRequest.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, TextField, MenuItem
} from '@mui/material';
import axios from 'axios';

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [form, setForm] = useState({ from: '', to: '', reason: '', type: 'Sick' });

  const leaveTypes = ['Sick', 'Casual', 'Earned'];

  useEffect(() => {
    axios.get('/leave-requests')
      .then(res => setLeaveData(res.data))
      .catch(() => {
        // fallback dummy data
        setLeaveData([
          { id: 1, from: '2024-06-01', to: '2024-06-03', reason: 'Fever', type: 'Sick', status: 'Approved' },
        ]);
      });
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    axios.post('/leave-requests', form)
      .then(res => setLeaveData(prev => [...prev, res.data]))
      .catch(() => alert('Failed to submit'));
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Leave Requests</Typography>
      <Box component={Paper} p={2} mb={3}>
        <TextField
          name="from" label="From Date" type="date" value={form.from} onChange={handleChange}
          sx={{ mr: 2 }} InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="to" label="To Date" type="date" value={form.to} onChange={handleChange}
          sx={{ mr: 2 }} InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="reason" label="Reason" value={form.reason} onChange={handleChange}
          sx={{ mr: 2 }}
        />
        <TextField
          name="type" label="Type" select value={form.type} onChange={handleChange}
          sx={{ mr: 2, width: 120 }}
        >
          {leaveTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </Box>

      <Table component={Paper}>
        <TableHead>
          <TableRow>
            <TableCell>From</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(leaveData) && leaveData.map(row => (
            <TableRow key={row.id}>
              <TableCell>{row.from}</TableCell>
              <TableCell>{row.to}</TableCell>
              <TableCell>{row.reason}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default LeaveRequest;
