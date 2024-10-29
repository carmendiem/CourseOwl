import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Typography, Paper } from '@mui/material';
import config from '../config';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post(`${config.API_BASE_URL}/user/reset-password/${token}`, { password });
            if (res.status === 200) {
                setSuccess(res.data.message);
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError("Failed to reset password. Please try again.");
        }
    };

    return (
        <Paper
            style={{
                padding: "2rem",
                margin: "100px auto",
                borderRadius: "1rem",
                boxShadow: "10px 10px 10px",
                maxWidth: "400px", // Set maximum width to make the card more compact
                width: "90%", // Adjust width for responsiveness on smaller screens
            }}
        >
            <Typography variant="h4" gutterBottom>Reset Password</Typography>
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" style={{ marginTop: "1rem" }}>
                    Reset Password
                </Button>
            </form>
        </Paper>
    );
};

export default ResetPassword;
