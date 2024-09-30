import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

function CourseDetails() {
  const { courseId } = useParams();  // Get the course ID from the URL
  const [course, setCourse] = useState(null);  // Store course details
  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Fetch course details when the component loads
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/course/${courseId}`);
        setCourse(res.data);  // Set course details
        setLoading(false);  // Turn off loading
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError('Error fetching course details');  // Set error message
        setLoading(false);  // Turn off loading
      }
    };

    fetchCourseDetails();
  }, [courseId]);  // Re-fetch course data when courseId changes

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle error state
  if (error) {
    return <div>{error}</div>;
  }

  // Handle case where course is not found
  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div>
      <h1>{course.course_name}</h1>
      <p><strong>Course Code:</strong> {course.course_code}</p>
      <p><strong>Type:</strong> {course.Type}</p>
      <p><strong>Time:</strong> {course.Time}</p>
      <p><strong>Days:</strong> {course.Days}</p>
      <p><strong>Location:</strong> {course.Where}</p>
      <p><strong>Date Range:</strong> {course['Date Range']}</p>
      <p><strong>Schedule Type:</strong> {course['Schedule Type']}</p>
      <p><strong>Credit Hours:</strong> {course.credit_hours}</p>

      <h2>Instructors</h2>
      {course.Instructors && course.Instructors.length > 0 ? (
        <ul>
          {course.Instructors.map((instructor, index) => (
            <li key={index}>
              <strong>{instructor.name}</strong> <br />
              <a href={`mailto:${instructor.email}`}>Email: {instructor.email}</a><br />

              {instructor.grade_distribution && Object.keys(instructor.grade_distribution).length > 0 ? (
                <>
                  <h3>Grade Distribution</h3>
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
  );
}

export default CourseDetails;
