import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Tabs, Tab, Paper, Button, TextField,
  Table, TableBody, TableCell, TableHead, TableRow, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import axios from 'axios';
import config from '../config';
import EmployeeDetails from '../components/EmployeeDetails';

const SubordinateDetails = () => {
  const [tab, setTab] = useState(0);
  const [timesheets, setTimesheets] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const manager_id = localStorage.getItem('user_id');
    if (manager_id) {
      axios.get(`${config.BASE_URL}/timesheet/reportees/${manager_id}`)
        .then(res => setTimesheets(res.data))
        .catch(err => console.error("Failed to fetch timesheets", err));

      axios.get(`${config.BASE_URL}/leave/reportees/${manager_id}`)
        .then(res => setLeaveRequests(res.data))
        .catch(err => {
          console.error("Failed to fetch leave requests", err);
          // Dummy fallback
          setLeaveRequests([
            {
              id: 1,
              employee: 'John Doe',
              from_date: '2025-06-10',
              to_date: '2025-06-12',
              reason: 'Medical',
              status: 'Submitted'
            },
            {
              id: 2,
              employee: 'Jane Smith',
              from_date: '2025-06-15',
              to_date: '2025-06-16',
              reason: 'Personal',
              status: 'Approved'
            }
          ]);
        });
    }
  }, []);

  const handleChange = (_, newTab) => setTab(newTab);

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

  const handleLeaveAction = async (id, action) => {
    try {
      await axios.patch(`${config.BASE_URL}/leave/${id}`, { status: action });
      setLeaveRequests(prev =>
        prev.map(lr => lr.id === id ? { ...lr, status: action } : lr)
      );
    } catch (err) {
      console.error("Failed to update leave status", err);
    }
  };

  return (
    <Box p={4}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Tabs value={tab} onChange={handleChange} centered>
          <Tab label="Employee Info" />
          <Tab label="Timesheet Approvals" />
          <Tab label="Leave Requests" />
        </Tabs>

        {tab === 0 && (
          <Box mt={3}>
            <EmployeeDetails />
          </Box>
        )}

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

        {tab === 2 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>Leave Requests</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveRequests.map(lr => (
                  <TableRow key={lr.id}>
                    <TableCell>{lr.employee}</TableCell>
                    <TableCell>{lr.from_date}</TableCell>
                    <TableCell>{lr.to_date}</TableCell>
                    <TableCell>{lr.reason}</TableCell>
                    <TableCell>{lr.status}</TableCell>
                    <TableCell>
                      {lr.status === 'Submitted' ? (
                        <>
                          <Button
                            size="small"
                            color="primary"
                            onClick={() => handleLeaveAction(lr.id, 'Approved')}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleLeaveAction(lr.id, 'Rejected')}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button size="small" disabled>View</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SubordinateDetails;
