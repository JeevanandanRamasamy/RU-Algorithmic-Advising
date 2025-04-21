// components/TakenCourses.jsx
import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const TakenCourses = ({ username }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTakenCourses = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/degree_navigator/users/${username}/completed-courses`
        );

        if (!res.ok) throw new Error("Failed to fetch completed courses");
        const data = await res.json();

        console.log("Fetched completed courses:", data); // Debugging line

        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTakenCourses();
  }, [username]);

  if (loading) return <p>Loading completed courses...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!courses.length) return <p>No completed courses found.</p>;

  return (
    <div>
      <h2>Completed Courses</h2>
      <ul>
        {courses.map((course) => (
          <li key={course.course_id}>
            {course.course_info.course_id} -{" "}
            {course.course_info.course_name || "Untitled"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TakenCourses;
