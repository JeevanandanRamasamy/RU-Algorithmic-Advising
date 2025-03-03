import React from 'react';

const PlannedCourseItem = ({ plannedCourse, onRemove }) => {
  const handleRemoveClick = () => {
    onRemove(plannedCourse.course_id);
  };
  
  return (
    <div className="planned-course-item">
      <h3>{plannedCourse.course_name}</h3>
      <p>ID: {plannedCourse.course_id}</p>
      <p>{plannedCourse.credits} credits</p>
      <a href={plannedCourse.course_link} target="_blank" rel="noopener noreferrer">Course Details</a>
      <button onClick={handleRemoveClick}>Remove</button>
    </div>
  );
};

export default PlannedCourseItem;