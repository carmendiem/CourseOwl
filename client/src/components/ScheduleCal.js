import React from "react";
import { useState, useRef, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Icon } from '@mui/material';
import { IconButton } from '@mui/material';
import { BorderRight, Close, Delete } from '@mui/icons-material';
import { CalCourseCard } from "./CalCourseCard";
import config from '../config';
import axios from "axios";

// colors
const gold = "#daaa00";
const light_yellow = "#F0DE89";

const Item = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    bordercolor: 'transparent',
    backgroundColor: light_yellow,
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    height: "100%",
    lineHeight: '50px',
    boxShadow: 'none',
}));
const Cell = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    backgroundColor: '#fff',
    ...theme.typography.body2,
    textAlign: 'center',
    height: "50%", //set height 50% of parent
    boxShadow: 'none',
}));

const hourSize = "50px" //hour size is 50 not 100, math must be divided by 2
const hourSizePx = 50;
const firstCalTime = (hourSizePx * 5) + (hourSizePx/2) - hourSizePx; //  start of cal is 5:30 am

const DayCode = new Map();
DayCode.set("M", 1);
DayCode.set("T", 2);
DayCode.set("W", 3); 
DayCode.set("R", 4);
DayCode.set("F", 5);

export function CalendarView({user, change}) {
    const daysOfWeek = [" ","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timesOfDay = ["6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am",
        "12:00 pm", "1:00 pm","2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm", "7:00 pm", "8:00pm", "9:00 pm"];
    const colWidth = 100/6; // 100% / 6 days
    const [calWidth, setCalWidth] = useState(0);
    const [courseObjs, setCourseObjs] = useState([]);

    var calGrid = [];
    for (let i = 0; i < timesOfDay.length; i++) {
        calGrid.push(
            <Grid size={2} key={`time-${i}`} 
                style={{
                    height: hourSize,
                    alignItems: 'center',
                    borderColor: 'transparent'
                }}
            >
                <Item>{timesOfDay[i]}</Item>
            </Grid>
        );
        for (let j = 0; j < daysOfWeek.length-1; j++) {
            calGrid.push(
                <Grid size={2} style={{height: hourSize, borderRight: '1px solid lightgray' }}>
                    {/* x:30 to y:00 */}
                    <Cell sx={{borderBottom: '1px solid lightgray' }}>{""}</Cell>
                    {/* y:00 to z:30 */}
                    <Cell>{""}</Cell>
                </Grid>
            );
        }
    }

    const [courseDisp, setCourseDisp] = useState([]);

    function getColor(){ 
        return "hsl(" + 360 * Math.random() + ',' +
                   (25 + 70 * Math.random()) + '%,' + 
                   (85 + 10 * Math.random()) + '%)'
    }

    // get courses from user
    const getCourses = async () => {
        const userId = user.id;
        try{
            const res = await axios.get(`${config.API_BASE_URL}/calendar/user?userId=${userId}`);
            const data = await res.data;
            // setUserCourses(data);
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
        console.log("courseData: ", courseData);
    };

    const refreshCourses = async () => {
        const courses = await getCourses();
        if (courses && courses.length >= 0) {
            await getCourseInfo(courses);
        }
    }

    const deleteCourse = async (courseId) => {
        const email = user.email;
        try {
            await axios.post(`${config.API_BASE_URL}/calendar/deleteCourse`, {email, courseId}, {withCredentials: true});
            await refreshCourses();
        } catch (error) {
            console.log("Error deleting course: ", error)
        }
    }

    const makeCourses = () => {
        setCourseDisp([]);
        var courseDisplay = [];

        const TakenTimes = setTimeTakenMaps(timesOfDay, courseObjs);

        for (let i = 0; i < courseObjs.length; i++) {
            const color = getColor();

            const timesOg = courseObjs[i].Time;
            var startTime = "";
            var endTime = "";
            if (timesOg == null || timesOg === "TBA") {
                continue;
            } else {
                const times = timesOg.split(" - ");
                startTime = times[0].trim();
                endTime = times[1].trim(); 
            }

            // get hour and minute from course start time
            const sTimePx = getTimePos(startTime); // calculate the top position of the course

            // calculate the height of the course: (duration in hrs * 50) round to nearest half hour
            const eTimePx = getTimePos(endTime); 
            const heightPx = eTimePx - sTimePx;

            // calculate the left position of the course: based on the day
            var leftPc = `${colWidth}%`; // 100% / 6 days

            // split days into individual days
            const daysOg = courseObjs[i].Days;
            var days =[];
            if (daysOg == null || daysOg.length === 0) {
                continue;
            } else {
                const daysplit = daysOg.split("");
                days = daysplit;
            }

            for (let j = 0; j < days.length; j++) {
                const timeMap = TakenTimes[DayCode.get(days[j])-1]; 
                const dayVal = DayCode.get(days[j]);   
                leftPc = `${dayVal * colWidth}%`;   

                const numCourses = timeMap.get(startTime);
                timeMap.set(startTime, numCourses-1);

                // shift to the left based on how many courses are already there
                var width = colWidth;
                var zIndex = 1;
                if (numCourses < 3) {
                    leftPc = `${(numCourses-1)*colWidth/2 + dayVal*colWidth}%`; // messes up the day shift

                    width = width - (numCourses-1)*colWidth/2;
                    zIndex = numCourses;
                }
                
                courseDisplay.push(
                    <CalCourseCard 
                        size={2} 
                        sx={{
                            position: "absolute",
                            top: `${sTimePx}px`,
                            left: leftPc,
                            zIndex: `${zIndex}`,
                            backgroundColor: color
                        }}
                        style={{
                            width: `${width-0.25}%`,
                            height: `${heightPx}px`,
                            lineHeight: `${heightPx}px`
                        }}
                        course={courseObjs[i]}
                        onClick={() => handleCardClick(courseObjs[i])}
                    />
                );
            }
        }

        setCourseDisp(courseDisplay);
        
    }

    useEffect(() => {
        const fetchCoursesAndInfo = async () => {
            const courses = await getCourses();
            if (courses && courses.length > 0) 
                await getCourseInfo(courses);  
        }
        
        fetchCoursesAndInfo();
    }, [])

    useEffect(() => {
        if (courseObjs.length >= 0) {
            makeCourses(); 
        }
    }, [courseObjs])

    useEffect(() => {
        const fetchCoursesAndInfo = async () => {
           await refreshCourses(); //idk why it needs to be called twice
           await refreshCourses();
        }
        console.log("Changed: ", change);
        fetchCoursesAndInfo();
    }, [change]);



    useEffect(() => {
        // Get position after the component mounts
        setCalWidth(window.innerWidth);

        // Update position on window resize
        const handleResize = () => {
            setCalWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        
    }, []);

    const [open, setOpen] = useState(false);
    const [openDeleteConfPopup, setOpenDeleteConfPopup] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);

    const handleCardClick = (course) => {
        setSelectedCourse(course);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedCourse(null);
    };

    const handleDeleteConfirmationPopup = () => {
        setOpenDeleteConfPopup(true);
    };

    const handleDeleteConfPopupClose = () => {
        setOpenDeleteConfPopup(false);
        setSelectedCourse(null);
        handleClose();
    };

    const handleDelete = (course) => {
        deleteCourse(course._id);
        handleDeleteConfPopupClose();
        handleClose();
    };

    return (
        <div > 
            <Grid container 
                sx={{ 
                    width: `${calWidth-160}px`,
                    position: "absolute", 
                    borderRadius: 5, overflow: "hidden",
                    outline: `3px solid ${gold}`,
                }} 
            >
                {daysOfWeek.map((day) => (
                    <Grid size={2}>
                        <Item>{day}</Item>
                    </Grid>
                )) }
                {calGrid}
                {courseDisp}
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                {selectedCourse ? (
                    <>
                    <DialogTitle>{`${selectedCourse.course_name || 'not found'}`}</DialogTitle>
                    <IconButton onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <Close />
                    </IconButton>    
                    <DialogContent>
                            <div>
                                {console.log("selectedCourse: ", selectedCourse)}
                                <Typography variant="h6">{`Professor: ${selectedCourse.professor}`}</Typography>
                                <Typography variant="h6">{`${selectedCourse.Days || 'Days not Available'} ${selectedCourse.Date_Range || 'Date not available'}`}</Typography>
                                <Typography variant="h6">{selectedCourse.Time}</Typography>
                                <Typography variant="h6">{`Location: ${selectedCourse.Where}`}</Typography>
                                <Typography variant="h6">{`Type: ${selectedCourse.Schedule_Type} | Credit Hours: ${selectedCourse.credit_hours}`}</Typography>
                            </div>
                    </DialogContent>
                    <IconButton onClick={handleDeleteConfirmationPopup} color="secondary"
                        sx={{paddingBottom: 2, paddingLeft: 2, paddingRight: 2}}
                    >
                            Remove Course
                            <Delete />
                        </IconButton>
                    </>
                ) : null}
            </Dialog>
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
        </div>
    );

}

function setTimeTakenMaps(timesOfDay, retrivedCourses) {
    var TakenTimesMonday = initTimeTakenSingle(timesOfDay);
    var TakenTimesTuesday = initTimeTakenSingle(timesOfDay);
    var TakenTimesWednesday = initTimeTakenSingle(timesOfDay);
    var TakenTimesThursday = initTimeTakenSingle(timesOfDay);
    var TakenTimesFriday = initTimeTakenSingle(timesOfDay); 
    var TakenTimes = [TakenTimesMonday, TakenTimesTuesday, TakenTimesWednesday, TakenTimesThursday, TakenTimesFriday];

    // loop through all courses and count how many are in each slot
    for (let i = 0; i < retrivedCourses.length; i++) {
        // TODO
        const daysOg = retrivedCourses[i].Days;
        var days = [];
        if (daysOg == null || daysOg.length === 0) {
            continue;
        } else {
            days = daysOg.split("");
        }
        const timesOg = retrivedCourses[i].Time;
        var startTime = "";
        var endTime = "";
        if (timesOg == null || timesOg === "TBA") {
            continue;
        } else {
            const times = timesOg.split(" - ");
            startTime = times[0].trim();
            endTime = times[1].trim(); 
        }
        // const times = retrivedCourses[i].time.split(" - ");
        // const startTime = times[0].trim();
        // const endTime = times[1].trim(); 

        for (let j = 0; j < days.length; j++) { // for each day
            const day = days[j];
            var timeMap = TakenTimes[DayCode.get(day)-1];

            // count how many half hours are in range
            const startpx = getTimePos(startTime) + firstCalTime;
            const endpx = getTimePos(endTime) + firstCalTime;
            for (let k = startpx; k < endpx; k+=hourSizePx/2) {
                const timestring = getTimeString(k);
                const prev = timeMap.get(timestring);
                timeMap.set(timestring, prev+1);
            }
        }

    }

    // const TakenTimes = [TakenTimesMonday, TakenTimesTuesday, TakenTimesWednesday, TakenTimesThursday, TakenTimesFriday];
    return TakenTimes;
}

function initTimeTakenSingle(timesOfDay) {
    var timesTaken = new Map();
    // insert all times into map with 30 min intervals
    for (let i = 0; i < timesOfDay.length; i++) {
        const time = timesOfDay[i];
        const amOrPm = time.substring(time.length-2);
        const hour = time.substring(0, time.indexOf(":"));
        var toInsertHalfHour = `${hour-1}:30 ${amOrPm}`;
        if (hour === "1") {
            toInsertHalfHour = `12:30 ${amOrPm}`; // special case because of change from 12 to 1
        } else if (hour === "12") {
            toInsertHalfHour = `11:30 am`; // special case because of change from 12 to 1
        }
        timesTaken.set(toInsertHalfHour, 0);
        timesTaken.set(timesOfDay[i], 0);
    }
    return timesTaken;
}

function getTimePos(time) {
    const minInHour = 60;

    // get hour and minute from course start time
    var hour = parseInt(time.substring(0, time.indexOf(":")), 10);
    // console.log("hour:", hour);
    const minute = parseInt(time.substring(time.indexOf(":")+1, time.indexOf(" ")), 10);
    //console.log("minute:", minute);
    const amOrPm = time.substring(time.length-2);

    if (amOrPm === "pm" && hour !== 12) {
        hour += 12;
    }

    var timePx = (hour * hourSizePx) + (minute/minInHour * hourSizePx);
    // console.log("getTime: ", timePx);
    timePx = timePx - firstCalTime;
    // console.log("getTime: ", timePx);
    return timePx;

}

function getTimeString(timepos) {
    const minInHour = 60;
    var hour = Math.floor(timepos/hourSizePx);
    var minute = (timepos % hourSizePx) * minInHour/hourSizePx;
    minute = minute.toString().padStart(2, '0');
    var amOrPm = "am";
    if (hour >= 12) {
        amOrPm = "pm";
    }
    if (hour > 12) {
        hour = hour - 12;
    }
    return `${hour}:${minute} ${amOrPm}`;
}