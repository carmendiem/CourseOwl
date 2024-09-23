import React from "react";
import { useState, useRef, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

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
textAlign: 'center',
borderRadius: 10,
position: 'absolute',
backgroundColor: 'grey',
// zIndex: 1, // Ensure it appears above the graph
width: '15%'
}));


export function CalendarView({change}) {
    const daysOfWeek = ["Time","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timesOfDay = ["6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am",
        "12:00 pm", "1:00 pm","2:00 pm", "3:00pm", "4:00 pm", "5:00 pm", "6:00 pm"];
    const daysInAWeek = 5;
    const topCoord = "450px"
    const hourSize = "50px" //hour size is 50 not 100, math must be divided by 2
    // const firstCalTime = 550; // 550 meaning 5:30 am
    // const lastCalTime = 1850; // 1850 meaning 6:30 pm

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
        for (let j = 0; j < daysInAWeek; j++) {
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
    const [gridDistFromTop, setGridDistFromTop] = useState(0);
    const [gridDistanceFromBottom, setGridDistanceFromBottom] = useState(0);
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
    DayCode.set("R", 4);    // Thursday code change
    DayCode.set("F", 5);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const makeCourses = () => {
        setCourseDisp([]);
        var courseDisplay = [];

        const retrivedCourses = ["CS251","CS250", ]; //api call to get courses

        const TakenTimes = setTimeTakenMaps(timesOfDay, retrivedCourses);

        for (let i = 0; i < retrivedCourses.length; i++) {
            const color = getRandomColor();

            // get hour and minute from course start time
            const time = "8:00 am";
            const timePx = 75;
            // get day from course day(s)
            const day = "MWF"; // change

            // get duration of course
            const heightPx = 150;
            // calculate the height of the course: (duration in hrs * 50) round to nearest half hour
            // calculate the top position of the course
            // calculate the left position of the course: based on the day
            var leftPc = '16.66%'; // 100% / 6 days

            // split days into individual days
            const days = day.split("");
            console.log(days);
            for (let j = 0; j < days.length; j++) {
                const timeMap = TakenTimes[DayCode.get(days[j])-1]; 
                const dayVal = DayCode.get(days[j]);   
                leftPc = `${dayVal * 16.66}%`;

                console.log("day:", days[j]);      

                console.log("timeMap:", timeMap);
                const prev = timeMap.get(time);
                if (prev === undefined) {
                    console.log("time not found");
                    timeMap.set(time, 0);
                }
                console.log("prev:", prev);
                timeMap.set(time, prev+1);

                // shift to the left based on how many courses are already there
                var width = 100 / 6;
                var zIndex = 1;
                if (prev > 0) {
                    leftPc = `${(prev)*4 + dayVal*16.66}%`; // messes up the day shift
                    console.log(leftPc);
                    width = width - (prev)*4;
                    zIndex = prev+1;
                }
                
                courseDisplay.push(
                    <Course size={2} 
                        sx={{
                            top: `${timePx}px`,
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
    var TakenTimesMonday = setTimeTakenSingle(timesOfDay);
    var TakenTimesTuesday = setTimeTakenSingle(timesOfDay);
    var TakenTimesWednesday = setTimeTakenSingle(timesOfDay);
    var TakenTimesThursday = setTimeTakenSingle(timesOfDay);
    var TakenTimesFriday = setTimeTakenSingle(timesOfDay);

    // loop through all courses and count how many are in each slot


    const TakenTimes = [TakenTimesMonday, TakenTimesTuesday, TakenTimesWednesday, TakenTimesThursday, TakenTimesFriday];
    return TakenTimes;
}

function setTimeTakenSingle(timesOfDay) {
    var timesTaken = new Map();
    // insert all times into map with 15 min
    timesTaken.set("5:30 am", 0);
    for (let i = 0; i < timesOfDay.length; i++) {
        // insert all times into map with 15 min intervals
        timesTaken.set(timesOfDay[i], 0);
    }

    // loop through all courses and count how many are in each slot

    return timesTaken;
}