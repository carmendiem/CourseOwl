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
import config from '../config';

export function TableView({user}) {
    const [userCourses, setUserCourses] = useState([]);
    const [courseObjs, setCourseObjs] = useState([]);

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

    const fetchCoursesAndInfo = async () => {
      const courses = await getCourses();
      if (courses && courses.length >= 0) 
          await getCourseInfo(courses);  
    } 

    useEffect(() => {
        fetchCoursesAndInfo();
    }, [])

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


    return (
      <>
        <TableContainer component={Paper}>
      {courseObjs.length === 0 ? (
        <p>Loading courses...</p> // Optional: show a loading message
      ) : (
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Course name</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Professor</TableCell>
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
                <TableCell align="right">{course.availability || 'N/A'}</TableCell>
                <TableCell align="right">{course.Time || 'N/A'}</TableCell>
                <TableCell align="right">{course.Where || 'N/A'}</TableCell>
                <TableCell align="right">{course.professor || 'N/A'}</TableCell>
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