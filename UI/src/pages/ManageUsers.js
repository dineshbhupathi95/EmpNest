import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Add, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);

  const [form, setForm] = useState({
    email: '',
    role: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    department: '',
    designation: '',
    joining_date: '',
    reporting_to: 0
  });

  const fetchUsers = () => {
    axios.get(`${config.BASE_URL}/users/`)
      .then(res => {
        setUsers(res.data);
        setFilteredUsers(res.data);
      })
      .catch(err => console.error("Failed to fetch users", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredUsers(
      users.filter(u =>
        u.first_name?.toLowerCase().includes(lower) ||
        u.last_name?.toLowerCase().includes(lower) ||
        u.email?.toLowerCase().includes(lower) ||
        u.role?.toLowerCase().includes(lower)
      )
    );
  }, [search, users]);

  const handleDialogOpen = (user = null) => {
    setEditUser(user);
    if (user) {
      setForm({
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        department: user.department,
        designation: user.designation,
        joining_date: user.joining_date,
        reporting_to: user.reporting_to || 0,
      });
    } else {
      setForm({
        email: '',
        role: '',
        password: 'default123', // Required for creation
        first_name: '',
        last_name: '',
        phone: '',
        department: '',
        designation: '',
        joining_date: '',
        reporting_to: 0
      });
    }
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditUser(null);
  };

  const handleSave = async () => {
    try {
      if (editUser?.id) {
        await axios.put(`${config.BASE_URL}/users/${editUser.id}`, form);
      } else {
        await axios.post(`${config.BASE_URL}/users/`, form);
      }
      handleDialogClose();
      fetchUsers();
    } catch (err) {
      console.error('Failed to save user', err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>Manage Users</Typography>

      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          label="Search users"
          variant="outlined"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => handleDialogOpen()}>
          Add User
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role</TableCell><TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredUsers.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.first_name} {user.last_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <IconButton onClick={() => setViewUser(user)}><Visibility /></IconButton>
                <IconButton onClick={() => handleDialogOpen(user)}><Edit /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField label="First Name" fullWidth margin="dense" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
          <TextField label="Last Name" fullWidth margin="dense" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
          <TextField label="Email" fullWidth margin="dense" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <TextField label="Role" fullWidth margin="dense" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
          <TextField label="Phone" fullWidth margin="dense" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <TextField label="Department" fullWidth margin="dense" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
          <TextField label="Designation" fullWidth margin="dense" value={form.designation} onChange={e => setForm({ ...form, designation: e.target.value })} />
          <TextField
            label="Joining Date"
            type="date"
            fullWidth
            margin="dense"
            value={form.joining_date}
            onChange={e => setForm({ ...form, joining_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Reporting To</InputLabel>
            <Select
              value={form.reporting_to}
              onChange={e => setForm({ ...form, reporting_to: e.target.value })}
            >
              <MenuItem value={0}>None</MenuItem>
              {users
                .filter(u => !editUser || u.id !== editUser.id)
                .map(u => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.first_name} {u.last_name} ({u.email})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewUser} onClose={() => setViewUser(null)}>
        <DialogTitle>User Info</DialogTitle>
        <DialogContent dividers>
          <Typography><strong>Name:</strong> {viewUser?.first_name} {viewUser?.last_name}</Typography>
          <Typography><strong>Email:</strong> {viewUser?.email}</Typography>
          <Typography><strong>Role:</strong> {viewUser?.role}</Typography>
          <Typography><strong>Phone:</strong> {viewUser?.phone}</Typography>
          <Typography><strong>Department:</strong> {viewUser?.department}</Typography>
          <Typography><strong>Designation:</strong> {viewUser?.designation}</Typography>
          <Typography><strong>Joining Date:</strong> {viewUser?.joining_date}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUser(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;
