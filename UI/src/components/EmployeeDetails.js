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
    axios.get(`${config.BASE_URL}/employees`)
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error("Error fetching employee data", err);
        // Dummy fallback data
        setEmployees([
          {
            id: 1,
            name: "John Doe",
            salary: 75000,
            skills: ["React", "Node.js", "GraphQL"],
            experience: 5,
            interests: ["AI", "Cloud"],
            email: "john@example.com",
            phone: "9876543210",
            address: "Bangalore, India",
            department: "Engineering"
          },
          {
            id: 2,
            name: "Jane Smith",
            salary: 68000,
            skills: ["Python", "Django", "PostgreSQL"],
            experience: 4,
            interests: ["Data Science", "APIs"],
            email: "jane@example.com",
            phone: "8765432109",
            address: "Hyderabad, India",
            department: "Backend"
          }
        ]);
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
              <TableCell>Salary</TableCell>
              <TableCell>Skills</TableCell>
              <TableCell>Experience (Years)</TableCell>
              <TableCell>Interests</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map(emp => (
              <TableRow key={emp.id}>
                <TableCell>{emp.name}</TableCell>
                <TableCell>₹{emp.salary}</TableCell>
                <TableCell>{emp.skills.join(', ')}</TableCell>
                <TableCell>{emp.experience}</TableCell>
                <TableCell>{emp.interests.join(', ')}</TableCell>
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

      {/* Full Profile Modal */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Employee Profile</DialogTitle>
        <DialogContent dividers>
          {selectedEmployee && (
            <>
              <Typography><strong>Name:</strong> {selectedEmployee.name}</Typography>
              <Typography><strong>Email:</strong> {selectedEmployee.email}</Typography>
              <Typography><strong>Phone:</strong> {selectedEmployee.phone}</Typography>
              <Typography><strong>Salary:</strong> ₹{selectedEmployee.salary}</Typography>
              <Typography><strong>Skills:</strong> {selectedEmployee.skills.join(', ')}</Typography>
              <Typography><strong>Experience:</strong> {selectedEmployee.experience} years</Typography>
              <Typography><strong>Interests:</strong> {selectedEmployee.interests.join(', ')}</Typography>
              <Typography><strong>Address:</strong> {selectedEmployee.address}</Typography>
              <Typography><strong>Department:</strong> {selectedEmployee.department}</Typography>
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
