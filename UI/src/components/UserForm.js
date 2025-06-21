import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';
import config from '../config';

const UserForm = ({ open, handleClose, editUser, refreshUsers }) => {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    designation: '',
    joining_date: '',
  });

  useEffect(() => {
    if (editUser) {
      setForm(editUser);
    } else {
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        phone: '',
        department: '',
        designation: '',
        joining_date: '',
      });
    }
  }, [editUser]);

  const handleSave = async () => {
    try {
      if (editUser?.id) {
        await axios.put(`${config.BASE_URL}/users/${editUser.id}`, form);
      } else {
        await axios.post(`${config.BASE_URL}/users/`, {
          ...form,
          password: 'defaultpass123' // Required field for creation
        });
      }
      refreshUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} margin="dense" />
        <TextField fullWidth label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} margin="dense" />
        <TextField fullWidth label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} margin="dense" />
        <TextField fullWidth label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} margin="dense" />
        <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} margin="dense" />
        <TextField fullWidth label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} margin="dense" />
        <TextField fullWidth label="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} margin="dense" />
        <TextField fullWidth label="Joining Date" type="date" value={form.joining_date} onChange={(e) => setForm({ ...form, joining_date: e.target.value })} margin="dense" InputLabelProps={{ shrink: true }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
