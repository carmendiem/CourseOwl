import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Grid, Link, Button, Paper, TextField, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import config from '../config';

function Login({ setIsLoggedIn, isLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");  // Error for invalid credentials
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        if (isLoggedIn) {
            navigate("/home"); // Redirect to homepage or another page
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();

        // Clear previous errors
        setEmailError("");
        setPasswordError("");
        setLoginError("");

        // Validate email and password fields
        if (!email) {
            setEmailError("Email cannot be empty.");
            return;
        }

        if (!password) {
            setPasswordError("Password cannot be empty.");
            return;
        }

        // Make login request
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
                    // Show error message if login failed
                    setLoginError("Invalid email or password. Please try again.");
                }
            })
            .catch(err => {
                console.log(err);
                // Show error message in case of failure
                setLoginError("Invalid email or password. Please try again.");
            });
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
                    <Typography component="h1" variant="h5" style={heading}>Login</Typography>
                    <form onSubmit={handleLogin}>
                        <TextField
                            style={row}
                            sx={{ label: { fontWeight: '700', fontSize: "1.3rem" } }}
                            label="Email"
                            fullWidth
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
                            label="Password"
                            fullWidth
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Password"
                            name="password"
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
                        {loginError && <Typography color="error" variant="body2" style={{ marginTop: '1rem' }}>{loginError}</Typography>} {/* Show login error */}
                        <Button style={btnStyle} variant="contained" type="submit">Login</Button>
                    </form>
                    <p>Don't have an account? <Link href="/signup">SignUp</Link></p>
                </Paper>
            </Grid>
        </div>
    );
}

export default Login;
