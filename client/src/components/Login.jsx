import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Link, Button, Paper, TextField, Typography, IconButton, InputAdornment, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import config from '../config';

function Login({ setIsLoggedIn, isLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");  
    const [forgotEmail, setForgotEmail] = useState("");  // State for forgot email
    const [forgotError, setForgotError] = useState("");  // State for forgot password error
    const [forgotSuccess, setForgotSuccess] = useState("");  // State for success message
    const [openForgotDialog, setOpenForgotDialog] = useState(false);  // Dialog state
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home");
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");
        setLoginError("");

        if (!email) {
            setEmailError("Email cannot be empty.");
            return;
        }

        if (!password) {
            setPasswordError("Password cannot be empty.");
            return;
        }

        axios.post(`${config.API_BASE_URL}/user/login`, { email, password }, { withCredentials: true })
            .then(result => {
                if (result.data === "Success") {
                    axios.get(`${config.API_BASE_URL}/user/`, { withCredentials: true })
                        .then(response => {
                            if (response.data.user) {
                                setIsLoggedIn(true);
                                navigate("/home", { state: { user: response.data.user } });
                            }
                        });
                } else {
                    setLoginError("Invalid email or password. Please try again.");
                }
            })
            .catch(err => {
                setLoginError("Invalid email or password. Please try again.");
            });
    };

    const handleForgotPassword = async () => {
        setForgotError("");
        setForgotSuccess("");

        if (!forgotEmail) {
            setForgotError("Email cannot be empty.");
            return;
        }

        try {
            const res = await axios.post(`${config.API_BASE_URL}/user/forgot-password`, { email: forgotEmail });
            if (res.status === 200) {
                setForgotSuccess("Password reset email sent. Please check your inbox.");
                setForgotEmail(""); 
            } else {
                setForgotError("Unable to send reset email. Try again.");
            }
        } catch (error) {
            setForgotError("An error occurred. Please try again.");
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleOpenForgotDialog = () => setOpenForgotDialog(true);
    const handleCloseForgotDialog = () => {
        setOpenForgotDialog(false);
        setForgotEmail("");
        setForgotError("");
        setForgotSuccess("");
    };

    return (
        <div>
            <Grid align="center" className="wrapper">
                <Paper
                    style={{
                        padding: "2rem",
                        margin: "100px auto",
                        borderRadius: "1rem",
                        boxShadow: "10px 10px 10px",
                        maxWidth: "400px", // Set maximum width to condense the card
                        width: "90%", // Adjust width for responsiveness on smaller screens
                    }}
                >
                    <Typography variant="h3" style={{ fontWeight: "700", fontSize: "3rem", color: "blue", marginBottom: "0rem" }}>
                        COURSEOWL
                    </Typography>
                    <Typography component="h1" variant="h5" style={{ fontSize: "2.5rem", fontWeight: "600", marginBottom: '0.5rem' }}>Login</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField
                            style={{ display: "flex", marginTop: "1rem" }}
                            label="Email"
                            fullWidth
                            variant="outlined"
                            type="email"
                            placeholder="Enter Email"
                            onChange={(e) => setEmail(e.target.value)}
                            error={Boolean(emailError)}
                            helperText={emailError}
                        />
                        <TextField
                            style={{ display: "flex", marginTop: "1rem" }}
                            label="Password"
                            fullWidth
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(passwordError)}
                            helperText={passwordError}
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
                        {loginError && <Typography color="error" variant="body2" style={{ marginTop: '1rem' }}>{loginError}</Typography>}
                        <Button style={{ marginTop: "1.5rem", fontSize: "1.2rem", fontWeight: "700", backgroundColor: "blue", borderRadius: "0.5rem" }} variant="contained" type="submit">Login</Button>
                    </form>
                    <Button color="primary" onClick={handleOpenForgotDialog} style={{ marginTop: '1rem' }}>
                        Forgot Password?
                    </Button>
                    <Dialog open={openForgotDialog} onClose={handleCloseForgotDialog}>
                        <DialogTitle>Forgot Password</DialogTitle>
                        <DialogContent>
                            <TextField
                                label="Enter your email"
                                fullWidth
                                variant="outlined"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                error={Boolean(forgotError)}
                                helperText={forgotError}
                                style={{ marginTop: '1rem' }}
                            />
                            {forgotSuccess && <Typography color="primary" style={{ marginTop: '1rem' }}>{forgotSuccess}</Typography>}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleForgotPassword} color="primary">Reset Password</Button>
                            <Button onClick={handleCloseForgotDialog} color="secondary">Cancel</Button>
                        </DialogActions>
                    </Dialog>
                    <p>Don't have an account? <Link href="/signup">SignUp</Link></p>
                </Paper>
            </Grid>
        </div>
    );
}

export default Login;
