import React from 'react';

const PlannedCourseItem = ({ plannedCourse, onRemove }) => {
  const handleRemoveClick = () => {
    onRemove(plannedCourse.course_id);
  };
  
  return (
    <div className="planned-course-item">
      <h3 className="planned-course-name">{plannedCourse.course_name}</h3>
      <p className="planned-course-code"> ID: {plannedCourse.course_id}</p>
      <p className="planned-course-credits">{plannedCourse.credits} credits</p>
      <a className="planned-course-link" href={plannedCourse.course_link} target="_blank" rel="noopener noreferrer">Course Details</a>
      <button className="planned-course-remove" onClick={handleRemoveClick}>Remove</button>
    </div>
  );
};

export default PlannedCourseItem;