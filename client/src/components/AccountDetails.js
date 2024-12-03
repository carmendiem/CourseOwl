import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    TextField, Typography, Box, Grid, Button, IconButton, MenuItem, Card, CardContent, Divider, Alert 
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import AppIcon from '@mui/icons-material/PhoneIphone';
import config from '../config';

const notificationOptions = [
    { value: 'in_app', label: 'In-App Only', icon: <AppIcon fontSize="small" /> },
    { value: 'email', label: 'Email Only', icon: <EmailIcon fontSize="small" /> },
    { value: 'both', label: 'Both Email & In-App', icon: <NotificationsActiveIcon fontSize="small" /> },
    { value: 'none', label: 'None', icon: <DoNotDisturbIcon fontSize="small" /> }
];
const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

const enrollmentOptions = [
    { value: 'part_time', label: 'Part-Time' },
    { value: 'full_time', label: 'Full-Time' },
];


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
    const [editNotifPref, setEditNotifPref] = useState(false);
    const [notifPreference, setNotifPreference] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [emailError, setEmailError] = useState(null);
    const [showWarning, setShowWarning] = useState(false);
    const [editEnrollment, setEditEnrollment] = useState(false);
    const [newEnrollment, setNewEnrollment] = useState('');
    const [confirmationMessage, setConfirmationMessage] = useState(''); // New state for confirmation message


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
                const userData = res.data.user;
                setUser(userData);
                setNewName(userData.name || '');
                setNewEmail(userData.email || '');
                setNewYear(userData.year_in_school || '');
                setNewMajor(userData.major || '');
                setNotifPreference(userData.notifPreference || 'in-app');  // Default to 'in-app'
                setNewEnrollment(userData.enrollment_status || 'full_time'); // Default to 'full_time'
                setIsVerified(userData.isVerified || false);
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
                setConfirmationMessage('Your name has been updated.');
                setTimeout(() => {
                    setConfirmationMessage('');
                }, 3000);
            }
        } catch (error) {
            setError('Failed to update name.');
        }
    };

    const handleSaveEnrollment = async () => {
        try {
            const res = await axios.put(`${config.API_BASE_URL}/user/update`, { enrollment_status: newEnrollment }, { withCredentials: true });
            if (res.status === 200) {
                setUser(res.data.user);
                setEditEnrollment(false);
                setConfirmationMessage('Your enrollment status has been updated.');
                setTimeout(() => {
                    setConfirmationMessage('');
                }, 3000);
            }
        } catch (error) {
            setError('Failed to update enrollment status.');
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
                setConfirmationMessage('Your email has been updated.');
                setTimeout(() => {
                    setConfirmationMessage('');
                }, 3000);
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
                setConfirmationMessage('Your year in school has been updated.');
                setTimeout(() => {
                    setConfirmationMessage('');
                }, 3000);
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
                setConfirmationMessage('Your major has been updated.');
                setTimeout(() => {
                    setConfirmationMessage('');
                }, 3000);
            }
        } catch (error) {
            setError('Failed to update major.');
        }
    };

    const handleSaveNotifPref = async () => {
        try {
            const res = await axios.put(`${config.API_BASE_URL}/user/update`, { notifPreference }, { withCredentials: true });
            if (res.status === 200) {
                setUser(res.data.user);
                setEditNotifPref(false);
                setShowWarning(notifPreference === 'none');
                setConfirmationMessage("Your alert preferences have been updated."); // Set confirmation message
                
                if (notifPreference === 'email' || notifPreference === 'both') {
                    await axios.post(`${config.API_BASE_URL}/user/sendTestEmail`, { email: res.data.user.email });
                }
                
                setTimeout(() => {
                    setConfirmationMessage('');
                }, 3000);
            }
        } catch (error) {
            setError('Failed to update notification preference.');
        }
    };

    // Function to get the label for the current notification preference
    const getNotifPreferenceLabel = () => {
        const option = notificationOptions.find(opt => opt.value === notifPreference);
        return option ? option.label : 'In-App Only';
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

                    {/* Enrollment Status Section */}
                    <Grid container alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={1}>
                            <WorkIcon />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>Enrollment Status</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            {editEnrollment ? (
                                <TextField 
                                    select 
                                    value={newEnrollment} 
                                    onChange={(e) => setNewEnrollment(e.target.value)} 
                                    size="small" 
                                    fullWidth
                                >
                                    {enrollmentOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <Typography>
                                    {enrollmentOptions.find(option => option.value === user?.enrollment_status)?.label || 'Not Provided'}
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={1}>
                            {editEnrollment ? (
                                <>
                                    <IconButton onClick={handleSaveEnrollment}><SaveIcon /></IconButton>
                                    <IconButton onClick={() => setEditEnrollment(false)}><CancelIcon /></IconButton>
                                </>
                            ) : (
                                <IconButton onClick={() => setEditEnrollment(true)}><EditIcon /></IconButton>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    {/* Notification Preference Section */}
                    <Grid container alignItems="center" sx={{ mb: 2 }}>
                        <Grid item xs={1}>
                            <NotificationsIcon />
                        </Grid>
                        <Grid item xs={5}>
                            <Typography>Notification Preference</Typography>
                        </Grid>
                        <Grid item xs={5}>
                            {editNotifPref ? (
                                <TextField 
                                    select 
                                    value={notifPreference} 
                                    onChange={(e) => setNotifPreference(e.target.value)} 
                                    size="small" 
                                    fullWidth
                                    sx={{
                                        "& .MuiSelect-select": { 
                                            display: 'flex', 
                                            alignItems: 'center' 
                                        }
                                    }}
                                >
                                    {notificationOptions.map((option) => (
                                        <MenuItem 
                                            key={option.value} 
                                            value={option.value}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                padding: '8px 16px',
                                                fontSize: '0.9rem',
                                            }}
                                        >
                                            {option.icon} {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            ) : (
                                <Typography>{getNotifPreferenceLabel()}</Typography>
                            )}
                        </Grid>
                        <Grid item xs={1}>
                            {editNotifPref ? (
                                <>
                                    <IconButton onClick={handleSaveNotifPref}><SaveIcon /></IconButton>
                                    <IconButton onClick={() => setEditNotifPref(false)}><CancelIcon /></IconButton>
                                </>
                            ) : (
                                <IconButton onClick={() => setEditNotifPref(true)}><EditIcon /></IconButton>
                            )}
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

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
                                <Typography sx={{ mr: 5 }}>Verified</Typography>
                            ) : user?.email?.endsWith('@purdue.edu') ? (
                                verificationSent ? (
                                    <Typography color="primary">Verification email sent!</Typography>
                                ) : (
                                    <Button 
                                    onClick={handleSendVerification} 
                                    variant="outlined" 
                                    sx={{ ml: 6.5 }}
                                    >
                                    Verify Email
                                    </Button>
                                )
                            ) : (
                                <Typography color="error">
                                    You must sign up with a Purdue email to request verification.
                                </Typography>
                            )}
                            {/* Not Needed Start */}
                            {emailError && (
                            <Typography color="error" variant="body2" style={{ marginTop: '0.5rem' }}>
                            {emailError}
                            </Typography>
                            )}
                            {/* Not Needed End */}
                        </Grid>
                    </Grid>

                    {/* Warning message for disabling notifications */}
                    {showWarning && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                            You have disabled all alerts. You may miss important updates unless alerts are enabled again.
                        </Alert>
                    )}

                    {confirmationMessage && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {confirmationMessage}
                        </Alert>
                    )}
                </CardContent>
                {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
            </Card>
        </Box>
    );
};

export default AccountDetails;
