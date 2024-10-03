// src/pages/NotFound.jsx
import React from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/home'); // Redirect to homepage
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Typography variant="h2" style={{ color: 'red' }}>
                404 - Page Not Found
            </Typography>
            <Typography variant="h6" style={{ marginTop: '20px' }}>
                Sorry, the page you are looking for does not exist.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGoHome} style={{ marginTop: '30px' }}>
                Go to Homepage
            </Button>
        </div>
    );
};

export default NotFound;
