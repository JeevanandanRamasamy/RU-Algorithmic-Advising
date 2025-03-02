import React from 'react';
import { useDrag } from 'react-dnd';

const CourseItem = ({ course, isPlanned = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COURSE',
    item: { id: course.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isPlanned,  // You can’t drag a course once it’s planned
  }));

  return (
    <div 
      ref={drag}
      className={`course-item ${isDragging ? 'dragging' : ''} ${isPlanned ? 'planned' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="course-title">{course.course_name}</div>
      <div className="course-code">{course.course_id}</div>
      <div className="course-credits">{course.credits} credits</div>
      <div className="course-link">{course.course_link}</div>
    </div>
  );
};

export default CourseItem;
