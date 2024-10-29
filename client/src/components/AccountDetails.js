import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    TextField, Typography, Box, Grid, Button, IconButton, MenuItem, Card, CardContent, Divider 
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import config from '../config';

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

const AccountDetails = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editName, setEditName] = useState(false);
    const [newName, setNewName] = useState('');
    const [editEmail, setEditEmail] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [editYear, setEditYear] = useState(false);
    const [newYear, setNewYear] = useState('');
    const [editMajor, setEditMajor] = useState(false);
    const [newMajor, setNewMajor] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [emailError, setEmailError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
                setUser(res.data.user);
                setNewName(res.data.user.name || '');
                setNewEmail(res.data.user.email || '');
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
        setEmailError(null);
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

    const handleSaveName = async () => {
        try {
            const res = await axios.put(`${config.API_BASE_URL}/user/update`, { name: newName }, { withCredentials: true });
            if (res.status === 200) {
                setUser(res.data.user);
                setEditName(false);
            }
        } catch (error) {
            setError('Failed to update name.');
        }
    };

    const handleSaveEmail = async () => {
        try {
            const res = await axios.put(`${config.API_BASE_URL}/user/update`, { email: newEmail }, { withCredentials: true });
            if (res.status === 200) {
                setUser(res.data.user);
                setIsVerified(false);
                setVerificationSent(false);
                setEditEmail(false);
            }
        } catch (error) {
            setError('Failed to update email.');
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
        <Box sx={{ padding: 4, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4" sx={{ mb: 2 }}>My Account</Typography>
            <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 2, boxShadow: 3 }}>
                <CardContent>
                    {/* Name Section */}
                    <Grid container alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={1}>
                            <AccountCircleIcon />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>Name</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            {editName ? (
                                <TextField value={newName} onChange={(e) => setNewName(e.target.value)} size="small" fullWidth />
                            ) : (
                                <Typography>{user?.name || 'Not Provided'}</Typography>
                            )}
                        </Grid>
                        <Grid item xs={1}>
                            {editName ? (
                                <>
                                    <IconButton onClick={handleSaveName}><SaveIcon /></IconButton>
                                    <IconButton onClick={() => setEditName(false)}><CancelIcon /></IconButton>
                                </>
                            ) : (
                                <IconButton onClick={() => setEditName(true)}><EditIcon /></IconButton>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Email Section */}
                    <Grid container alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={1}>
                            <EmailIcon />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>Email</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            {editEmail ? (
                                <TextField value={newEmail} onChange={(e) => setNewEmail(e.target.value)} size="small" fullWidth />
                            ) : (
                                <Typography>{user?.email}</Typography>
                            )}
                        </Grid>
                        <Grid item xs={1}>
                            {editEmail ? (
                                <>
                                    <IconButton onClick={handleSaveEmail}><SaveIcon /></IconButton>
                                    <IconButton onClick={() => setEditEmail(false)}><CancelIcon /></IconButton>
                                </>
                            ) : (
                                <IconButton onClick={() => setEditEmail(true)}><EditIcon /></IconButton>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Year in School Section */}
                    <Grid container alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={1}>
                            <SchoolIcon />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>Year in School</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            {editYear ? (
                                <TextField select value={newYear} onChange={(e) => setNewYear(e.target.value)} size="small" fullWidth>
                                    {years.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>)}
                                </TextField>
                            ) : (
                                <Typography>{user?.year_in_school || 'Not Provided'}</Typography>
                            )}
                        </Grid>
                        <Grid item xs={1}>
                            {editYear ? (
                                <>
                                    <IconButton onClick={handleSaveYear}><SaveIcon /></IconButton>
                                    <IconButton onClick={() => setEditYear(false)}><CancelIcon /></IconButton>
                                </>
                            ) : (
                                <IconButton onClick={() => setEditYear(true)}><EditIcon /></IconButton>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Major Section */}
                    <Grid container alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={1}>
                            <WorkIcon />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>Major</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            {editMajor ? (
                                <TextField value={newMajor} onChange={(e) => setNewMajor(e.target.value)} size="small" fullWidth />
                            ) : (
                                <Typography>{user?.major || 'Not Provided'}</Typography>
                            )}
                        </Grid>
                        <Grid item xs={1}>
                            {editMajor ? (
                                <>
                                    <IconButton onClick={handleSaveMajor}><SaveIcon /></IconButton>
                                    <IconButton onClick={() => setEditMajor(false)}><CancelIcon /></IconButton>
                                </>
                            ) : (
                                <IconButton onClick={() => setEditMajor(true)}><EditIcon /></IconButton>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Verification Status Section */}
                    <Grid container alignItems="center">
                        <Grid item xs={1}>
                            {isVerified ? (
                                <CheckCircleIcon color="success" />
                            ) : (
                                <CancelIcon color="error" />
                            )}
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>Verification Status</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            {isVerified ? (
                                <Typography>Verified</Typography>
                            ) : user?.email?.endsWith('@purdue.edu') ? (
                                verificationSent ? (
                                    <Typography color="primary">Verification email sent!</Typography>
                                ) : (
                                    <Button onClick={handleSendVerification} variant="outlined">Verify Email</Button>
                                )
                            ) : (
                                <Typography color="error">
                                    You must sign up with a Purdue email to request verification.
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
                {emailError && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{emailError}</Typography>}
            </Card>
        </Box>
    );
};

export default AccountDetails;
