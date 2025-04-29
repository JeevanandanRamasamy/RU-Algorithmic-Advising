from db import db
from sqlalchemy import (
    Column,
    String,
    Enum,
    PrimaryKeyConstraint,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.dialects.mysql import YEAR
from dataclasses import dataclass


@dataclass
class CourseRecord(db.Model):
    """
    Data model representing a student's record of having taken a course in a given term and year.
    This model can also be used to represent a planned course for a student.
    """
    __tablename__ = "CourseRecord"

    # Typed class attributes for dataclass compatibility
    username: str
    course_id: str
    term: str
    year: int
    grade: str

    # Foreign key to StudentDetails.username (student taking the course)
    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )

    # Foreign key to Course.course_id (course being taken)
    course_id = Column(
        String(10), 
        ForeignKey("Course.course_id", ondelete="CASCADE"), 
        nullable=False,
    )

    # Academic term when the course was taken
    term = Column(Enum("fall", "spring", "summer", "winter", name="term_enum"))
    # Academic year (4-digit year)
    year = Column(YEAR)

    # Grade received in the course, with a constraint to restrict to valid grade values
    grade = Column(
        String(2),
        CheckConstraint(
            "grade IN ('A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'PA', 'NC', 'W')"
        ),
    )

    # Composite primary key ensures each student can only have one record per course
    __table_args__ = (PrimaryKeyConstraint("username", "course_id"),)

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<CourseRecord(username={self.username}, "
            f"course_id={self.course_id}, "
            f"term={self.term}, "
            f"year={self.year})>"
        )
