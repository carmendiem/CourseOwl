import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Close, Delete } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, IconButton } from '@mui/material';
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import config from '../config';

export function TableView({user, change}) {
    const [userCourses, setUserCourses] = useState([]);
    const [courseObjs, setCourseObjs] = useState([]);
    const [searchAlert, setSearchAlert] = useState("");
    const [enrollmentStatus, setEnrollmentStatus] = useState(null);

    const getCourses = async () => {
        const userId = user.id;
        try{
            const res = await axios.get(`${config.API_BASE_URL}/calendar/user?userId=${userId}`);
            const data = await res.data;
            setUserCourses(data);
            return data;
        }catch(error){
            console.log("error fetching courses: ", error);
            return null;
        }
    };

    const getCourseInfo = async (courses) => {
        const courseData = [];
        for (let i = 0; i < courses.length; i++) {
            try{
                const res = await axios.get(`${config.API_BASE_URL}/calendar/info?courseId=${courses[i]}`)
                const data = await res.data;
                courseData.push(data);
            }catch(error){
                console.log("error fetching course: ", error);
            }
        }
        setCourseObjs(courseData);
    };

    const getUserEnrollmentStatus = async () => {
      try {
          const res = await axios.get(`${config.API_BASE_URL}/user/verifyFull`, { withCredentials: true });
          const userData = res.data.user;
          setEnrollmentStatus(userData.enrollment_status || "full_time"); // Default to 'full_time'
      } catch (error) {
          console.log("Error fetching user enrollment status:", error);
      }
  };

    const fetchCoursesAndInfo = async () => {
      setSearchAlert("Loading courses..")
      const courses = await getCourses();
      if (courses && courses.length >= 0) 
          await getCourseInfo(courses);  
      setSearchAlert("Add a course to begin scheduling!")
    } 

    useEffect(() => {
      fetchCoursesAndInfo();
      getUserEnrollmentStatus();
  }, []);

  useEffect(() => {
      fetchCoursesAndInfo();
      getUserEnrollmentStatus();
  }, [change]);

    const [openDeleteConfPopup, setOpenDeleteConfPopup] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const handleDeleteConfirmationPopup = (course) => {
      setSelectedCourse(course);
      setOpenDeleteConfPopup(true);
    };
    const handleDeleteConfPopupClose = () => {
      setOpenDeleteConfPopup(false);
      setSelectedCourse(null);
    };
    const handleDelete = (course) => {
      deleteCourse(course._id);
      handleDeleteConfPopupClose();
  };
  const deleteCourse = async (courseId) => {
    const email = user.email;
    try {
        await axios.post(`${config.API_BASE_URL}/calendar/deleteCourse`, {email, courseId}, {withCredentials: true});
        await fetchCoursesAndInfo();
    } catch (error) {
        console.log("Error deleting course: ", error)
    }
}

const totalCreditHours = courseObjs.reduce((total, course) => total + (course.credit_hours || 0), 0);

    return (
      <>
        <TableContainer component={Paper}>
      {courseObjs.length === 0 ? (
        <p>{searchAlert}</p> 
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
  <TableRow>
    <TableCell>Course name</TableCell>
    <TableCell>Capacity</TableCell> {/* New column */}
    <TableCell>Remaining Seats</TableCell> {/* Updated column */}
    <TableCell align="right">Time</TableCell>
    <TableCell align="right">Location</TableCell>
    <TableCell align="right">Professor</TableCell>
    <TableCell align="right">Actions</TableCell> {/* For Delete button */}
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
      <TableCell>
        {course.capacity === 0 ? "Capacity Unavailable" : course.capacity}
      </TableCell> {/* Handle 0 capacity */}
      <TableCell>
        {course.capacity === 0 ? "N/A" : course.availSeats}
      </TableCell> {/* Handle N/A for remaining seats */}
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
      {/* Total Credit Hours and Time Commitment Section */}
    {courseObjs.length > 0 && (
      <div
        style={{
          marginTop: "3rem",
          textAlign: "center",
          fontSize: "1rem",
        }}
      >
        Total Credit Hours: {totalCreditHours} | Expected Weekly Time Commitment:{" "}
        {totalCreditHours * 3} hours
      </div>
    )}

    {/* Warning Message */}
    {enrollmentStatus === "full_time" && totalCreditHours < 12 && (
      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "red",
          fontWeight: "bold",
        }}
      >
        Warning: You are enrolled as a full-time student but have less than 12
        credit hours. Please add more courses to meet the minimum requirement.
      </div>
    )}

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
      </>
    );
}