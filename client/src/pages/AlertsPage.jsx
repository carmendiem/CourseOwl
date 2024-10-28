// // src/pages/AlertsPage.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Box, Typography, Divider, Tabs, Tab } from "@mui/material";
// import AlertItem from "../components/AlertItem";
// import ArchiveSection from "../components/ArchiveSection";
// import ConfirmationDialog from "../components/ConfirmationDialog";
// import config from "../config";

// const AlertsPage = () => {
//     const navigate = useNavigate();
//     const [user, setUser] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [alerts, setAlerts] = useState([]);
//     const [archivedAlerts, setArchivedAlerts] = useState([]);
//     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//     const [selectedAlert, setSelectedAlert] = useState(null);
//     const [selectedTab, setSelectedTab] = useState(0);

//     useEffect(() => {
//         axios.get(`${config.API_BASE_URL}/user/full`, { withCredentials: true })
//             .then(response => {
//                 if (response.data.user) {
//                     setUser(response.data.user);
//                 } else {
//                     navigate("/login");
//                 }
//             })
//             .catch(() => navigate("/login"))
//             .finally(() => setLoading(false));
//     }, [navigate]);

//     useEffect(() => {
//         if (user) {
//             fetchAlerts(user.id);
//         }
//     }, [user]);

//     const fetchAlerts = async (userId) => {
//         try {
//             const activeResponse = await axios.get(`${config.API_BASE_URL}/api/alerts/${userId}`);
//             const archiveResponse = await axios.get(`${config.API_BASE_URL}/api/alerts/${userId}/archived`);
//             setAlerts(activeResponse.data);
//             setArchivedAlerts(archiveResponse.data);
//         } catch (error) {
//             console.error("Error fetching alerts:", error);
//         }
//     };

//     const handleTabChange = (event, newValue) => {
//         setSelectedTab(newValue);
//     };

//     const handleMarkAsRead = async (alertId) => {
//         try {
//             await axios.put(`${config.API_BASE_URL}/api/alerts/${alertId}/read`);
//             setAlerts(prevAlerts => prevAlerts.filter(alert => alert._id !== alertId));
//             setArchivedAlerts(prevArchived => [...prevArchived, alerts.find(alert => alert._id === alertId)]);
//         } catch (error) {
//             console.error("Error marking alert as read:", error);
//         }
//     };

//     const handleMarkAsUnread = async (alertId) => {
//         try {
//             await axios.put(`${config.API_BASE_URL}/api/alerts/${alertId}/unread`);
//             setArchivedAlerts(prevArchived => prevArchived.filter(alert => alert._id !== alertId));
//             setAlerts(prevAlerts => [...prevAlerts, archivedAlerts.find(alert => alert._id === alertId)]);
//         } catch (error) {
//             console.error("Error marking alert as unread:", error);
//         }
//     };

//     const handleDelete = async () => {
//         if (!selectedAlert) return;
//         try {
//             await axios.delete(`${config.API_BASE_URL}/api/alerts/${selectedAlert}`);
//             setAlerts(prevAlerts => prevAlerts.filter(alert => alert._id !== selectedAlert));
//             setArchivedAlerts(prevArchived => prevArchived.filter(alert => alert._id !== selectedAlert));
//             setDeleteDialogOpen(false);
//             setSelectedAlert(null);
//         } catch (error) {
//             console.error("Error deleting alert:", error);
//         }
//     };

//     const openDeleteDialog = (alertId) => {
//         setSelectedAlert(alertId);
//         setDeleteDialogOpen(true);
//     };

//     if (loading) {
//         return <center><h1>Loading...</h1></center>;
//     }

//     return (
//         <Box padding={3}>
//             <Typography variant="h4" gutterBottom>Your Alerts</Typography>
            
//             <Tabs value={selectedTab} onChange={handleTabChange} centered>
//                 <Tab label="Alerts" />
//                 <Tab label="Archived Alerts" />
//             </Tabs>

//             <Divider sx={{ my: 3 }} />

//             {selectedTab === 0 && (
//                 <Box>
//                     {alerts.length === 0 ? (
//                         <Typography>No current alerts to view.</Typography>
//                     ) : (
//                         alerts.map(alert => (
//                             <AlertItem
//                                 key={alert._id}
//                                 alert={alert}
//                                 onMarkAsReadOrUnread={() => handleMarkAsRead(alert._id)}
//                                 onDelete={() => openDeleteDialog(alert._id)}
//                                 isArchived={false}
//                             />
//                         ))
//                     )}
//                 </Box>
//             )}

//             {selectedTab === 1 && (
//                 <ArchiveSection
//                     archivedAlerts={archivedAlerts}
//                     onMarkAsUnread={handleMarkAsUnread}
//                     onDelete={(alertId) => openDeleteDialog(alertId)}
//                 />
//             )}

