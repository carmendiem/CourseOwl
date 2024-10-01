import {Card, CardHeader, CardContent, CardMedia} from "@mui/material";
import {CardActionArea, CardActions, IconButton} from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import { useState } from "react";
import { Add } from '@mui/icons-material';
import { Typography } from '@mui/material'
import config from '../config';
import axios from "axios";

export function CourseCard({user, course}) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const addCourse = async () => {
    const courseId = course._id;
    const email = user.email;
    console.log("courseId", courseId, "email", email);
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
      <>
        <Card>
          <IconButton 
            onClick={()=>{addCourse()}}
              sx={{
                  position: 'absolute',
                  right: 16,
                  color: (theme) => theme.palette.grey[500],
              }}
          >
              <Add />
          </IconButton>  
        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 18, mb: 2, textAlign:"left"}}>
           {course.course_code}
          </Typography>
          <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 2, textAlign:"left" }}>
            {/* {course.Schedule_Type} | {course.Instructors[0].name} */}
          </Typography>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Course already added!</DialogTitle>
      </Dialog>
      </>
    );
}