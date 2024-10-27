import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const VerificationSuccessPage = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Verifying your email...');
    const [errorDetails, setErrorDetails] = useState(null);

    useEffect(() => {
        // Create a cancel token source for Axios
        const source = axios.CancelToken.source();

        const verifyEmail = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/user/verify/${token}`, {
                    cancelToken: source.token
                });
                setMessage(res.data.message);
                setErrorDetails(null); // Clear any errors if verification succeeds
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log('Request canceled:', error.message);
                } else {
                    setMessage('Verification failed or token is invalid/expired.');
                    setErrorDetails(error.response ? error.response.data.message : error.message);
                }
            }
        };

        verifyEmail();

        // Cleanup function to cancel the request if the component unmounts or re-renders
        return () => {
            source.cancel('Verification request canceled due to component unmount or re-render.');
        };
    }, [token]);

    return (
        <div>
            <h1>Email Verification</h1>
            <p>{message}</p>
            {errorDetails && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    <p><strong>Error Details:</strong> {errorDetails}</p>
                </div>
            )}
        </div>
    );
};

export default VerificationSuccessPage;
