import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';
import { TextField, Button, MenuItem, IconButton, Typography, Box, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior']; // Available years

const AccountDetails = () => {
    const [user, setUser] = useState(null); // Store user details
    const [editYear, setEditYear] = useState(false); // Toggle edit mode for year
    const [editMajor, setEditMajor] = useState(false); // Toggle edit mode for major
    const [newYear, setNewYear] = useState(''); // Track the new year in school
    const [newMajor, setNewMajor] = useState(''); // Track the new major
    const [loading, setLoading] = useState(true);

    // Fetch the current user details on component mount
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/user`, { withCredentials: true });
                if (res.data.user) {
                    setUser(res.data.user);
                    setNewYear(res.data.user.year_in_school || '');
                    setNewMajor(res.data.user.major || '');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user details:', error);
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Handle saving the updated year independently
    const handleSaveYear = async () => {
        if (!newYear || newYear === 'Select Year') {
            alert('Please select a valid year in school.');
            return;
        }
        try {
            const updatedUser = { year_in_school: newYear };
            await axios.put(`${config.API_BASE_URL}/user/update`, updatedUser, { withCredentials: true });
            setUser((prev) => ({ ...prev, year_in_school: newYear }));
            setEditYear(false); // Exit edit mode for year
        } catch (error) {
            console.error('Error updating year:', error);
        }
    };

    // Handle saving the updated major independently
    const handleSaveMajor = async () => {
        if (!newMajor.trim()) {
            alert('Major cannot be empty.');
            return;
        }
        try {
            const updatedUser = { major: newMajor };
            await axios.put(`${config.API_BASE_URL}/user/update`, updatedUser, { withCredentials: true });
            setUser((prev) => ({ ...prev, major: newMajor }));
            setEditMajor(false); // Exit edit mode for major
        } catch (error) {
            console.error('Error updating major:', error);
        }
    };

    // Handle cancelling the edit
    const handleCancel = () => {
        setEditYear(false);
        setEditMajor(false);
        setNewYear(user.year_in_school || ''); // Reset to original values
        setNewMajor(user.major || '');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>Account Details</Typography>

            <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                    <Typography variant="h6">Name:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{user.name}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography variant="h6">Email:</Typography>
                </Grid>
                <Grid item xs={9}>
                    <Typography>{user.email}</Typography>
                </Grid>

                <Grid item xs={3}>
                    <Typography variant="h6">Year:</Typography>
                </Grid>
                <Grid item xs={7}>
                    {editYear ? (
                        <TextField
                            select
                            label="Select Year"
                            value={newYear}
                            onChange={(e) => setNewYear(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="Select Year" disabled>
                                Select Year
                            </MenuItem>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>
                    ) : (
                        <Typography>{user.year_in_school || 'Not Provided'}</Typography>
                    )}
                </Grid>
                <Grid item xs={2}>
                    {!editYear ? (
                        <IconButton onClick={() => setEditYear(true)}>
                            <EditIcon />
                        </IconButton>
                    ) : (
                        <>
                            <IconButton onClick={handleSaveYear}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleCancel}>
                                <CancelIcon />
                            </IconButton>
                        </>
                    )}
                </Grid>

                <Grid item xs={3}>
                    <Typography variant="h6">Major:</Typography>
                </Grid>
                <Grid item xs={7}>
                    {editMajor ? (
                        <TextField
                            label="Major"
                            value={newMajor}
                            onChange={(e) => setNewMajor(e.target.value)}
                            fullWidth
                        />
                    ) : (
                        <Typography>{user.major || 'Not Provided'}</Typography>
                    )}
                </Grid>
                <Grid item xs={2}>
                    {!editMajor ? (
                        <IconButton onClick={() => setEditMajor(true)}>
                            <EditIcon />
                        </IconButton>
                    ) : (
                        <>
                            <IconButton onClick={handleSaveMajor}>
                                <SaveIcon />
                            </IconButton>
                            <IconButton onClick={handleCancel}>
                                <CancelIcon />
                            </IconButton>
                        </>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AccountDetails;
