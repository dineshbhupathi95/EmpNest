import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import config from '../config';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const managerId = localStorage.getItem('user_id');
    if (!managerId) {
      console.error('Manager ID not found in localStorage');
      return;
    }

    axios.get(`${config.BASE_URL}/reportees/${managerId}`)
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error("Error fetching reportees", err);
        setEmployees([]);
      });
  }, []);

  const handleViewDetails = (emp) => {
    setSelectedEmployee(emp);
    setOpen(true);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>Direct Reportees</Typography>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp.id}>
                <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.phone || '—'}</TableCell>
                <TableCell>{emp.experience || '—'}</TableCell>
                <TableCell>{emp.department || '—'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleViewDetails(emp)} variant="outlined">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Profile Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Profile</DialogTitle>
        <DialogContent dividers>
          {selectedEmployee && (
            <>
              <Typography><strong>Name:</strong> {selectedEmployee.first_name} {selectedEmployee.last_name}</Typography>
              <Typography><strong>Email:</strong> {selectedEmployee.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedEmployee.phone || '—'}</Typography>
              <Typography><strong>Experience:</strong> {selectedEmployee.experience || '—'} years</Typography>
              <Typography><strong>Department:</strong> {selectedEmployee.department || '—'}</Typography>
              <Typography><strong>Skills:</strong> {(selectedEmployee.skills || []).join(', ')}</Typography>
              <Typography><strong>Interests:</strong> {(selectedEmployee.interests || []).join(', ')}</Typography>
              <Typography><strong>Address:</strong> {selectedEmployee.address || '—'}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeDetails;
