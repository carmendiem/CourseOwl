import {Card, CardHeader, CardContent, CardMedia} from "@mui/material";
import {CardActionArea, CardActions, IconButton} from '@mui/material';
import { Typography } from '@mui/material'

export function CalCourseCard({course, style, sx, size, onClick}) {

    // const courseString = course.course_name.split("-");
    // const courseName = courseString[0].trim();
    // const courseNum = courseString[1].trim();
    const courseCode = course.course_code;
    return(
        <Card
            size={size}
            sx={{
                position: sx.position,
                top: sx.top,
                left: sx.left,
                zIndex: sx.zIndex,
                backgroundColor: sx.backgroundColor,
                borderRadius: 2,
                border: '1px solid gray',
            }} 
            style={{
                width: style.width,
                height: style.height,
            }}
        >
            <CardActionArea onClick={onClick}>
                <CardContent sx={{height: style.height, width: '100%', padding: 1, alignContent: 'center'}}>
                    <Typography sx={{ color: 'text.primary', fontSize: 14, mb: 2, textAlign: 'left', paddingleft: '10%'}}>
                        {courseCode}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>

    );
}