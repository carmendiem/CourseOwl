import React from "react";
import { useState, useRef, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import { CourseCard } from "./CourseCard";
import config from '../config';
import axios from "axios";

const Item = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    backgroundColor: '#ffe',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    height: "100%",
    lineHeight: '50px',
  }));
const Cell = styled(Paper)(({ theme }) => ({
borderRadius: 0,
backgroundColor: '#fff',
...theme.typography.body2,
textAlign: 'center',
height: "50%", //set height 50% of parent
}));
const Course = styled(Paper)(({ theme }) => ({
textAlign: 'left',
borderRadius: 10,
position: 'absolute',
backgroundColor: 'grey',
// zIndex: 1, // Ensure it appears above the graph
width: '15%'
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

export function CalendarView({user}) {
    const daysOfWeek = ["Time","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timesOfDay = ["6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am",
        "12:00 pm", "1:00 pm","2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm"];
    const topCoord = "450px"
    const colWidth = 100/6; // 100% / 6 days
    const [calWidth, setCalWidth] = useState(0);
    const [userCourses, setUserCourses] = useState([]);
    const [courseObjs, setCourseObjs] = useState([]);

    var calGrid = [];
    for (let i = 0; i < timesOfDay.length; i++) {
        calGrid.push(
            <Grid size={2} key={`time-${i}`} 
                style={{
                    height: hourSize,
                    alignItems: 'center'
                }}
            >
                <Item>{timesOfDay[i]}</Item>
            </Grid>
        );
        for (let j = 0; j < daysOfWeek.length-1; j++) {
            calGrid.push(
                <Grid size={2} style={{height: hourSize}}>
                    {/* x:30 to y:00 */}
                    <Cell>{""}</Cell>
                    {/* y:00 to z:30 */}
                    <Cell>{""}</Cell>
                </Grid>
            );
        }
    }

    const [courseDisp, setCourseDisp] = useState(0);

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
            setUserCourses(data);
        }catch(error){
            console.log("error fetching courses: ", error);
        }
    };

    const getCourseInfo = async () => {
        console.log("userCourses: ", userCourses);
        setCourseObjs([]);
        for (let i = 0; i < userCourses.length; i++) {
            // console.log("coursenum: ", i);
            try{
                const res = await axios.get(`${config.API_BASE_URL}/calendar/info?courseId=${userCourses[i]}`)
                const data = await res.data;
                // console.log("data: ", data);
                setCourseObjs(courseObjs => [...courseObjs, data]);
                console.log("courseobj+: ", courseObjs);
            }catch(error){
                console.log("error fetching course: ", error);
            }
        }
        console.log("courseobj: ", courseObjs);
    };

    const makeCourses = () => {
        setCourseDisp([]);
        var courseDisplay = [];

        // if (courseObjs.length > 0) {
        //     const TakenTimes = setTimeTakenMaps(timesOfDay, courseObjs);
        //     console.log(TakenTimes);
        // }
        const TakenTimes = setTimeTakenMaps(timesOfDay, courseObjs);
        console.log(TakenTimes);

        for (let i = 0; i < courseObjs.length; i++) {
            const color = getColor();

            // get hour and minute from course start time
            const times = courseObjs[i].time.split(" - ");
            const startTime = times[0].trim();
            const sTimePx = getTimePos(startTime); // calculate the top position of the course
            //console.log(sTimePx);

            // calculate the height of the course: (duration in hrs * 50) round to nearest half hour
            const endTime = times[1].trim(); 
            const eTimePx = getTimePos(endTime); 
            const heightPx = eTimePx - sTimePx;

            // calculate the left position of the course: based on the day
            var leftPc = `${colWidth}%`; // 100% / 6 days

            // split days into individual days
            const days = courseObjs[i].daysOfWeek.split("");
            for (let j = 0; j < days.length; j++) {
                const timeMap = TakenTimes[DayCode.get(days[j])-1]; 
                const dayVal = DayCode.get(days[j]);   
                leftPc = `${dayVal * colWidth}%`;   

                const numCourses = timeMap.get(startTime);
                console.log("numCourses: ", numCourses);
                timeMap.set(startTime, numCourses-1);

                // shift to the left based on how many courses are already there
                var width = colWidth;
                var zIndex = 1;
                if (numCourses > 0) {
                    leftPc = `${(numCourses-1)*colWidth/2 + dayVal*colWidth}%`; // messes up the day shift
                    //console.log(leftPc);
                    width = width - (numCourses-1)*colWidth/2;
                    zIndex = numCourses;
                }
                
                courseDisplay.push(
                    <Course size={2} 
                        sx={{
                            top: `${sTimePx}px`,
                            left: leftPc,
                            zIndex: `${zIndex}`,
                            backgroundColor: color
                        }}
                        style={{
                            width: `${width}%`,
                            height: `${heightPx}px`,
                            lineHeight: `${heightPx}px`
                        }}
                    >
                        {courseObjs[i].course_name}
                    </Course>
                );
            }
        }

        setCourseDisp(courseDisplay);
        
    }

    useEffect(() => {
        // Get position after the component mounts
        setCalWidth(window.innerWidth);
        getCourses();
        // getCourseInfo();
        if (userCourses.length > 0){
            console.log("userCourses: ", userCourses);
            makeCourses();
        }
        // makeCourses();

        // Update position on window resize
        const handleResize = () => {
            setCalWidth(window.innerWidth);
            getCourses();
            // getCourseInfo();
            if (userCourses.length > 0){
                makeCourses();
            }
            // makeCourses();
        };
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        
    }, []);

    useEffect(() => {
        getCourseInfo();
    },[userCourses]);

    return (
        <div > 
            {/* {console.log(calWidth)} */}
            <Grid container sx={{ 
                width: `${calWidth-140}px`,
                position: "absolute", top: topCoord }} >
                {daysOfWeek.map((day) => (
                    <Grid size={2}>
                        <Item>{day}</Item>
                    </Grid>
                )) }
                {calGrid}
                {courseDisp}
                {/* {console.log("courses changed")} */}
            </Grid>
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
        const days = retrivedCourses[i].daysOfWeek.split("");
        const times = retrivedCourses[i].time.split(" - ");
        const startTime = times[0].trim();
        const endTime = times[1].trim(); 

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