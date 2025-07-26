import React, { useEffect, useState } from "react";
import { Box, Button, Input, TextField, Typography, Snackbar,Alert } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { notification } from 'antd';
import CircularProgress from '@mui/material/CircularProgress';

import 'antd/dist/reset.css';
import app_logo from '../../static/images/empnest.jpg'
import axios from "axios";
import config from "../../config";
import { setLogo, setOrgName, setTopbarColor, setLogoPreview } from '../../app-redux-store/ConfigSlice'
const ConfigurationPanel = () => {
    const dispatch = useDispatch();
    const { orgName, topbarColor, logo, logoPreview } = useSelector((state) => state.config);
    const [localOrgName, setLocalOrgName] = useState(orgName);
    const [localTopbarColor, setLocalTopbarColor] = useState(topbarColor);
    const [logoFile, setLogoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, type: '', message: '' });


    useEffect(() => {
        axios.get(`${config.BASE_URL}/config`)
            .then(res => {
                const data = res.data;
                dispatch(setOrgName(data.org_name ?? "EmpNEst"));
                dispatch(setTopbarColor(data.topbar_color ?? "#1976d2"));
                dispatch(setLogo(data.logo ?? app_logo));  // Ensure this is a string URL
            })
            .catch(err => console.error("Failed to load config:", err));
    }, [dispatch]);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLogoFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            dispatch(setLogoPreview(reader.result));  // Base64 preview
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append("org_name", localOrgName);
        formData.append("topbar_color", localTopbarColor);
        if (logoFile) {
            formData.append("logo", logoFile);
        }

        try {
            const res = await axios.post(`${config.BASE_URL}/config`, formData);

            dispatch(setOrgName(res.data.org_name));
            dispatch(setTopbarColor(res.data.topbar_color));
            dispatch(setLogo(res.data.logo));
            dispatch(setLogoPreview(null));
            setSnackbar({ open: true, type: 'success', message: 'Organization settings updated successfully!' });
        } catch (err) {
            console.error("Failed to save config:", err);
            setSnackbar({ open: true, type: 'error', message: 'Failed to update settings. Please try again.' });

        } finally {
            setLoading(false);
        }
    };



    return (
        <Box p={3}>
            <Typography variant="h5" mb={2}>Configuration Panel</Typography>

            <TextField
                label="Organization Name"
                value={localOrgName}
                onChange={(e) => setLocalOrgName(e.target.value)}
                fullWidth
                margin="normal"
            />

            <TextField
                label="Topbar Color"
                type="color"
                value={localTopbarColor}
                onChange={(e) => setLocalTopbarColor(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Box mt={2}>
                <Input type="file" onChange={handleLogoChange} />
                {(logoPreview || logo) && (
                    <Box mt={2}>
                        <img
                            src={logoPreview || (typeof logo === "string" ? `${config.BASE_URL}${logo}` : "")}
                            alt="Logo"
                            style={{ height: 50, borderRadius: 8 }}
                            onError={(e) => { e.target.style.display = "none"; }}
                        />
                    </Box>
                )}
            </Box>

            <Box mt={3}>
                <Button
                    variant="contained"
                    sx={{ mt: 3, position: 'relative' }}
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : "Save Configuration"}
                </Button>
            </Box>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.type}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ConfigurationPanel;
