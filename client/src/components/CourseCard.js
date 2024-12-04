import { Card, CardContent, CardActionArea, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { FavoriteBorder, Favorite } from '@mui/icons-material'; // Icons for wishlist
import { useState, useEffect } from "react";
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import config from '../config';
import axios from "axios";

export function CourseCard({ user, course, onChange }) {
    const [openAlreadyAdded, setOpenAlreadyAdded] = useState(false);
    const [openCourseAdded, setOpenCourseAdded] = useState(false);
    const [openConflictDialog, setOpenConflictDialog] = useState(false);
    const [openCourseFullDialog, setOpenCourseFullDialog] = useState(false);
    const [openCourseOptInDialog, setCourseOptInDialog] = useState(false);

    const [openWishlistDialog, setOpenWishlistDialog] = useState(false); // For wishlist success dialog
    const [openAlreadyInWishlist, setOpenAlreadyInWishlist] = useState(false); // For already-in-wishlist dialog
    const [wishlistAdded, setWishlistAdded] = useState(false); // Toggle heart icon state

    const handleCloseAlreadyAdded = () => setOpenAlreadyAdded(false);
    const handleCloseCourseAdded = () => setOpenCourseAdded(false);
    const handleCloseConflictDialog = () => setOpenConflictDialog(false);
    const handleCloseCourseFullDialog = () => setOpenCourseFullDialog(false);
    const handleCourseOptInDialog = () => setCourseOptInDialog(false);

    const handleCloseWishlistDialog = () => setOpenWishlistDialog(false);
    const handleCloseAlreadyInWishlist = () => setOpenAlreadyInWishlist(false);

    const addCourse = async (event) => {
        event.preventDefault();
        const courseId = course._id;
        const email = user.email;

        try {
            const res = await axios.post(`${config.API_BASE_URL}/calendar/addCourse`, { email, courseId }, { withCredentials: true });
            
            if (res.data.status === "Course already added") {
                setOpenAlreadyAdded(true);
            } else if (res.data.timeConflict) {
                setOpenConflictDialog(true);
                onChange(!onChange);
            } else if (res.data.courseFull) {
                setOpenCourseFullDialog(true); // Open the course full dialog if the course is full
            } else {
                setOpenCourseAdded(true);
                onChange(!onChange);
            }
        } catch (error) {
            console.log("Error adding course: ", error);
        }
    };

    const addToWishlist = async (event) => {
        event.preventDefault();
        const courseId = course._id;
        const email = user.email;

        try {
            const res = await axios.post(`${config.API_BASE_URL}/calendar/addCourseW`, { email, courseId }, { withCredentials: true });

            if (res.data.status === "Course already added to wishlist") {
                setOpenAlreadyInWishlist(true);
            } else {
                setWishlistAdded(true); // Toggle icon to filled heart
                setOpenWishlistDialog(true);
                onChange(!onChange);
            }
        } catch (error) {
            console.log("Error adding course to wishlist: ", error);
        }
    };

    // Function to handle opting in for course availability alerts
    const handleOptInForAlerts = async () => {
        const courseId = course._id;
        const email = user.email;

        try {
            // Call the backend to add the course to avail_ids if not already present
            await axios.post(`${config.API_BASE_URL}/calendar/optInForAvailabilityAlert`, { email, courseId }, { withCredentials: true });
            await axios.post(`${config.API_BASE_URL}/calendar/addCourseW`, { email, courseId }, { withCredentials: true });
            setCourseOptInDialog(true);
        } catch (error) {
            console.log("Error opting in for availability alerts: ", error);
        } finally {
            setOpenCourseFullDialog(false); // Close the dialog after opting in
        }
    };

    return (
        <div style={{ minWidth: "300px" }}>
            <Card sx={{ position: 'relative' }}>
                <CardActionArea component={Link} to={`/course/${course.course_code}`}>
                <IconButton 
                    onClick={(event) => addCourse(event)} 
                    sx={{
                        position: 'absolute',
                        top: 8, // Position from the top of the card
                        right: 8, // Position from the right of the card
                        color: (theme) => theme.palette.grey[500],
                        // backgroundColor: '#f5f5f5', // Optional: Add background color for visibility
                        '&:hover': {
                            backgroundColor: '#e0e0e0', // Optional: Add hover effect
                        },
                        // borderRadius: '50%', // Optional: Keep the button circular
                        // boxShadow: '0 3px 6px rgba(0,0,0,0.1)', // Optional: Add slight shadow for depth
                        width: 40, // Optional: Uniform button size
                        height: 40, // Optional: Uniform button size
                    }}
                >
                    <Add />
                </IconButton>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 18, mb: 1, textAlign: "left" }}>
                            {course.course_code}
                        </Typography>
                        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
                            {course.credit_hours} Credits | {course.Instructors.map((instructor, index) => (
                                <span key={index}>
                                    {instructor.name === "TBA" ? "TBA" : <Link to={`/professor/${instructor.alias}`}>{instructor.name}</Link>}
                                    {index < course.Instructors.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </Typography>
                        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
                            {course['Schedule Type']} | {course.Days || "N/A"} | {course.Time || "N/A"}
                        </Typography>
                        <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
                            {course.Where}
                        </Typography>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14, mt: 1, textAlign: "left" }}>
    Expected Weekly Time Commitment: {course.credit_hours > 0 ? `${course.credit_hours * 3} hours` : "N/A"}
</Typography>


                    </CardContent>
                </CardActionArea>

                {/* Wishlist Button at Bottom-Right */}
                <IconButton
                    onClick={(event) => addToWishlist(event)}
                    sx={{
                        position: 'absolute',
                        bottom: 8,
                        right: 8,
                        color: 'grey',
                        // backgroundColor: wishlistAdded ? '#ffe6e6' : '#f5f5f5',
                        '&:hover': {
                            backgroundColor: '#e0e0e0',
                        },
                        // borderRadius: '50%',
                        // boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                        width: 40,
                        height: 40,
                    }}
                >
                    {<FavoriteBorder/>}
                </IconButton>
            </Card>

            {/* Dialog for "Course already added" */}
            <Dialog open={openAlreadyAdded} onClose={handleCloseAlreadyAdded}>
                <DialogTitle>Course already added!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseAlreadyAdded}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for "Course added successfully" */}
            <Dialog open={openCourseAdded} onClose={handleCloseCourseAdded}>
                <DialogTitle>Course added to preferences!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseCourseAdded}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for "Time conflict detected" */}
            <Dialog open={openConflictDialog} onClose={handleCloseConflictDialog}>
                <DialogTitle>Time conflict detected!</DialogTitle>
                <DialogContent>
                    <Typography>This course conflicts with another course in your schedule. Check the Alerts for more details.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConflictDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for "Course full" with opt-in for alerts */}
            <Dialog open={openCourseFullDialog} onClose={handleCloseCourseFullDialog}>
                <DialogTitle>Course is currently full</DialogTitle>
                <DialogContent>
                    <Typography>This course is currently full. Would you like to receive an alert when it becomes available and add it to the wishlist?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOptInForAlerts}>Yes, notify me</Button>
                    <Button onClick={handleCloseCourseFullDialog}>No, thanks</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openCourseOptInDialog} onClose={handleCourseOptInDialog}>
                <DialogTitle>Opt In Successful!</DialogTitle>
                <DialogContent>
                    <Typography>Course added to wishlist and You have opted in to receive alerts when this course becomes available.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCourseOptInDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Wishlist Success */}
            <Dialog open={openWishlistDialog} onClose={handleCloseWishlistDialog}>
                <DialogTitle>Course added to Wishlist!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseWishlistDialog}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Already in Wishlist */}
            <Dialog open={openAlreadyInWishlist} onClose={handleCloseAlreadyInWishlist}>
                <DialogTitle>Course already in Wishlist!</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseAlreadyInWishlist}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}