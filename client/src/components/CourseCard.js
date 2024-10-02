import {Card, CardHeader, CardContent, CardMedia} from "@mui/material";
import {CardActionArea, CardActions, IconButton} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import { useState } from "react";
import { Add } from '@mui/icons-material';
import { Typography } from '@mui/material'
import config from '../config';
import axios from "axios";
import { Link } from 'react-router-dom'

export function CourseCard({user, course, onChange}) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const addCourse = async (event) => {
    onChange(!onChange);
    event.preventDefault(); 
    const courseId = course._id;
    const email = user.email;
    // console.log("courseId", courseId, "email", email);
    try {
      const res = await axios.post(`${config.API_BASE_URL}/calendar/addCourse`, {email, courseId}, {withCredentials: true});
      console.log("Course added: ", res.data);
      if (res.data.status === 'Course already added') {
        setOpen(true);
      }
      // await refreshCourses();
    } catch (error) {
        console.log("Error adding course: ", error)
    }
}

    return(
      <div style={{minWidth: "300px"}}>
        <Card sx={{ position: 'relative'}}>
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
                  <Link to={`/professor/${instructor.alias}`}>{instructor.name}</Link>
                  {index < course.Instructors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
              {course['Schedule Type']} | {course.Days ? course.Days : "N/A"} | {course.Time ? course.Time : "N/A"}
            </Typography>
            <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 1, textAlign: "left" }}>
              {course.Where}
            </Typography>
          </CardContent>
          </CardActionArea>
        </Card>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Course already added!</DialogTitle>
        </Dialog>
      </div>
    );
}