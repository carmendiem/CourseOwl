import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function CourseDetails() {
  const { course_code } = useParams();  // Get the course_code from the URL
  const [courses, setCourses] = useState([]);  // Store all courses with the same course_code
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch courses with the same course_code when the component loads
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Make sure to encode the course_code for the URL
        const res = await axios.get(`${config.API_BASE_URL}/course/code/${course_code}`);
        setCourses(res.data);  // Set fetched courses
        setLoading(false);  // Turn off loading
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError('Error fetching courses');  // Set error message
        setLoading(false);  // Turn off loading
      }
    };

    fetchCourses();
  }, [course_code]);  // Re-fetch course data when course_code changes

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

  return (
    <div>
      <h1>Courses for {course_code}</h1>

      {courses.map((course, index) => (
        <div key={index} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc' }}>
          <h2>{course.course_name}</h2>
          <p><strong>Course Code:</strong> {course.course_code}</p>
          <p><strong>Type:</strong> {course.Type}</p>
          <p><strong>Time:</strong> {course.Time}</p>
          <p><strong>Days:</strong> {course.Days}</p>
          <p><strong>Location:</strong> {course.Where}</p>
          <p><strong>Date Range:</strong> {course['Date Range']}</p>
          <p><strong>Schedule Type:</strong> {course['Schedule Type']}</p>
          <p><strong>Credit Hours:</strong> {course.credit_hours}</p>

          <h3>Instructors</h3>
          {course.Instructors && course.Instructors.length > 0 ? (
            <ul>
              {course.Instructors.map((instructor, index) => (
                <li key={index}>
                  <strong>{instructor.name}</strong> <br />
                  <a href={`mailto:${instructor.email}`}>Email: {instructor.email}</a><br />

                  {instructor.grade_distribution && Object.keys(instructor.grade_distribution).length > 0 ? (
                    <>
                      <h4>Grade Distribution</h4>
                      <ul>
                        {Object.keys(instructor.grade_distribution).map((grade, idx) => (
                          <li key={idx}>
                            {grade}: {instructor.grade_distribution[grade]}%
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>No grade distribution available</p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No instructors available</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default CourseDetails;
