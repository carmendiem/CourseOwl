import React from "react";
import { useState, useRef, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { CourseCard } from "./CourseCard";

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


export function CalendarView() {
    const daysOfWeek = ["Time","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timesOfDay = ["6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am",
        "12:00 pm", "1:00 pm","2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm"];
    const topCoord = "450px"
    const colWidth = 100/6; // 100% / 6 days
    // const hourSize = "50px" //hour size is 50 not 100, math must be divided by 2
    // const firstCalTime = (hourSize * 5) + (hourSize/2); //  start of cal is 5:30 am
    // const lastCalTime = 1300; // 1850 meaning 6:30 pm

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

    const gridRef = useRef(null);
    // const [gridDistFromTop, setGridDistFromTop] = useState(0);
    // const [gridDistanceFromBottom, setGridDistanceFromBottom] = useState(0);
    // const [coursePos, setCoursePos] = useState({top: '200px', left: '10px'});
    const [courseDisp, setCourseDisp] = useState(0);
    
    // const getGrid = () => {
    //     if (gridRef.current) {
    //         const rect = gridRef.current.getBoundingClientRect();

    //         setGridDistFromTop(rect.top);
    //         console.log('top:', gridDistFromTop);

    //         const gridBottom = rect.bottom;
    //         const windowHeight = window.innerHeight;
    //         const distance = windowHeight - gridBottom;
    //         setGridDistanceFromBottom(distance)
    //         console.log('bottom:', gridDistanceFromBottom);

    //         // setCoursePos({
    //         //     top: `${rect.top}px`,
    //         //     bottom: `${rect.bottom}px`,
    //         // });
    //       }
    // }

    const DayCode = new Map();
    DayCode.set("M", 1);
    DayCode.set("T", 2);
    DayCode.set("W", 3); 
    DayCode.set("R", 4);
    DayCode.set("F", 5);

    function getColor(){ 
        return "hsl(" + 360 * Math.random() + ',' +
                   (25 + 70 * Math.random()) + '%,' + 
                   (85 + 10 * Math.random()) + '%)'
    }

    const makeCourses = () => {
        setCourseDisp([]);
        var courseDisplay = [];

        const retrivedCourses = ["CS251","CS250"]; // TODO: from api

        const TakenTimes = setTimeTakenMaps(timesOfDay, retrivedCourses);

        for (let i = 0; i < retrivedCourses.length; i++) {
            const color = getColor();

            // get hour and minute from course start time
            const startTime = "8:00 am"; // TODO: from api
            const sTimePx = getTimePos(startTime); // calculate the top position of the course
            console.log(sTimePx);

            // calculate the height of the course: (duration in hrs * 50) round to nearest half hour
            const endTime = "9:45 am"; // TODO: from api
            const eTimePx = getTimePos(endTime); 
            const heightPx = eTimePx - sTimePx;

            // calculate the left position of the course: based on the day
            var leftPc = `${colWidth}%`; // 100% / 6 days

            // get day from course day(s)
            const day = "MWF"; // TODO: from api

            // split days into individual days
            const days = day.split("");
            for (let j = 0; j < days.length; j++) {
                const timeMap = TakenTimes[DayCode.get(days[j])-1]; 
                const dayVal = DayCode.get(days[j]);   
                leftPc = `${dayVal * colWidth}%`;   

                const prev = timeMap.get(startTime);
                if (prev === undefined) {
                    console.log("time not found");
                    timeMap.set(startTime, 0);
                }
                timeMap.set(startTime, prev+1);

                // shift to the left based on how many courses are already there
                var width = colWidth;
                var zIndex = 1;
                if (prev > 0) {
                    leftPc = `${(prev)*colWidth/2 + dayVal*colWidth}%`; // messes up the day shift
                    console.log(leftPc);
                    width = width - (prev)*colWidth/2;
                    zIndex = prev+1;
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
                        {retrivedCourses[i]}
                    </Course>
                );
            }
        }

        setCourseDisp(courseDisplay);
        
    }

    // const moveCourse = () => {
    //     setCoursePos({
    //         top: `${gridDistFromTop}px`,
    //         bottom: `${gridDistanceFromBottom}px`,
    //     });
    //     console.log("moved course");
    //     makeCourses();
    //     console.log("remade course");
    // }

    useEffect(() => {
        // Get position after the component mounts
        // getGrid();
        // moveCourse();
        makeCourses();

        // Update position on window resize
        const handleResize = () => {
            // getGrid();
            // moveCourse();
            makeCourses();
        };
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        
    }, []);

    // useEffect(() => {
    //     console.log("change detected");
    //     // setTimeout(() => {
    //     //     getGrid();
    //     //     console.log("paused");
    //     //     makeCourses();
    //     // }, 500); // Pause for 1 second before executing getGrid
    //     getGrid();
    //     console.log("call move course");
    //     // moveCourse();
    //     makeCourses();
    // }, [change]);

    // for each, create a card (new const instead of item/cell?) and add to array
    // can overlay on top of calander by using zIndex (elevation), calander is 0, 1, 2, 3, etc

    // data structure to remember which time slots already have smth there?

    // notes, have to fit the card to the column width wise, if multiple are same time slot... shift to the side
    // calcualte location of the slot based off of day and time?

    return (
        <div>
            <div > 
                <Box sx={{ width: '100%'}} ref={gridRef}>
                    <Grid container sx={{ width: '100%', position: "absolute", top: topCoord }} >
                        {daysOfWeek.map((day) => (
                            <Grid size={2}>
                                <Item>{day}</Item>
                            </Grid>
                        )) }
                        {calGrid}
                        {courseDisp}
                        {console.log("courses changed")}
                    </Grid>
                </Box>
            </div>
                
        </div>
    );

}

function setTimeTakenMaps(timesOfDay, retrivedCourses) {
    var TakenTimesMonday = initTimeTakenSingle(timesOfDay);
    var TakenTimesTuesday = initTimeTakenSingle(timesOfDay);
    var TakenTimesWednesday = initTimeTakenSingle(timesOfDay);
    var TakenTimesThursday = initTimeTakenSingle(timesOfDay);
    var TakenTimesFriday = initTimeTakenSingle(timesOfDay);

    // loop through all courses and count how many are in each slot
    for (let i = 0; i < retrivedCourses.length; i++) {
        // TODO
    }

    const TakenTimes = [TakenTimesMonday, TakenTimesTuesday, TakenTimesWednesday, TakenTimesThursday, TakenTimesFriday];
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
        } 
        timesTaken.set(toInsertHalfHour, 0);
        timesTaken.set(timesOfDay[i], 0);
    }
    return timesTaken;
}

function getTimePos(time) {
    const minInHour = 60;

    // get hour and minute from course start time
    const hour = parseInt(time.substring(0, time.indexOf(":")), 10);
    console.log("hour:", hour);
    const minute = parseInt(time.substring(time.indexOf(":")+1, time.indexOf(" ")), 10);
    console.log("minute:", minute);
    const amOrPm = time.substring(time.length-2);

    if (amOrPm === "pm") {
        hour += 12;
    }

    var timePx = (hour * hourSizePx) + (minute/minInHour * hourSizePx);
    console.log("getTime: ", timePx);
    timePx = timePx - firstCalTime;
    console.log("getTime: ", timePx);
    return timePx;

}