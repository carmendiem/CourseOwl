import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const VerificationSuccessPage = () => {
    const { token } = useParams();
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/user/verify/${token}`);
                setMessage(res.data.message);
            } catch (error) {
                setMessage('Verification failed or token is invalid/expired.');
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div>
            <h1>Email Verification</h1>
            <p>{message}</p>
        </div>
    );
};

export default VerificationSuccessPage;
