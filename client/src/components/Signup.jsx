import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Link, Button, Paper, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import config from '../config';

function SignUp({ setIsLoggedIn, isLoggedIn }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const [errorMessage, setErrorMessage] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home"); 
        }
    }, [isLoggedIn, navigate]);

    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return regex.test(password);
    };

    const handleLoginAfterSignup = async (email, password) => {
        try {
            const result = await axios.post(`${config.API_BASE_URL}/user/login`, { email, password }, { withCredentials: true });
            if (result.data === "Success") {
                const response = await axios.get(`${config.API_BASE_URL}/user/`, { withCredentials: true });
                if (response.data.user) {
                    setIsLoggedIn(true);
                    navigate("/home", { state: { user: response.data.user } });
                }
            } else {
                alert("Login after signup failed.");
            }
        } catch (err) {
            console.error("Error logging in after signup:", err);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Clear any existing error messages
        setErrorMessage("");
        setNameError("");
        setEmailError("");

        // Check for empty name and email fields
        if (!name) {
            setNameError("Name cannot be empty.");
            return;
        }

        if (!email) {
            setEmailError("Email cannot be empty.");
            return;
        }

        if (!validatePassword(password)) {
            setErrorMessage("Password must be at least 8 characters long, include one uppercase letter, one number, and one special character.");
            return;
        }

        try {
            const result = await axios.post(`${config.API_BASE_URL}/user/signup`, { name, email, password });
            if (result.status === 201) {
                await handleLoginAfterSignup(email, password); 
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                window.alert("Email already exists. Please use a different email.");
            } else {
                console.error(err);
            }
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const paperStyle = { padding: "2rem", margin: "100px auto", borderRadius: "1rem", boxShadow: "10px 10px 10px" };
    const heading = { fontSize: "2.5rem", fontWeight: "600", marginBottom: '0.5rem' };
    const row = { display: "flex", marginTop: "1rem" };
    const btnStyle = { marginTop: "1.5rem", fontSize: "1.2rem", fontWeight: "700", backgroundColor: "blue", borderRadius: "0.5rem" };
    const headerStyle = { fontWeight: "700", fontSize: "3rem", color: "blue", marginBottom: "0rem" };

    return (
        <div>
            <Grid align="center" className="wrapper">
                <Paper style={paperStyle} sx={{ width: { xs: '80vw', sm: '50vw', md: '40vw', lg: '30vw', xl: '20vw' }, height: { lg: '60vh' } }}>
                    {/* COURSEOWL Header */}
                    <Typography variant="h3" style={headerStyle}>
                        COURSEOWL
                    </Typography>
                    <Typography component="h1" variant="h5" style={heading}> Signup </Typography>
                    <form onSubmit={handleSignup}>
                        <TextField 
                            style={row} 
                            sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }} 
                            fullWidth 
                            type="text" 
                            label="Enter Name" 
                            name="name" 
                            onChange={(e) => setName(e.target.value)} 
                            error={Boolean(nameError)} 
                            helperText={nameError}
                        />
                        <TextField 
                            style={row} 
                            sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }} 
                            fullWidth 
                            label="Email" 
                            variant="outlined" 
                            type="email" 
                            placeholder="Enter Email" 
                            name="email" 
                            onChange={(e) => setEmail(e.target.value)}
                            error={Boolean(emailError)} 
                            helperText={emailError} 
                        />
                        
                        <TextField 
                            style={row} 
                            sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }} 
                            fullWidth 
                            label="Password" 
                            variant="outlined" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter Password" 
                            name="password" 
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        {errorMessage && <Typography color="error" variant="body2">{errorMessage}</Typography>}
                        <Button style={btnStyle} variant="contained" type="submit">SignUp</Button>
                    </form>
                    <p>Already have an account?<Link href="/login"> Login</Link></p>
                </Paper>
            </Grid>
        </div>
    );
}

export default SignUp;
