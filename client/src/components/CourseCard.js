// // import { Card, CardHeader, CardContent, CardActionArea, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
// // import { Add } from '@mui/icons-material';
// // import { useState } from "react";
// // import { Typography } from '@mui/material';
// // import config from '../config';
// // import axios from "axios";
// // import { Link } from 'react-router-dom';

// // export function CourseCard({ user, course, onChange }) {
// //     const [openAlreadyAdded, setOpenAlreadyAdded] = useState(false);
// //     const [openCourseAdded, setOpenCourseAdded] = useState(false);

// //     const handleCloseAlreadyAdded = () => {
// //         setOpenAlreadyAdded(false);
// //     };

// //     const handleCloseCourseAdded = () => {
// //         setOpenCourseAdded(false);
// //     };

// //     const addCourse = async (event) => {
// //         onChange(!onChange);
// //         event.preventDefault(); 
// //         const courseId = course._id;
// //         const email = user.email;
// //         try {
// //             const res = await axios.post(`${config.API_BASE_URL}/calendar/addCourse`, { email, courseId }, { withCredentials: true });
// //             console.log("Course added: ", res.data);
// //             if (res.data.status === 'Course already added') {
// //                 setOpenAlreadyAdded(true);
// //             } else {
// //                 setOpenCourseAdded(true); // Open success dialog when the course is added successfully
// //             }
// //         } catch (error) {
// //             console.log("Error adding course: ", error);
// //         }
// //     };

// //     return (
// //         <div style={{ minWidth: "300px" }}>
// //             <Card sx={{ position: 'relative' }}>
// //                 <CardActionArea component={Link} to={`/course/${course.course_code}`}>
// //                     <IconButton 
// //                         onClick={(event) => addCourse(event)} 
// //                         sx={{
// //                             position: 'absolute',
// //                             right: 16,
// //                             color: (theme) => theme.palette.grey[500],
// //                         }}
// //                     >
// //                         <Add />
// //                     </IconButton>
// //                     <CardContent>
// //                         <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 18, mb: 1, textAlign: "left" }}>
// //                             {course.course_code}
// //                         </Typography>
// //                         <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
// //                             {course.credit_hours} Credits | {course.Instructors.map((instructor, index) => (
// //                                 <span key={index}>
// //                                     {instructor.name === "TBA" ? (
// //                                         "TBA"
// //                                     ) : (
// //                                         <>
// //                                             <Link to={`/professor/${instructor.alias}`}>{instructor.name}</Link>
// //                                             {index < course.Instructors.length - 1 ? ', ' : ''}
// //                                         </>
// //                                     )}
// //                                 </span>
// //                             ))}
// //                         </Typography>
// //                         <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
// //                             {course['Schedule Type']} | {course.Days ? course.Days : "N/A"} | {course.Time ? course.Time : "N/A"}
// //                         </Typography>
// //                         <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
// //                             {course.Where}
// //                         </Typography>
// //                     </CardContent>
// //                 </CardActionArea>
// //             </Card>

// //             {/* Dialog for "Course already added" */}
// //             <Dialog open={openAlreadyAdded} onClose={handleCloseAlreadyAdded}>
// //                 <DialogTitle>Course already added!</DialogTitle>
// //                 <DialogActions>
// //                     <Button onClick={handleCloseAlreadyAdded}>Close</Button>
// //                 </DialogActions>
// //             </Dialog>

// //             {/* Dialog for "Course added successfully" */}
// //             <Dialog open={openCourseAdded} onClose={handleCloseCourseAdded}>
// //                 <DialogTitle>Course added to preference!</DialogTitle>
// //                 <DialogActions>
// //                     <Button onClick={handleCloseCourseAdded}>Close</Button>
// //                 </DialogActions>
// //             </Dialog>
// //         </div>
// //     );
// // }

import { Card, CardContent, CardActionArea, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useState } from "react";
import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import config from '../config';
import axios from "axios";

export function CourseCard({ user, course, onChange }) {
    const [openAlreadyAdded, setOpenAlreadyAdded] = useState(false);
    const [openCourseAdded, setOpenCourseAdded] = useState(false);
    const [openConflictDialog, setOpenConflictDialog] = useState(false);

    const handleCloseAlreadyAdded = () => setOpenAlreadyAdded(false);
    const handleCloseCourseAdded = () => setOpenCourseAdded(false);
    const handleCloseConflictDialog = () => setOpenConflictDialog(false);

    const addCourse = async (event) => {
        event.preventDefault();
        const courseId = course._id;
        const email = user.email;

        try {
            const res = await axios.post(`${config.API_BASE_URL}/calendar/addCourse`, { email, courseId }, { withCredentials: true });
            
            if (res.data.status === "Course already added") {
                setOpenAlreadyAdded(true);
            } else if (res.data.timeConflict) {
                // Show only the conflict dialog if a time conflict was detected
                setOpenConflictDialog(true);
                // setConflictCourses(res.data.conflictingCourses);
                onChange(!onChange); // Trigger to update the course list
            } else {
                // No conflict, show "Course added" success dialog
                setOpenCourseAdded(true);
                onChange(!onChange); // Trigger to update the course list
            }
        } catch (error) {
            console.log("Error adding course: ", error);
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
                            right: 16,
                            color: (theme) => theme.palette.grey[500],
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
                    </CardContent>
                </CardActionArea>
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
        </div>
    );
}