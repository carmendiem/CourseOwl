import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MenuItem } from "@mui/material";
import config from '../config';

function Logout({ setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post(`${config.API_BASE_URL}/user/logout`, {}, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    setIsLoggedIn(false);
                    window.alert("Successfully Logged Out.");
                    navigate("/login");
                }
            })
            .catch(error => {
                console.error("Error logging out:", error);
            });
    };

    return (
        <MenuItem onClick={handleLogout} sx={{ color: 'white' }}>
            Logout
        </MenuItem>
    );
}

export default Logout;
