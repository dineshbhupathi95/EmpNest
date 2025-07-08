// src/components/TodaySchedule.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Button, MenuItem, Select, FormControl } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';

const TodaySchedule = () => {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: 1, minWidth: 600, height: 400, position: 'relative', overflow: 'hidden' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Today Schedule</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl variant="outlined" size="small">
              <Select value="Jan 28, 2024" sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}>
                <MenuItem value="Jan 28, 2024">Jan 28, 2024</MenuItem>
                {/* Add more dates */}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddTaskIcon />}
              sx={{ textTransform: 'none', backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
            >
              Add Task
            </Button>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', height: 'calc(100% - 60px)', position: 'relative' }}>
          {/* Time axis */}
          <Box sx={{ width: '60px', borderRight: '1px solid #eee', pr: 1, textAlign: 'right' }}>
            {['08.00', '09.00', '10.00', '11.00'].map((time, index) => (
              <Typography key={index} variant="caption" color="text.secondary" sx={{ display: 'block', mb: index === 0 ? '55px' : '75px' }}>
                {time}
              </Typography>
            ))}
          </Box>

          {/* Schedule items */}
          <Box sx={{ flexGrow: 1, pl: 2, position: 'relative' }}>
            {/* Current time indicator */}
            <Box sx={{
              position: 'absolute',
              left: 0,
              top: '85px', // Adjust this based on actual time
              width: '100%',
              height: '2px',
              backgroundColor: '#1976d2',
              zIndex: 1,
            }}>
              <Box sx={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#1976d2',
                position: 'absolute',
                left: '-5px',
                top: '-4px',
              }} />
            </Box>
            <Typography variant="caption" color="#1976d2" sx={{ position: 'absolute', left: '10px', top: '70px', fontWeight: 'bold' }}>
              09:35
            </Typography>

            {/* Event 1 */}
            <Box
              sx={{
                position: 'absolute',
                top: '60px', // Start time
                left: '0%',
                width: 'calc(100% - 10px)',
                height: '50px', // Duration
                backgroundColor: '#e3f2fd',
                borderRadius: 1,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                boxShadow: 1,
                borderLeft: '4px solid #2196f3',
              }}
            >
              <Typography variant="body2" fontWeight="medium">Online Interview with UI Candidate</Typography>
            </Box>

            {/* Event 2 */}
            <Box
              sx={{
                position: 'absolute',
                top: '150px', // Start time
                left: '0%',
                width: 'calc(100% - 10px)',
                height: '30px', // Duration
                backgroundColor: '#fbe9e7',
                borderRadius: 1,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                boxShadow: 1,
                borderLeft: '4px solid #ff7043',
              }}
            >
              <Typography variant="body2" fontWeight="medium">Weekly meeting</Typography>
            </Box>

            {/* Event 3 */}
            <Box
              sx={{
                position: 'absolute',
                top: '200px', // Start time
                left: '0%',
                width: 'calc(100% - 10px)',
                height: '30px', // Duration
                backgroundColor: '#fce4ec',
                borderRadius: 1,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                boxShadow: 1,
                borderLeft: '4px solid #ec407a',
              }}
            >
              <Typography variant="body2" fontWeight="medium">Psychology test</Typography>
            </Box>

            {/* Event 4 */}
            <Box
              sx={{
                position: 'absolute',
                top: '250px', // Start time
                left: '0%',
                width: 'calc(100% - 10px)',
                height: '50px', // Duration
                backgroundColor: '#e8f5e9',
                borderRadius: 1,
                p: 1,
                display: 'flex',
                alignItems: 'center',
                boxShadow: 1,
                borderLeft: '4px solid #4caf50',
              }}
            >
              <Typography variant="body2" fontWeight="medium">Replying email to applicants</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;