import React from 'react';

const PlannedCourseItem = ({ plannedCourse, onRemove }) => {
  const handleRemoveClick = () => {
    onRemove(plannedCourse.id);
  };

  return (
    <div className="planned-course-item">
      <div className="course-info">
        <div className="course-code">{plannedCourse.course_code}</div>
        <div className="course-title">{plannedCourse.title}</div>
        <div className="course-credits">{plannedCourse.credit_hours} credits</div>
      </div>
      <button className="remove-button" onClick={handleRemoveClick}>
        Remove
      </button>
    </div>
  );
};

export default PlannedCourseItem;
