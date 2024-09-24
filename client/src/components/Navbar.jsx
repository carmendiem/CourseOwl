import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ForumIcon from '@mui/icons-material/Forum';
import ClassIcon from '@mui/icons-material/Class';
import HomeIcon from '@mui/icons-material/Home';
import Logout from './Logout';

const sidebarStyle = {
    height: '100vh',
    width: '100px',
    backgroundColor: '#2E3B55',
    color: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '20px',
    paddingBottom: '20px',
};

const iconStyle = (isActive) => ({
    color: isActive ? '#FFD700' : 'white', // Highlight color if active
    fontSize: '1.8rem',
    marginBottom: '20px',
});

const textStyle = (isActive) => ({
    color: isActive ? '#FFD700' : 'white', // Highlight color for text if active
    fontSize: '1rem',
    textAlign: 'center',
});

export const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
    const location = useLocation(); // Hook to get current path
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={sidebarStyle}>
            <Box>
                <Typography variant="h5" sx={{ marginBottom: '30px', fontWeight: 'bold' }}>
                    OWL
                </Typography>
                <Divider sx={{ backgroundColor: 'white', marginBottom: '30px', width: '60%' }} />
                <List>
                    {isLoggedIn ? (
                        <>
                            <ListItem button component={Link} to="/home">
                                <IconButton sx={iconStyle(location.pathname === '/home')}>
                                    <HomeIcon />
                                </IconButton>
                            </ListItem>
                            <ListItem button component={Link} to="/alerts">
                                <IconButton sx={iconStyle(location.pathname === '/alerts')}>
                                    <NotificationsIcon />
                                </IconButton>
                            </ListItem>
                            <ListItem button component={Link} to="/forums">
                                <IconButton sx={iconStyle(location.pathname === '/forums')}>
                                    <ForumIcon />
                                </IconButton>
                            </ListItem>
                            <ListItem button component={Link} to="/courses">
                                <IconButton sx={iconStyle(location.pathname === '/courses')}>
                                    <ClassIcon />
                                </IconButton>
                            </ListItem>
                        </>
                    ) : (
                        <>
                            <ListItem button component={Link} to="/login">
                                <Typography sx={textStyle(location.pathname === '/login')}>
                                    Login
                                </Typography>
                            </ListItem>
                            <ListItem button component={Link} to="/signup">
                                <Typography sx={textStyle(location.pathname === '/signup')}>
                                    Signup
                                </Typography>
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>

            {isLoggedIn && (
                <Box sx={{ marginBottom: '20px' }}>
                    <IconButton
                        aria-controls="settings-menu"
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={iconStyle(false)} // settings icon is not part of the page navigation
                    >
                        <SettingsIcon />
                    </IconButton>
                    <Menu
                        id="settings-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'settings-button',
                        }}
                        PaperProps={{
                            style: {
                                backgroundColor: '#2E3B55', // matching sidebar color
                                color: 'white',
                            },
                        }}
                    >
                        <MenuItem onClick={handleClose} sx={{ color: 'white' }}>
                            <Logout setIsLoggedIn={setIsLoggedIn} />
                        </MenuItem>
                    </Menu>
                </Box>
            )}
        </Box>
    );
};
