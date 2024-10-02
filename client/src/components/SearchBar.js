import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import "./SearchBar.css";
import DayPicker from "./Daypicker/DayPicker.js"
import { SwiperComponent } from "./Swiper/Swiper";
import { CourseCard } from "./CourseCard";
import config from '../config';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

async function fetchCourses(searchTerm, selectedDays, startTime, endTime) {
    const daysParam = selectedDays && selectedDays.length > 0 ? selectedDays.join(',') : '';

    try {
        const res = await fetch(`${config.API_BASE_URL}/course?name=${searchTerm}&days=${daysParam}&startTime=${startTime}&endTime=${endTime}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        const data = await res.json();
        return data;
    } catch (error) {
        console.log("error fetching courses: ", error);
    }
}

export function SearchBar({user, detectChange}) {
    const [courseResults, setCourseResults] = useState([])
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAlert, setSearchAlert] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedStartsAfterTime, setSelectedStartsAfterTime] = useState(null);
    const [selectedEndsBeforeTime, setSelectedEndsBeforeTime] = useState(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedTerm(searchTerm); // Update debounced search term
        }, 300);  // Delay search by 300ms

        return () => {
            clearTimeout(handler);  // Cleanup the timeout if input changes
        };
    }, [searchTerm]);

    // Fetch courses based on debounced search term
    useEffect(() => {
        const searchCourses = async () => {
            if (debouncedTerm && debouncedTerm.trim() !== "") {
                const results = await fetchCourses(debouncedTerm, selectedDays, selectedStartsAfterTime, selectedEndsBeforeTime);
                if (results) {
                    setCourseResults(results);
                    setSearchAlert("No courses found that match your search, please try again!")
                } else {
                    setCourseResults([]);
                    setSearchAlert("")
                }
            } else {
                setCourseResults([]);
                setSearchAlert("")
            }
        };

        searchCourses();
    }, [debouncedTerm]);

    return (
        <>
            <Box sx={{ mb: 3 }}>
                <Grid container spacing={5} alignItems="center">
                    <Grid size={6}>
                        <Box className="input-wrapper">
                            <input
                                placeholder="Type to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Box>
                    </Grid>
                    <Box style={{display: "flex"}} >
                    <Grid   size={{ xs: 6, md: 8, lg: 12 }}>
                        <DayPicker
                            selectedDays={selectedDays}
                            setSelectedDays={setSelectedDays}
                        />
                    </Grid>
                    <Grid style={{display: "flex", gap: "20px"}} size={{ xs: 6, md: 8, lg: 12 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimePicker
                                label="Starts after"
                                value={selectedStartsAfterTime}
                                onChange={(newValue) => setSelectedStartsAfterTime(newValue)}
                                sx={{
                                    svg: { color: '#daaa00' },
                                    input: { color: '#daaa00' },
                                    label: { color: '#daaa00' },
                                    '& .MuiInputBase-root': {
                                        height: '43px',
                                        width: '150px',
                                        marginRight: '10px'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#daaa00'
                                    },
                                    '& .MuiInputLabel-shrink': {
                                        color: '#daaa00'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#daaa00',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#b89a00', 
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#daaa00',  
                                        },
                                    },
                                }}
                            />
                            <TimePicker
                                label="Ends before"
                                // timezone="America/New_York"
                                value={selectedEndsBeforeTime}
                                onChange={(newValue) => setSelectedEndsBeforeTime(newValue)}
                                sx={{
                                    svg: { color: '#daaa00' },
                                    input: { color: '#daaa00' },
                                    label: { color: '#daaa00' },
                                    '& .MuiInputBase-root': {
                                        height: '43px',
                                        width: '150px',
                                        color: '#daaa00'
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#daaa00'
                                    },
                                    '& .MuiInputLabel-shrink': {
                                        color: '#daaa00'
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#daaa00',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#b89a00', 
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#daaa00',  
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Grid></Box>
                </Grid>
            </Box>
            <div style={{marginInline: "auto", maxWidth: "95%"}} >
                {courseResults && courseResults.length > 0 ? (
                    <SwiperComponent
                        slides={courseResults.map((course) =>
                        (
                            //Children 
                            <CourseCard user={user} course={course} onChange={detectChange}> </CourseCard>
                            //Children 
                        )
                        )}>
                    </SwiperComponent>
                ) :  (
                    <p>{searchAlert}</p>
                )}
            </div>
        </>
    );
}