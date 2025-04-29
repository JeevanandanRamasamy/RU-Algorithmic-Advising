from db import db
from sqlalchemy import (
    Column,
    String,
    Numeric,
    CheckConstraint,
)

from dataclasses import dataclass


@dataclass
class Course(db.Model):
    """
    Data model representing a Rutgers university course.
    """
    __tablename__ = "Course"

    # Typed class attributes for dataclass compatibility
    course_id: str
    course_name: str
    credits: float
    course_link: str

    # Unique identifier for the course (e.g., "CS101")
    course_id = Column(String(10), primary_key=True)

    # Name of the course (e.g., "Introduction to Computer Science")
    course_name = Column(String(200), nullable=False)

    # Number of credits the course is worth; must be non-negative (e.g., 3.0, 1.5)
    credits = Column(Numeric(3, 1), CheckConstraint("credits >= 0"), nullable=False)

    # Optional URL to the course syllabus or catalog entry
    course_link = Column(String(255))

    # String representation for debugging/logging
    def __repr__(self):
        return (
            f"<Course(course_id={self.course_id}, "
            f"course_name={self.course_name}, "
            f"credits={self.credits}, "
            f"course_link={self.course_link})>"
        )

    # Utility method to return the course as a dictionary (useful for API responses)
    def to_dict(self):
        return {
            "course_id": self.course_id,
            "course_name": self.course_name,
            "credits": self.credits,
            "course_link": self.course_link,
        }