//             <ConfirmationDialog
//                 open={deleteDialogOpen}
//                 onClose={() => setDeleteDialogOpen(false)}
//                 onConfirm={handleDelete}
//                 title="Confirm Delete"
//                 message="Are you sure you want to permanently delete this alert?"
//             />
//         </Box>
//     );
// };

// export default AlertsPage;


// src/pages/AlertsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Divider, Tabs, Tab } from "@mui/material";
import AlertItem from "../components/AlertItem";
import ArchiveSection from "../components/ArchiveSection";
import ConfirmationDialog from "../components/ConfirmationDialog";
import config from "../config";

const AlertsPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alerts, setAlerts] = useState([]);
    const [archivedAlerts, setArchivedAlerts] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        axios.get(`${config.API_BASE_URL}/user/full`, { withCredentials: true })
            .then(response => {
                if (response.data.user) {
                    setUser(response.data.user);
                    if (response.data.user.notifPreference !== "email" && response.data.user.notifPreference !== "none") {
                        fetchAlerts(response.data.user.id);
                    }
                } else {
                    navigate("/login");
                }
            })
            .catch(() => navigate("/login"))
            .finally(() => setLoading(false));
    }, [navigate]);

    const fetchAlerts = async (userId) => {
        try {
            const activeResponse = await axios.get(`${config.API_BASE_URL}/api/alerts/${userId}`);
            const archiveResponse = await axios.get(`${config.API_BASE_URL}/api/alerts/${userId}/archived`);
            setAlerts(activeResponse.data);
            setArchivedAlerts(archiveResponse.data);
        } catch (error) {
            console.error("Error fetching alerts:", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const handleMarkAsRead = async (alertId) => {
        try {
            await axios.put(`${config.API_BASE_URL}/api/alerts/${alertId}/read`);
            setAlerts(prevAlerts => prevAlerts.filter(alert => alert._id !== alertId));
            setArchivedAlerts(prevArchived => [...prevArchived, alerts.find(alert => alert._id === alertId)]);
        } catch (error) {
            console.error("Error marking alert as read:", error);
        }
    };

    const handleMarkAsUnread = async (alertId) => {
        try {
            await axios.put(`${config.API_BASE_URL}/api/alerts/${alertId}/unread`);
            setArchivedAlerts(prevArchived => prevArchived.filter(alert => alert._id !== alertId));
            setAlerts(prevAlerts => [...prevAlerts, archivedAlerts.find(alert => alert._id === alertId)]);
        } catch (error) {
            console.error("Error marking alert as unread:", error);
        }
    };

    const handleDelete = async () => {
        if (!selectedAlert) return;
        try {
            await axios.delete(`${config.API_BASE_URL}/api/alerts/${selectedAlert}`);
            setAlerts(prevAlerts => prevAlerts.filter(alert => alert._id !== selectedAlert));
            setArchivedAlerts(prevArchived => prevArchived.filter(alert => alert._id !== selectedAlert));
            setDeleteDialogOpen(false);
            setSelectedAlert(null);
        } catch (error) {
            console.error("Error deleting alert:", error);
        }
    };

    const openDeleteDialog = (alertId) => {
        setSelectedAlert(alertId);
        setDeleteDialogOpen(true);
    };

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }

    // Check if alerts should be hidden based on user's notification preference
    if (user && (user.notifPreference === "email" || user.notifPreference === "none")) {
        return (
            <Box padding={3}>
                <Typography variant="h4" gutterBottom>Your Alerts</Typography>
                <Divider sx={{ my: 3 }} />
                <Typography variant="body1">
                    Alerts are currently not visible based on your notification settings. 
                    Please update your preferences if you wish to view alerts in the app.
                </Typography>
            </Box>
        );
    }

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>Your Alerts</Typography>
            
            <Tabs value={selectedTab} onChange={handleTabChange} centered>
                <Tab label="Alerts" />
                <Tab label="Archived Alerts" />
            </Tabs>

            <Divider sx={{ my: 3 }} />

            {selectedTab === 0 && (
                <Box>
                    {alerts.length === 0 ? (
                        <Typography>No current alerts to view.</Typography>
                    ) : (
                        alerts.map(alert => (
                            <AlertItem
                                key={alert._id}
                                alert={alert}
                                onMarkAsReadOrUnread={() => handleMarkAsRead(alert._id)}
                                onDelete={() => openDeleteDialog(alert._id)}
                                isArchived={false}
                            />
                        ))
                    )}
                </Box>
            )}

            {selectedTab === 1 && (
                <ArchiveSection
                    archivedAlerts={archivedAlerts}
                    onMarkAsUnread={handleMarkAsUnread}
                    onDelete={(alertId) => openDeleteDialog(alertId)}
                />
            )}

            <ConfirmationDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to permanently delete this alert?"
            />
        </Box>
    );
};

export default AlertsPage;
