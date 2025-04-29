from db import db
from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
)
from sqlalchemy.dialects.mysql import CHAR
from dataclasses import dataclass


@dataclass
class Section(db.Model):
    """
    Data model representing a section of a course in a schedule.
    This model is used to link a course to a specific schedule and section number.
    """
    __tablename__ = "Section"

    # Typed class attributes for dataclass compatibility
    schedule_id: int
    course_id: str
    index_num: str

    # Foreign key to SchedulePlan.schedule_id (the schedule this section belongs to)
    schedule_id = Column(
        Integer,
        ForeignKey("SchedulePlan.schedule_id", ondelete="CASCADE"),
        nullable=False,
    )

    # Foreign key to Course.course_id (the course this section is for)
    course_id = Column(
        CHAR(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )

    # Section number for the course (e.g., "10664")
    index_num = Column(CHAR(5), nullable=False)

    # Composite primary key ensures each course can only have one section per schedule
    __table_args__ = (db.PrimaryKeyConstraint("schedule_id", "course_id"),)

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<Section(schedule_id={self.schedule_id}, "
            f"course_id={self.course_id}, "
            f"index_num={self.index_num})>"
        )

    # Utility method to return the section as a dictionary (useful for API responses)
    def to_dict(self):
        return {
            "schedule_id": self.course_id,
            "course_id": self.course_id,
            "index_num": self.index_num,
        }
