import React from 'react';
import CourseItem from './CourseItem';

const CourseList = ({ courses, onDrop, plannedCourseIds = [] }) => {
  // Filter out courses that are already in the plan
  const availableCourses = courses.filter(course => !plannedCourseIds.includes(course.course_id));

  return (
    <div className="course-list">
      {availableCourses.length > 0 ? (
        availableCourses.map(course => (
          <CourseItem key={course.course_id} course={course} />
        ))
      ) : (
        <div className="no-courses">No available courses found</div>
      )}
    </div>
  );
};

export default CourseList;