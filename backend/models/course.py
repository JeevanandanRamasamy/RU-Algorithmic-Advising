from db import db
from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    CheckConstraint,
)

from dataclasses import dataclass


@dataclass
class Course(db.Model):
    __tablename__ = "Course"
    course_id = Column(String(10), primary_key=True)
    course_name = Column(String(200), nullable=False)
    credits = Column(Integer, CheckConstraint("credits > 0"), nullable=False)
    credits = Column(Numeric(3, 1), CheckConstraint("credits >= 0"), nullable=False)
    course_link = Column(String(255))

    def __repr__(self):
        return f"<Course(course_id={self.course_id}, course_name={self.course_name}, credits={self.credits}, course_link={self.course_link})>"

    def to_dict(self):
        return {
            "course_id": self.course_id,
            "course_name": self.course_name,
            "credits": self.credits,
            "course_link": self.course_link,
        }
