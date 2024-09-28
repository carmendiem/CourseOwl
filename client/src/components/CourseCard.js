import {Card, CardHeader, CardContent, CardMedia} from "@mui/material";
import {CardActionArea, CardActions, IconButton} from '@mui/material';
import { Typography } from '@mui/material'

export function CourseCard({course}) {
    return(
        <Card>
        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 18, mb: 2, textAlign:"left"}}>
           {course.course_name}
          </Typography>
          <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14, mb: 2, textAlign:"left" }}>
           {course.credit} Credits | {course.professor}
          </Typography>
        </CardContent>
      </Card>
    );
}