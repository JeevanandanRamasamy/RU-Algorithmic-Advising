// src/components/PlannedCourses.js
import React from 'react';
import { useDrop } from 'react-dnd';
import PlannedCourseItem from './PlannedCourseItem';

const PlannedCourses = ({ plannedCourses, onRemove }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'COURSE',
    drop: (item) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

return (
    <div 
      ref={drop} 
      className={`planned-courses-container ${isOver ? 'drop-hover' : ''}`}
    >
      {plannedCourses.length > 0 ? (
        <div className="planned-courses-list">
          {plannedCourses.map(plannedCourse => (
            <PlannedCourseItem 
              key={plannedCourse.id} 
              plannedCourse={plannedCourse} 
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : (
        <div className="no-planned-courses">
          Drag courses here to add them to your plan
        </div>
      )}
    </div>
  );
};

export default PlannedCourses;