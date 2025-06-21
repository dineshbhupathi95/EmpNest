import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, TextField, Button, Paper, IconButton,
    MenuItem, Table, TableHead, TableRow, TableCell, TableBody, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import axios from 'axios';
import config from '../config';

dayjs.extend(isoWeek);

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const entryTypes = [
    { label: 'Project', value: 'project' },
    { label: 'Sick Leave', value: 'sick' },
    { label: 'PTO', value: 'pto' },
];

const TimesheetEntry = () => {
    const [weekDate, setWeekDate] = useState(dayjs());
    const [rows, setRows] = useState([{ type: 'project', code: '', hours: {} }]);
    const [projects, setProjects] = useState([]);
    const [previousTimesheets, setPreviousTimesheets] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingTimesheet, setEditingTimesheet] = useState(null);

    useEffect(() => {
        axios.get('/projects')
            .then(res => setProjects(res.data))
            .catch(() =>
                setProjects([
                    { code: 'PRJ001', name: 'HR Portal Dev' },
                    { code: 'PRJ002', name: 'Internal Tooling' },
                ])
            );

        const userId = localStorage.getItem('user_id');
        if (userId) {
            axios.get(`${config.BASE_URL}/timesheet/user/${userId}`)
                .then(res => setPreviousTimesheets(res.data))
                .catch(err => console.error('Failed to fetch previous timesheets', err));
        }
    }, []);

    const handleChange = (index, field, value) => {
        const updated = [...rows];
        updated[index][field] = value;
        setRows(updated);
    };

    const handleHourChange = (index, day, value) => {
        const updated = [...rows];
        updated[index].hours[day] = Number(value);
        setRows(updated);
    };

    const addRow = () => setRows([...rows, { type: 'project', code: '', hours: {} }]);

    const removeRow = (index) => {
        const updated = [...rows];
        updated.splice(index, 1);
        setRows(updated);
    };

    const handleSubmit = () => {
        const weekStart = weekDate.isoWeekday(1).format('YYYY-MM-DD');
        const userId = localStorage.getItem('user_id');

        const payload = {
            user_id: parseInt(userId),
            week_starting: weekStart,
            entries: rows.map(r => ({
                type: r.type,
                code: r.type === 'project' ? r.code : r.type.toUpperCase(),
                hours_per_day: r.hours,
            })),
        };

        const patchPayload = {
            ...editingTimesheet,
            entries: payload.entries,
            status: "Submitted"
          };
          
          // Remove user_details if it exists
          delete patchPayload.user_details;

        const req = editingTimesheet
            ? axios.patch(`${config.BASE_URL}/timesheet/${editingTimesheet.id}`, patchPayload)
            : axios.post(`${config.BASE_URL}/timesheet/`, payload);

        req.then(() => {
            alert(editingTimesheet ? "Timesheet updated!" : "Timesheet submitted!");
            return axios.get(`${config.BASE_URL}/timesheet/user/${userId}`);
        })
            .then(res => {
                setPreviousTimesheets(res.data);
                setEditModalOpen(false);
                setEditingTimesheet(null);
                setRows([{ type: 'project', code: '', hours: {} }]);
            })
            .catch(err => {
                console.error("Error saving timesheet", err);
                alert("Failed to save timesheet.");
            });
    };

    const handleEditClick = (ts) => {
        setEditingTimesheet(ts);
        setWeekDate(dayjs(ts.week_starting));
        setRows(ts.entries.map(e => ({
            type: e.type,
            code: e.code,
            hours: e.hours_per_day
        })));
        setEditModalOpen(true);
    };

    return (
        <Box p={4}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Weekly Timesheet</Typography>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Select any day in the week"
                        value={weekDate}
                        onChange={(date) => setWeekDate(date)}
                        slotProps={{ textField: { margin: 'normal', fullWidth: true } }}
                    />
                </LocalizationProvider>

                {rows.map((row, idx) => (
                    <Box key={idx} sx={{ borderBottom: '1px solid #eee', mt: 2, pb: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={3}>
                                <TextField
                                    select
                                    label="Entry Type"
                                    value={row.type}
                                    onChange={(e) => handleChange(idx, 'type', e.target.value)}
                                    fullWidth
                                    sx={{ width: 150 }}

                                >
                                    {entryTypes.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={4}>
                                {row.type === 'project' ? (
                                    <TextField
                                        select
                                        fullWidth
                                        label="Project Code"
                                        value={row.code}
                                        onChange={(e) => handleChange(idx, 'code', e.target.value)}
                                        sx={{ width: 150 }}
                                    >
                                        {projects.map((proj) => (
                                            <MenuItem key={proj.code} value={proj.code}>
                                                {proj.code} - {proj.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                ) : (
                                    <TextField
                                        value={row.type.toUpperCase()}
                                        label="Leave Type"
                                        disabled
                                        fullWidth
                                    />
                                )}
                            </Grid>

                            {days.map((day) => (
                                <Grid item xs={1.1} key={day}>
                                    <TextField
                                        type="number"
                                        label={day[0]}
                                        inputProps={{ min: 0, max: 24 }}
                                        value={row.hours[day] || ''}
                                        onChange={(e) => handleHourChange(idx, day, e.target.value)}
                                        sx={{ width: 70 }}

                                    />
                                </Grid>
                            ))}

                            <Grid item xs={1}>
                                <IconButton onClick={() => removeRow(idx)} disabled={rows.length === 1}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Box>
                ))}

                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button startIcon={<AddCircleIcon />} onClick={addRow}>Add Row</Button>
                    <Button variant="contained" disabled={rows.length === 0} onClick={handleSubmit}>
                        {editingTimesheet ? 'Update Timesheet' : 'Submit Timesheet'}
                    </Button>
                </Box>

                <Box mt={5}>
                    <Typography variant="h6" gutterBottom>Previous Timesheets</Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Week Starting</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Total Hours</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {previousTimesheets.map(ts => {
                                const total = ts.entries?.reduce(
                                    (sum, entry) => sum + Object.values(entry.hours_per_day).reduce((s, h) => s + h, 0),
                                    0
                                );
                                return (
                                    <TableRow key={ts.id}>
                                        <TableCell>{ts.week_starting}</TableCell>
                                        <TableCell>{ts.status}</TableCell>
                                        <TableCell>{total}</TableCell>
                                        <TableCell>
                                            {['Submitted', 'Rejected'].includes(ts.status) ? (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleEditClick(ts)}
                                                >
                                                    Edit
                                                </Button>
                                            ) : (
                                                <Button size="small" disabled>
                                                    View
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
            </Paper>
        </Box>
    );
};

export default TimesheetEntry;
