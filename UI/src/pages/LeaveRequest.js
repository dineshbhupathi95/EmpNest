import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button, TextField, MenuItem
} from '@mui/material';
import axios from 'axios';
import config from '../config';

const LeaveRequest = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '', leave_type: 'Sick' });
  const [loading, setLoading] = useState(false);

  const leaveTypes = ['Sick', 'Casual', 'Earned'];

  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    setLoading(true);
    axios.get(`${config.BASE_URL}/leaves`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { user_id }
    })
      .then(res => {
        setLeaveData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [token]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.start_date || !form.end_date || !form.reason) {
      alert("Please fill all required fields");
      return;
    }
    axios.post(`${config.BASE_URL}/leaves`, form, {
      headers: { Authorization: `Bearer ${token}` },
      params: { user_id }
    })
      .then(res => {
        setLeaveData(prev => [...prev, res.data]);
        setForm({ start_date: '', end_date: '', reason: '', leave_type: 'Sick' });
      })
      .catch(() => alert('Failed to submit leave request'));
  };

  // Cancel leave handler
  const handleCancel = (leaveId) => {
    if (!window.confirm("Are you sure you want to cancel this leave request?")) return;

    axios.delete(`${config.BASE_URL}/leaves/${leaveId}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { user_id }

    })
      .then(() => {
        setLeaveData(prev => prev.filter(leave => leave.id !== leaveId));
      })
      .catch(() => alert("Failed to cancel leave request"));
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Leave Requests</Typography>

      <Box component={Paper} p={2} mb={3}>
        <TextField
          name="start_date" label="From Date" type="date" value={form.start_date} onChange={handleChange}
          sx={{ mr: 2 }} InputLabelProps={{ shrink: true }}
        />
        <TextField
          name="end_date"
          label="To Date"
          type="date"
          value={form.end_date}
          onChange={handleChange}
          sx={{ mr: 2 }}
          InputLabelProps={{ shrink: true }}
          inputProps={{
            min: form.start_date || '', // prevent selecting before start date
          }}
        />

        <TextField
          name="reason" label="Reason" value={form.reason} onChange={handleChange}
          sx={{ mr: 2 }}
        />
        <TextField
          name="leave_type" label="Type" select value={form.leave_type} onChange={handleChange}
          sx={{ mr: 2, width: 120 }}
        >
          {leaveTypes.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
        </TextField>
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </Box>

      {loading ? (
        <Typography>Loading leave requests...</Typography>
      ) : (
        <Table component={Paper}>
          <TableHead>
            <TableRow>
              <TableCell>From</TableCell>
              <TableCell>To</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell> {/* New column for Cancel */}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(leaveData) && leaveData.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.start_date}</TableCell>
                <TableCell>{row.end_date}</TableCell>
                <TableCell>{row.reason}</TableCell>
                <TableCell>{row.leave_type}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  {row.status.toLowerCase() !== "approved" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancel(row.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default LeaveRequest;
