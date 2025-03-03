import React from 'react';
import { useDrag } from 'react-dnd';

const CourseItem = ({ course, isPlanned = false }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COURSE',
    item: { id: course.course_id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isPlanned,  // Disable drag when the course is already planned
  }));

  // Log the course ID when the drag starts
  React.useEffect(() => {
    if (isDragging) {
      console.log(`Dragging course: ${course.course_name} (ID: ${course.course_id})`);
    }
  }, [isDragging, course]);

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
