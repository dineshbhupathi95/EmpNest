// src/components/MemberWorkHoursChart.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan 24', workHours: 8, overtime: 0.5 },
  { name: 'Jan 25', workHours: 9, overtime: 0.2 },
  { name: 'Jan 26', workHours: 7, overtime: 1.5 },
  { name: 'Jan 27', workHours: 8.5, overtime: 0.8 },
  { name: 'Jan 28', workHours: 7.5, overtime: 0.3 },
  { name: 'Jan 29', workHours: 8, overtime: 0 },
  { name: 'Jan 30', workHours: 0, overtime: 0 },
];

const MemberWorkHoursChart = () => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, minWidth: 400, height: 350 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Member Work Hours</Typography>
          <Button variant="text" sx={{ textTransform: 'none', color: '#1976d2' }}>View by We</Button>
        </Box>
        <Typography variant="h4" sx={{ mb: 3 }}>120h 54m</Typography>
        <Box sx={{ height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis hide={true} />
              <Tooltip />
              <Bar dataKey="workHours" stackId="a" fill="#1976d2" barSize={10} radius={[5, 5, 0, 0]} />
              <Bar dataKey="overtime" stackId="a" fill="#ef9a9a" barSize={10} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, backgroundColor: '#1976d2', borderRadius: '50%', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">Work Time</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 10, height: 10, backgroundColor: '#ef9a9a', borderRadius: '50%', mr: 0.5 }} />
            <Typography variant="body2" color="text.secondary">Overtime</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemberWorkHoursChart;