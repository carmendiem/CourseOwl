import {Card, CardHeader, CardContent, CardMedia} from "@mui/material";
import {CardActionArea, CardActions, IconButton} from '@mui/material';
import { Typography } from '@mui/material'

export function CourseCard({courses}) {
    console.log(courses.name + " hey ")
    return(
        <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography gutterBottom sx={{ color: 'text.primary', fontSize: 14 }}>
          </Typography>
        </CardContent>
      </Card>
    );
}