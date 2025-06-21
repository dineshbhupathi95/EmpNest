import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Paper, Avatar, useTheme
} from '@mui/material';
import {
  Group, EventNote, Apartment
} from '@mui/icons-material';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const COLORS = ['#4caf50', '#2196f3', '#ff9800'];

const StatCard = ({ title, count, icon, color }) => (
  <Paper elevation={3} sx={{
    p: 3,
    borderRadius: 2,
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  }}>
    <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
    <Box>
      <Typography variant="subtitle2" color="textSecondary" fontSize={14}>{title}</Typography>
      <Typography variant="h6" fontWeight="bold">{count}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    leaves: 0,
    departments: 0,
    leaveStatus: []
  });

  useEffect(() => {
    axios.get('/dashboard-metrics')
      .then(res => setStats(res.data))
      .catch(() => {
        setStats({
          employees: 24,
          leaves: 10,
          departments: 3,
          leaveStatus: [
            { name: 'Approved', value: 6 },
            { name: 'Pending', value: 3 },
            { name: 'Rejected', value: 1 }
          ]
        });
      });
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom fontWeight="bold">Dashboard</Typography>

      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Employees" count={stats.employees} icon={<Group />} color="#3f51b5" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Leave Requests" count={stats.leaves} icon={<EventNote />} color="#e91e63" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title="Departments" count={stats.departments} icon={<Apartment />} color="#009688" />
        </Grid>
      </Grid>
<br></br>
      <Grid container spacing={6}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>Leave Status Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.leaveStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {stats.leaveStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
