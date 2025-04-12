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
    __tablename__ = "CourseRecord"

    username: str
    course_id: str
    term: str
    year: int
    grade: str
    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )
    course_id = Column(
        String(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )
    term = Column(Enum("fall", "spring", "summer", "winter", name="term_enum"))
    year = Column(YEAR)
    grade = Column(
        String(2),
        CheckConstraint(
            "grade IN ('A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'PA', 'NC', 'W')"
        ),
    )
    __table_args__ = (PrimaryKeyConstraint("username", "course_id"),)

    def __repr__(self):
        return f"<CourseRecord(username={self.username}, course_id={self.course_id}, term={self.term}, year={self.year})>"
