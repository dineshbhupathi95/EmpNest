import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, Grid, Button, TextField,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import config from '../config';

const SubordinateDetails = () => {
  const [tab, setTab] = useState(0);
  const [timesheets, setTimesheets] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [comment, setComment] = useState('');
  console.log(timesheets,'kk')
  useEffect(() => {
    const manager_id = localStorage.getItem('user_id'); // assuming user_id is stored in localStorage
    if (manager_id) {
      axios.get(`${config.BASE_URL}/timesheet/reportees/${manager_id}`)
        .then(res => setTimesheets(res.data))
        .catch(err => console.error("Failed to fetch timesheets", err));
    }
  }, []);

  const handleAction = async (id, action) => {
    try {
      await axios.patch(`${config.BASE_URL}/timesheet/${id}`, {
        status: action,
        description: comment
      });
      setTimesheets(prev =>
        prev.map(ts => ts.id === id ? { ...ts, status: action } : ts)
      );
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setModalOpen(false);
      setComment('');
    }
  };

  const handleChange = (_, newTab) => setTab(newTab);

  return (
    <Box p={4}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs value={tab} onChange={handleChange} centered>
          <Tab label="Employee Info" />
          <Tab label="Timesheet Approvals" />
        </Tabs>

        {tab === 1 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Pending Timesheets</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Week</TableCell>
                  <TableCell>Total Hours</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timesheets.map(ts => (
                  <TableRow key={ts.id}>
                    <TableCell>{ts.user_details?.first_name} {ts.user_details?.last_name}</TableCell>
                    <TableCell>{ts.week_starting}</TableCell>
                    <TableCell>
                      {ts.entries.reduce((sum, e) =>
                        sum + Object.values(e.hours_per_day).reduce((s, h) => s + h, 0)
                      , 0)}
                    </TableCell>
                    <TableCell>{ts.status}</TableCell>
                    <TableCell align="center">
                      {ts.status === 'Submitted' && (
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setSelectedTimesheet(ts);
                            setModalOpen(true);
                          }}
                        >
                          Review
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Review Modal */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
              <DialogTitle>Timesheet Review</DialogTitle>
              <DialogContent dividers>
                <Typography variant="subtitle2">
                  Week Starting: {selectedTimesheet?.week_starting}
                </Typography>
                {selectedTimesheet?.entries?.map((entry, i) => (
                  <Box key={i} mt={2}>
                    <Typography variant="body2">{entry.code}</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Day</TableCell>
                          <TableCell>Hours</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(entry.hours_per_day).map(([day, hours]) => (
                          <TableRow key={day}>
                            <TableCell>{day}</TableCell>
                            <TableCell>{hours}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                ))}
                <TextField
                  label="Comment"
                  multiline
                  rows={3}
                  fullWidth
                  sx={{ mt: 2 }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => handleAction(selectedTimesheet?.id, 'Rejected')} color="error">
                  Reject
                </Button>
                <Button onClick={() => handleAction(selectedTimesheet?.id, 'Approved')} color="primary">
                  Approve
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {tab === 0 && (
          <Box mt={3}>
            <Typography variant="body1">Employee details tab placeholder</Typography>
            {/* You can optionally integrate profile details here */}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SubordinateDetails;
