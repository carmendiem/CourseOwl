import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Link is imported to navigate to the professor's page
import axios from 'axios';
import config from '../config';
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

function CourseDetails() {
  const { course_code } = useParams();  // Get the course_code from the URL
  const [courses, setCourses] = useState([]);  // Store all courses with the same course_code
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state
  const [visibleLabsRecitations, setVisibleLabsRecitations] = useState(6);  // Controls how many non-lecture classes are shown

  // Fetch courses with the same course_code when the component loads
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const encodedCourseCode = encodeURIComponent(course_code);
        const res = await axios.get(`${config.API_BASE_URL}/course/code/${encodedCourseCode}`);
        setCourses(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError('Error fetching courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [course_code]);

  // Organize courses into "Lectures" and "Labs, Recitations, PSOs"
  const lectures = courses.filter(course => course['Schedule Type'] === 'Lecture');
  const labsRecitations = courses.filter(course => course['Schedule Type'] !== 'Lecture');

  // Sort lectures so that those with grade distribution come first
  const sortedLectures = [...lectures].sort((a, b) => {
    const aHasGrades = a.Instructors.some(instructor => instructor.grade_distribution && Object.keys(instructor.grade_distribution).length > 0);
    const bHasGrades = b.Instructors.some(instructor => instructor.grade_distribution && Object.keys(instructor.grade_distribution).length > 0);
    return bHasGrades - aHasGrades;  // Sort by whether they have grade distribution
  });

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  // Handle case where no courses are found
  if (courses.length === 0) {
    return <div>No courses found for this course code</div>;
  }

  // Function to format grade data for recharts (multiplying values by 100 to represent percentages)
  const formatGradeData = (gradeDistribution) => {
    return Object.keys(gradeDistribution).map(grade => ({
      name: grade,
      value: gradeDistribution[grade] * 100  // Convert to percentage
    }));
  };

  // Function to remove everything after "Link" in the course name
  const cleanCourseName = (name) => {
    const linkIndex = name.indexOf('Link');
    if (linkIndex !== -1) {
      return name.slice(0, linkIndex).trim();
    }
    return name;
  };

  // Function to load more labs/recitations/PSOs
  const loadMore = () => {
    setVisibleLabsRecitations(prev => prev + 6);
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '2rem' }}>
      <h1 style={{ color: '#333333' }}>Courses for {course_code}</h1>

      {/* Conditionally render the Lectures section */}
      {sortedLectures.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom>Lectures</Typography>
          <Grid container spacing={3}>
            {sortedLectures.map((course, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    boxShadow: 2,  // Default shadow
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',  // Slight scale up on hover
                      boxShadow: 6,  // Deeper shadow on hover
                    },
                  }}
                >
                  <CardContent>
                    <Box display="block">
                      {/* Course Information */}
                      <Box>
                        <Typography variant="h5" component="div">
                          {cleanCourseName(course.course_name)} {/* Cleaned course name */}
                        </Typography>
                        <Typography color="textSecondary">
                          {course.Type} | {course.credit_hours} Credit Hours
                        </Typography>
                        <Typography variant="body2">
                          Time: {course.Time} <br />
                          Days: {course.Days} <br />
                          Location: {course.Where} <br />
                          Date Range: {course['Date Range']} <br />
                          Schedule Type: {course['Schedule Type']}
                        </Typography>

                        {/* Display professor names without the list */}
                        <Typography variant="body2" sx={{ mt: 2 }}>
                          Instructors:{' '}
                          {course.Instructors.map((instructor, idx) => (
                            <span key={idx}>
                              <Link to={`/professor/${instructor.email.split('@')[0]}`}>
                                {instructor.name}
                              </Link>
                              {idx < course.Instructors.length - 1 && ', '}
                            </span>
                          ))}
                        </Typography>
                      </Box>

                      {/* Grade Distribution - Moved Below Course Info */}
                      {course.Instructors.some(instructor => instructor.grade_distribution) && (
                        <Box width="100%" mt={3}>
                          {course.Instructors.map((instructor, idx) =>
                            instructor.grade_distribution && Object.keys(instructor.grade_distribution).length > 0 ? (
                              <ResponsiveContainer key={idx} width="100%" height={300}>
                                <BarChart data={formatGradeData(instructor.grade_distribution)}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name">
                                    <Label value="Grade" position="insideBottom" offset={-5} />
                                  </XAxis>
                                  <YAxis>
                                    <Label value="Percentage (%)" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                                  </YAxis>
                                  <Tooltip formatter={(value) => `${value}%`} />
                                  <Bar dataKey="value" fill="#8884d8" />
                                  <Label
                                    value="Grade Distribution"
                                    position="left"
                                    angle={-90}
                                    offset={15}
                                    style={{ textAnchor: 'middle', fontWeight: 'bold' }}
                                  />
                                </BarChart>
                              </ResponsiveContainer>
                            ) : null
                          )}
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 2 }}>No Lectures available for this course code</Typography>
      )}

      {/* Conditionally render the Labs, Recitations, and PSOs section */}
      {labsRecitations.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Labs, Recitations, and PSOs</Typography>
          <Grid container spacing={3}>
            {labsRecitations.slice(0, visibleLabsRecitations).map((course, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    boxShadow: 2,  // Default shadow
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',  // Slight scale up on hover
                      boxShadow: 6,  // Deeper shadow on hover
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {cleanCourseName(course.course_name)} {/* Cleaned course name */}
                    </Typography>
                    <Typography color="textSecondary">
                      {course.Type} | {course.credit_hours} Credit Hours
                    </Typography>
                    <Typography variant="body2">
                      Time: {course.Time} <br />
                      Days: {course.Days} <br />
                      Location: {course.Where} <br />
                      Date Range: {course['Date Range']} <br />
                      Schedule Type: {course['Schedule Type']}
                    </Typography>

                    {/* Display professor names without the list */}
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Instructors:{' '}
                      {course.Instructors.map((instructor, idx) => (
                        <span key={idx}>
                          <Link to={`/professor/${instructor.email.split('@')[0]}`}>
                            {instructor.name}
                          </Link>
                          {idx < course.Instructors.length - 1 && ', '}
                        </span>
                      ))}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

            {/* Show "View More" button if there are more labs/recitations to show */}
            {visibleLabsRecitations < labsRecitations.length && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={loadMore}>
                View More
              </Button>
            </div>
          )}
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 2 }}>No Labs, Recitations, or PSOs available for this course code</Typography>
      )}
    </div>
  );
}

export default CourseDetails;

