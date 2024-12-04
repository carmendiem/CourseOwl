import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Delete, Add } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogActions,DialogContent, Button, IconButton } from '@mui/material';
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import config from '../config';

export function WishlistView({ user, change }) {
    const [userCourses, setUserCourses] = useState([]);
    const [courseObjs, setCourseObjs] = useState([]);
    const [searchAlert, setSearchAlert] = useState("");
    const [openDeleteConfPopup, setOpenDeleteConfPopup] = useState(false); // Add this line
    const [openAddConfPopup, setOpenAddConfPopup] = useState(false); // For add confirmation dialog
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseFullDialog, setCourseFullDialog] = useState(false); // State for the "course full" dialog


    const getCourses = async () => {
        const userId = user.id;
        try {
            const res = await axios.get(`${config.API_BASE_URL}/calendar/userW?userId=${userId}`);
            const data = await res.data;
            setUserCourses(data);
            return data;
        } catch (error) {
            console.log("error fetching courses: ", error);
            return null;
        }
    };

    const handleAdd = (course) => {
        if (course.availSeats === 0) {
            // Show an error dialog if the course is full
            setSelectedCourse(course);
            setCourseFullDialog(true);
        } else {
            addCourse(course._id);
            handleAddConfPopupClose();
        }
    };

    const getCourseInfo = async (courses) => {
        const courseData = [];
        for (let i = 0; i < courses.length; i++) {
            try {
                const res = await axios.get(`${config.API_BASE_URL}/calendar/info?courseId=${courses[i]}`);
                const data = await res.data;
                courseData.push(data);
            } catch (error) {
                console.log("error fetching course: ", error);
            }
        }
        setCourseObjs(courseData);
    };

    const fetchCoursesAndInfo = async () => {
        setSearchAlert("Loading courses...");
        const courses = await getCourses();
        if (courses && courses.length >= 0) 
            await getCourseInfo(courses);
        setSearchAlert("   No courses in the Wishlist!");
    };

    useEffect(() => {
        fetchCoursesAndInfo();
    }, []);

    useEffect(() => {
        fetchCoursesAndInfo();
    }, [change]);

    const handleDeleteConfirmationPopup = (course) => {
        setSelectedCourse(course);
        setOpenDeleteConfPopup(true);
    };

    const handleAddConfirmationPopup = (course) => {
        setSelectedCourse(course);
        setOpenAddConfPopup(true);
    };

    const handleDeleteConfPopupClose = () => {
        setOpenDeleteConfPopup(false);
        setSelectedCourse(null);
    };

    const handleAddConfPopupClose = () => {
        setOpenAddConfPopup(false);
        setSelectedCourse(null);
    };

    const handleDelete = (course) => {
        deleteCourse(course._id);
        handleDeleteConfPopupClose();
    };

    const handleCourseFullDialogClose = () => {
        setCourseFullDialog(false);
        setSelectedCourse(null);
    };

    const deleteCourse = async (courseId) => {
        const email = user.email;
        try {
            await axios.post(`${config.API_BASE_URL}/calendar/deleteCourseW`, { email, courseId }, { withCredentials: true });
            await fetchCoursesAndInfo();
        } catch (error) {
            console.log("Error deleting course: ", error);
        }
    };

    const addCourse = async (courseId) => {
        const email = user.email;
        try {
            await axios.post(`${config.API_BASE_URL}/calendar/addCourse`, { email, courseId }, { withCredentials: true });
            await fetchCoursesAndInfo();
        } catch (error) {
            console.log("Error adding course: ", error);
        }
    };

    return (
        <>
            <TableContainer component={Paper}>
                {courseObjs.length === 0 ? (
                    <p>{searchAlert}</p>
                ) : (
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Availability</TableCell>
                                <TableCell align="right">Time</TableCell>
                                <TableCell align="right">Location</TableCell>
                                <TableCell align="right">Professor</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {courseObjs.map((course) => (
                                <TableRow
                                    key={course.courseId}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {course.course_name}
                                    </TableCell>
                                    <TableCell align="left">
                                        {course.availSeats !== undefined && course.availSeats !== null ? (
                                            <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                                                <span style={{ color: course.availSeats > 0 ? 'green' : 'red' }}>
                                                    {course.availSeats > 0 ? 'Open for Enrollment' : 'Full'}
                                                </span>
                                                <br />
                                                <span style={{ color: 'gray' }}>
                                                    ({course.availSeats} seats available)
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ color: 'gray', fontWeight: 'bold' }}>N/A</span>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">{course.Time || 'N/A'}</TableCell>
                                    <TableCell align="right">{course.Where || 'N/A'}</TableCell>
                                    <TableCell align="right">
                                        {course.Instructors.map((instructor, index) => (
                                            <span key={index}>
                                                {instructor.name === "TBA" ? (
                                                    "TBA"
                                                ) : (
                                                    <>
                                                        <Link to={`/professor/${instructor.alias}`}>{instructor.name}</Link>
                                                        {index < course.Instructors.length - 1 ? ', ' : ''}
                                                    </>
                                                )}
                                            </span>
                                        ))}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleAddConfirmationPopup(course)}>
                                            <Add />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteConfirmationPopup(course)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <Dialog open={openDeleteConfPopup} onClose={handleDeleteConfPopupClose}>
                {selectedCourse ? (
                    <>
                        <DialogTitle>{`Confirm Removal of ${selectedCourse.course_name || 'not found'}`}</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => handleDelete(selectedCourse)} color="secondary">Remove</Button>
                            <Button onClick={handleDeleteConfPopupClose}>Cancel</Button>
                        </DialogActions>
                    </>
                ) : null}
            </Dialog>
            <Dialog open={openAddConfPopup} onClose={handleAddConfPopupClose}>
                {selectedCourse ? (
                    <>
                        <DialogTitle>{`Confirm Addition of ${selectedCourse.course_name || 'not found'}`}</DialogTitle>
                        <DialogActions>
                            <Button onClick={() => handleAdd(selectedCourse)} color="primary">Add</Button>
                            <Button onClick={handleAddConfPopupClose}>Cancel</Button>
                        </DialogActions>
                    </>
                ) : null}
            </Dialog>
            {/* Dialog for "Course Full" */}
            <Dialog open={courseFullDialog} onClose={handleCourseFullDialogClose}>
                <DialogTitle>Cannot Add Course</DialogTitle>
                <DialogContent>
                    <p>{`The course "${selectedCourse?.course_name}" is full and cannot be added.`}</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCourseFullDialogClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
