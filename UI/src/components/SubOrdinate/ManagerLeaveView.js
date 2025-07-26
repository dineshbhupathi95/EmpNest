import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import axios from 'axios';
import config from '../../config';

const ManagerLeaveRequestsView = ({ managerId, token }) => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  useEffect(() => {
    if (!managerId || !token) return;
    axios.get(`${config.BASE_URL}/leaves/manager/${managerId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setLeaveRequests(res.data))
      .catch(err => console.error("Failed to fetch leave requests", err));
  }, [managerId, token]);

  const handleLeaveAction = async (leaveId, status) => {
    try {
      let url = ""
      if (status == "Approved"){
            url = `${config.BASE_URL}/leaves/${leaveId}/approve`
      }
      else{
        url = `${config.BASE_URL}/leaves/${leaveId}/reject`
      }
      await axios.put(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLeaveRequests(prev =>
        prev.map(lr => lr.id === leaveId ? { ...lr, status } : lr)
      );
    } catch (err) {
      console.error("Failed to update leave status", err);
    }
  };

  return (
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
          {leaveRequests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No leave requests found</TableCell>
            </TableRow>
          ) : (
            leaveRequests.map(lr => (
              <TableRow key={lr.id}>
                <TableCell>{lr.user?.first_name} {lr.user?.last_name}</TableCell>
                <TableCell>{lr.start_date}</TableCell>
                <TableCell>{lr.end_date}</TableCell>
                <TableCell>{lr.reason}</TableCell>
                <TableCell>{lr.status}</TableCell>
                <TableCell>
                  {lr.status === 'Pending' ? (
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
            ))
          )}
        </TableBody>
      </Table>
    </Box>
  );
};

export default ManagerLeaveRequestsView;
