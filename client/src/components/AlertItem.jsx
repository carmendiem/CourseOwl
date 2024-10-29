// src/components/AlertItem.jsx
import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { format } from "date-fns";

// Color coding for different alert types
const alertColors = {
    "Time Conflict": { bg: "#FFF3E0", border: "#FFB74D" },
    "Availability Update": { bg: "#E8F5E9", border: "#66BB6A" },
    "Grade Update": { bg: "#E3F2FD", border: "#42A5F5" },
};

const AlertItem = ({ alert, onMarkAsReadOrUnread, onDelete, isArchived }) => {
    const alertStyle = alertColors[alert.type] || { bg: "#F5F5F5", border: "#BDBDBD" };

    return (
        <Box
            display="flex"
            flexDirection="column"
            padding={2}
            border={`2px solid ${alertStyle.border}`}
            borderRadius="8px"
            mb={2}
            bgcolor={alertStyle.bg}
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
            minHeight="150px"  // Fixed minHeight for consistency
            width="100%"       // Full width, container controls sizing
        >
            {/* Header Row: Type on left, Received on right */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" fontWeight="bold" color={alertStyle.border} fontSize="1rem">
                    {alert.type}
                </Typography>
                <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                    Received: {alert.date ? format(new Date(alert.date), "MMM d, yyyy") : "Unknown date"}
                </Typography>
            </Box>

            {/* Conditional Layout for Time Conflict */}
            {alert.type === "Time Conflict" && alert.courseId.length === 2 ? (
                <Box display="flex" justifyContent="space-between" mt={1}>
                    {alert.courseId.map((course) => (
                        <Box key={course._id} width="48%"> {/* Fixed width for side-by-side */}
                            <Typography variant="body1" fontWeight="medium" fontSize="0.9rem">
                                {course.course_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                Professor: {course.Instructors?.[0]?.name || "TBA"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                Course Code: {course.course_code}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                Schedule: {course.Days || "TBA"} {course.Time || "TBA"}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            ) : (
                // Standard Layout for Other Alert Types
                <Box mt={1}>
                    {alert.courseId.map((course) => (
                        <Box key={course._id} mb={1}>
                            <Typography variant="body1" fontWeight="medium" fontSize="0.9rem">
                                {course.course_name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                Professor: {course.Instructors?.[0]?.name || "TBA"}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                Course Code: {course.course_code}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
                                Schedule: {course.Days || "TBA"} {course.Time || "TBA"}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {/* Action Buttons Row */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                <Button
                    onClick={onMarkAsReadOrUnread}
                    variant="contained"
                    size="medium"
                    color={isArchived ? "secondary" : "primary"}
                    sx={{ fontSize: "0.8rem", padding: "8px 16px" }}
                >
                    {isArchived ? "Mark as Unread" : "Mark as Read"}
                </Button>
                <IconButton onClick={onDelete} aria-label="delete" sx={{ transform: "scale(1.3)" }}>
                    <DeleteIcon fontSize="large" />
                </IconButton>
            </Box>
        </Box>
    );
};

export default AlertItem;
