import React from "react";
import { useState, useRef, useEffect } from "react";
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { Button } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    borderRadius: 0,
    backgroundColor: '#ffe',
    ...theme.typography.body2,
    padding: theme.spacing(0),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
    // ...theme.applyStyles('dark', {
    //   backgroundColor: '#1A2027',
    // }),
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
    // top: '55%', // Adjust as needed
    // left: '17.5%', // horizontally
    // transform: 'translate(0, -50%)', // Center the element
    backgroundColor: 'grey',
    zIndex: 1, // Ensure it appears above the graph
    height: "50px",
    lineHeight: '50px',
    width: '16%'
  }));


export function CalendarView() {
    const daysOfWeek = ["Time","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const timesOfDay = ["6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am",
        "12:00 pm", "1:00 pm","2:00 pm", "3:00pm", "4:00 pm", "5:00 pm", "6:00 pm"];
    const daysInAWeek = 5;
    const hourSize = "50px" //hour size is 50 not 100, math must be divided by 2
    const firstCalTime = 550; // 550 meaning 5:30 am
    const lastCalTime = 1850; // 1850 meaning 6:30 pm
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
    
    const getGridTopPos = () => {
        if (gridRef.current) {
            const rect = gridRef.current.getBoundingClientRect();
            console.log('Top position of the grid:', rect.top);
            setGridDistFromTop(rect.top)
            // You can also use rect.bottom, rect.left, rect.right if needed
          }
    }

    const getDistFromBottom = () => {
        if (gridRef.current) {
            const rect = gridRef.current.getBoundingClientRect();
            const gridBottom = rect.bottom;
            const windowHeight = window.innerHeight;
            const distance = windowHeight - gridBottom;
            setGridDistanceFromBottom(distance)

            console.log('distancefrombottom:', distance);
          }
    }
    

    const [coursePos, setCoursePos] = useState({top: '0px', bottom: '0px', left: '0px'});

    const [courseDisp, setCourseDisp] = useState(0);
    const makeCourses = () => {
        var courseDisplay = [];
        const diff = 300;
        const diff2 = 450;
        const og = parseFloat(coursePos.top, 10);
        courseDisplay.push(
            <Course sx={{top: `${og + diff}px`, left: coursePos.left}}>Overlapping</Course>
        );
        courseDisplay.push(
            <Course size={2} sx={{height: hourSize, top: `${og + diff2}px`, left: coursePos.left}}>Overlapping</Course>
        );
        setCourseDisp(courseDisplay);
        console.log("course arr edited");
    }

    const moveCourse = () => {
        setCoursePos({
            top: `${gridDistFromTop}px`,
            bottom: `${gridDistanceFromBottom}px`,
            // left: prevPos.left === '0px' ? '100px' : '0px',
        })
        makeCourses();

      console.log("course: ", coursePos.top);
    }

    useEffect(() => {
        // Get position after the component mounts
        getGridTopPos();
        getDistFromBottom();
        moveCourse();
        // makeCourses();
        // Update position on window resize
        const handleResize = () => {
            getGridTopPos();
            getDistFromBottom();
            moveCourse();
            // makeCourses();
        };
        window.addEventListener('resize', handleResize);

        // Clean up the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
        
      }, []);

    // call for 'added' courses of users
    // count how many courses added and loop
    // for each, create a card (new const instead of item/cell?) and add to array
    // can overlay on top of calander by using zIndex (elevation), calander is 0, 1, 2, 3, etc

    // data structure to remember which time slots already have smth there?

    // notes, have to fit the card to the column width wise, if multiple are same time slot... shift to the side
    // calcualte location of the slot based off of day and time?

    var courseDisplay = [];

    // Combined function for events
    const handleEvent = (event) => {
        if (event.type === 'click') {
        moveCourse(); 
        }
    };

    return (
        <div>
            <div > 
                <Box sx={{ width: '100%', bottom:0}}>
                    <Grid container sx={{ width: '100%' }} ref={gridRef} 
                    >
                        {daysOfWeek.map((day, i) => (
                            <Grid size={2}>
                                <Item>{day}</Item>
                            </Grid>
                        )) }
                        {calGrid}
                        {courseDisp}
                        {console.log("courses changed")}
                    </Grid>
                    {/* <Box sx={{ height: '50px'}}></Box> */}
                </Box>
            </div>
                
        </div>
        
    );

}