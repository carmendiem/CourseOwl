import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import axios from "axios";
import { SearchBar } from "../components/SearchBar.js"
import { CalendarView } from "../components/ScheduleCal";
import config from '../config';
import { TableView } from "../components/TableView.js"

function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(location.state?.user);
    const [loading, setLoading] = useState(!user);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const [changes, setChanges] = useState(false);
    const handleCourseAdd = () => {
        setChanges(!changes);
        // console.log("Changes: ", changes);
    };

    useEffect(() => {
        if (!user) {
            axios.get(`${config.API_BASE_URL}/user/`, { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUser(response.data.user);
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user, navigate]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    return (
        <><SearchBar user={user} detectChange={handleCourseAdd}/>
            <Box sx={{ width: '100%'}}>
                {/* Tabs for selecting different components */}
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    sx={{
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#daaa00',  // Set indicator color
                        },
                        '& .MuiTab-root': {
                          color: '#000',  // Default color for tabs
                          '&.Mui-selected': {
                            color: '#daaa00',  // Selected tab color
                          },
                        },
                      }}
                >
                    <Tab label="Calendar View" />
                    <Tab label="Table View" />
                </Tabs>

                {/* Render the selected component based on the selected tab */}
                <Box sx={{ padding: 1}}>
                    {selectedTab === 0 && <CalendarView user={user} change={changes}/>}
                    {selectedTab === 1 && <TableView user={user} change={changes}/>}
                </Box>
            </Box>
        </>
    );
}

export default Home;
