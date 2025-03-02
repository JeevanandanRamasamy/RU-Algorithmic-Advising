import React, { useState, useEffect, useCallback } from 'react';
import { useDrop } from 'react-dnd';
import CourseList from '../components/CourseList';
import PlannedCourses from '../components/PlannedCourses';
import '../css/DragDrop.css';

function DragDrop() {
  const [courses, setCourses] = useState([]);
  const [plannedCourses, setPlannedCourses] = useState([]);
  const [searchAvailable, setSearchAvailable] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = 'user123'; // Replace with actual user ID

  useEffect(() => {
    fetchCourses(); // Initial course fetch
  }, []);

  // Debounced API call to prevent excessive requests
  const fetchCourses = useCallback(
    async (search = '') => {
      setLoading(true);
      try {
        const url = search 
          ? `http://localhost:8080/api/db_courses?search=${encodeURIComponent(search)}`
          : 'http://localhost:8080/api/db_courses';
        
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched Courses:", data);
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounce mechanism using useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses(searchAvailable);
    }, 300); // Adjust delay time (300ms is a good starting point)

    return () => clearTimeout(delayDebounceFn);
  }, [searchAvailable, fetchCourses]);

  // Handle search input changes
  const handleSearchAvailable = (e) => {
    setSearchAvailable(e.target.value);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Course Planner</h1>
      </header>
      
      <main className="course-planner">
        <section className="available-courses">
          <h2>Available Courses</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchAvailable}
              onChange={handleSearchAvailable}
            />
          </div>
          {loading ? (
            <div className="loading">Loading courses...</div>
          ) : (
            <CourseList courses={courses} />
          )}
        </section>

        <section className="planned-courses">
          <h2>Planned Courses</h2>
          {plannedCourses.length === 0 ? (
            <div className="no-planned-courses">No planned courses yet</div>
          ) : (
            <PlannedCourses plannedCourses={plannedCourses} />
          )}
        </section>
      </main>
    </div>
  );
}

export default DragDrop;
