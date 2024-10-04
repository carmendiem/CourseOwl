import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { Card, CardContent, Typography, Grid, Box, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';

function CourseDetails() {
  const { course_code } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleLabsRecitations, setVisibleLabsRecitations] = useState(6);

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

  const lectures = courses.filter(course => course['Schedule Type'] === 'Lecture');
  const labsRecitations = courses.filter(course => course['Schedule Type'] !== 'Lecture');

  const sortedLectures = [...lectures].sort((a, b) => {
    const aHasGrades = a.Instructors.some(instructor => instructor.grade_distribution && Object.keys(instructor.grade_distribution).length > 0);
    const bHasGrades = b.Instructors.some(instructor => instructor.grade_distribution && Object.keys(instructor.grade_distribution).length > 0);
    return bHasGrades - aHasGrades;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (courses.length === 0) {
    return <div>No courses found for this course code</div>;
  }

  const formatGradeData = (gradeDistribution) => {
    return Object.keys(gradeDistribution).map(grade => ({
      name: grade,
      value: gradeDistribution[grade] * 100
    }));
  };

  const cleanCourseName = (name) => {
    const linkIndex = name.indexOf('Link');
    if (linkIndex !== -1) {
      return name.slice(0, linkIndex).trim();
    }
    return name;
  };

  const loadMore = () => {
    setVisibleLabsRecitations(prev => prev + 6);
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', padding: '2rem' }}>
      <h1 style={{ color: '#333333' }}>Courses for {course_code}</h1>

      {sortedLectures.length > 0 ? (
        <>
          <Typography variant="h4" gutterBottom>Lectures</Typography>
          <Grid container spacing={3}>
            {sortedLectures.map((course, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    boxShadow: 2,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Box display="block">
                      <Box>
                        <Typography variant="h5" component="div">
                          {cleanCourseName(course.course_name)}
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

                        <Typography variant="body2" sx={{ mt: 2 }}>
  Instructors:{' '}
  {course.Instructors.map((instructor, idx) => {
    const emailUsername = instructor.email ? instructor.email.split('@')[0] : null;
    const instructorName = instructor.name && instructor.name !== 'TBA' ? instructor.name : 'Unassigned';
    
    return (
      <span key={idx}>
        {emailUsername && instructor.name !== 'TBA' ? (
          <Link to={`/professor/${emailUsername}`}>
            {instructorName}
          </Link>
        ) : (
          instructorName
        )}
        {idx < course.Instructors.length - 1 && ', '}
      </span>
    );
  })}
</Typography>

                      </Box>

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

      {labsRecitations.length > 0 ? (
  <>
    <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>Labs, Recitations, and PSOs</Typography>
    <Grid container spacing={3}>
      {labsRecitations.slice(0, visibleLabsRecitations).map((course, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Card
            sx={{
              boxShadow: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: 6,
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" component="div">
                {cleanCourseName(course.course_name)}
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
              <Typography variant="body2" sx={{ mt: 2 }}>
                Instructors:{' '}
                {course.Instructors.map((instructor, idx) => {
                  const emailUsername = instructor.email ? instructor.email.split('@')[0] : null;
                  const instructorName = instructor.name && instructor.name !== 'TBA' ? instructor.name : 'Unassigned';
                  
                  return (
                    <span key={idx}>
                      {emailUsername && instructorName !== 'Unassigned' ? (
                        <Link to={`/professor/${emailUsername}`}>
                          {instructorName}
                        </Link>
                      ) : (
                        instructorName
                      )}
                      {idx < course.Instructors.length - 1 && ', '}
                    </span>
                  );
                })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
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

