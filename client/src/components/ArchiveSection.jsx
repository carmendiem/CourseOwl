// src/components/ArchiveSection.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import AlertItem from "./AlertItem";

const ArchiveSection = ({ archivedAlerts, onMarkAsUnread, onDelete }) => (
    <Box>
        <Typography variant="h5" gutterBottom>Archived Alerts</Typography>
        {archivedAlerts.length === 0 ? (
            <Typography>No archived alerts.</Typography>
        ) : (
            archivedAlerts.map(alert => (
                <AlertItem
                    key={alert._id}
                    alert={alert}
                    onMarkAsReadOrUnread={() => onMarkAsUnread(alert._id)}
                    onDelete={() => onDelete(alert._id)}
                    isArchived={true}
                />
            ))
        )}
    </Box>
);

export default ArchiveSection;
