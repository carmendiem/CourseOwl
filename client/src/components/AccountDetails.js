import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Box, Grid, Button, IconButton, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import config from '../config';

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

const AccountDetails = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // To handle errors for any API call

    // States for editing fields
    const [editYear, setEditYear] = useState(false);
    const [newYear, setNewYear] = useState('');
    const [editMajor, setEditMajor] = useState(false);
    const [newMajor, setNewMajor] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    
    // States for email verification
    const [verificationSent, setVerificationSent] = useState(false);
    const [emailError, setEmailError] = useState(null); // Error state for email verification

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
                setUser(res.data.user);
                setNewYear(res.data.user.year_in_school || '');
                setNewMajor(res.data.user.major || '');
                setIsVerified(res.data.user.isVerified || false);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch user data.');
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleSendVerification = async () => {
        setEmailError(null); // Reset error before attempting to send
        try {
            const res = await axios.post(`${config.API_BASE_URL}/user/verify/send`, {}, { withCredentials: true });
            if (res.status === 200) {
                setVerificationSent(true);
            } else {
                setEmailError('Failed to send verification email.');
            }
        } catch (error) {
            setEmailError('Error sending verification email: ' + error);
        }
    };

    const handleSaveYear = async () => {
        try {
            const res = await axios.put(`${config.API_BASE_URL}/user/update`, { year_in_school: newYear }, { withCredentials: true });
            if (res.status === 200) {
                setUser(res.data.user);
                setEditYear(false);
            }
        } catch (error) {
            setError('Failed to update year.');
        }
    };

    const handleSaveMajor = async () => {
        try {
            const res = await axios.put(`${config.API_BASE_URL}/user/update`, { major: newMajor }, { withCredentials: true });
            if (res.status === 200) {
                setUser(res.data.user);
                setEditMajor(false);
            }
        } catch (error) {
            setError('Failed to update major.');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>Account Details</Typography>
            {error && <Typography color="error">{error}</Typography>}

            <Grid container spacing={2}>
                {/* Name Section */}
                <Grid item xs={3}>
                    <Typography variant="h6">Name:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{user?.name || 'Not Provided'}</Typography>
                </Grid>

                {/* Email Section */}
                <Grid item xs={3}>
                    <Typography variant="h6">Email:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{user?.email}</Typography>
                    {isVerified ? (
                        <VerifiedIcon color="success" sx={{ ml: 1 }} />
                    ) : (
                        <>
                            <Typography color="error">Not Verified</Typography>
                            {user?.email?.endsWith('@purdue.edu') && !verificationSent && (
                                <Button onClick={handleSendVerification} variant="contained" sx={{ ml: 2 }}>
                                    Verify Email
                                </Button>
                            )}
                            {verificationSent && (
                                <Typography color="primary" sx={{ ml: 2 }}>
                                    Verification email sent!
                                </Typography>
                            )}
                            {emailError && (
                                <Typography color="error" sx={{ ml: 2 }}>
                                    {emailError}
                                </Typography>
                            )}
                        </>
                    )}
                </Grid>

                {/* Year in School Section */}
                <Grid item xs={3}>
                    <Typography variant="h6">Year in School:</Typography>
                </Grid>
                <Grid item xs={9}>
                    {editYear ? (
                        <>
                            <TextField
                                select
                                value={newYear}
                                onChange={(e) => setNewYear(e.target.value)}
                                label="Select Year"
                                fullWidth
                            >
                                {years.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <IconButton onClick={handleSaveYear}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => setEditYear(false)}>
                                <CancelIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>{user?.year_in_school || 'Not Provided'}</Typography>
                            <IconButton onClick={() => setEditYear(true)}>
                                <EditIcon />
                            </IconButton>
                        </Box>
                    )}
                </Grid>

                {/* Major Section */}
                <Grid item xs={3}>
                    <Typography variant="h6">Major:</Typography>
                </Grid>
                <Grid item xs={9}>
                    {editMajor ? (
                        <>
                            <TextField
                                value={newMajor}
                                onChange={(e) => setNewMajor(e.target.value)}
                                label="Major"
                                fullWidth
                            />
                            <IconButton onClick={handleSaveMajor}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={() => setEditMajor(false)}>
                                <CancelIcon />
                            </IconButton>
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography>{user?.major || 'Not Provided'}</Typography>
                            <IconButton onClick={() => setEditMajor(true)}>
                                <EditIcon />
                            </IconButton>
                        </Box>
                    )}
                </Grid>

                {/* Verification Status */}
                <Grid item xs={3}>
                    <Typography variant="h6">Verified:</Typography>
                </Grid>
                <Grid item xs={9}>
                    {isVerified ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CheckCircleIcon color="success" />
                            <Typography sx={{ ml: 1 }}>Verified</Typography>
                        </Box>
                    ) : (
                        <Typography color="error">Not Verified</Typography>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AccountDetails;
