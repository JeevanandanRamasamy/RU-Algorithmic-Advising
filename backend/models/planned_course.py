from db import db
from sqlalchemy import (
    Column,
    Integer,
    Enum,
    ForeignKey,
)

from dataclasses import dataclass
from sqlalchemy.dialects.mysql import YEAR, CHAR


@dataclass
class PlannedCourse(db.Model):
    __tablename__ = "PlannedCourse"

    plan_id = Column(
        Integer, ForeignKey("DegreePlan.plan_id", ondelete="CASCADE"), nullable=False
    )
    course_id = Column(
        CHAR(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )
    term = Column(
        Enum("fall", "spring", "summer", "winter", name="term_enum"), nullable=False
    )
    year = Column(YEAR, nullable=False)
    __table_args__ = (db.PrimaryKeyConstraint("plan_id", "course_id"),)

    def __repr__(self):
        return f"<PlannedCourse(plan_id={self.plan_id}, course_id={self.course_id}, term={self.term}, year={self.year})>"
