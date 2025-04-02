from db import db
from sqlalchemy import (
    Column,
    String,
    Integer,
    ForeignKey,
)
from sqlalchemy.dialects.mysql import CHAR
from dataclasses import dataclass


@dataclass
class Section(db.Model):
    __tablename__ = "Section"
    schedule_id = Column(
        Integer,
        ForeignKey("SchedulePlan.schedule_id", ondelete="CASCADE"),
        nullable=False,
    )
    course_id = Column(
        CHAR(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )
    section_num = Column(CHAR(2), nullable=False)
    index_num = Column(CHAR(5), nullable=False)
    instructor = Column(String(50), nullable=False)
    __table_args__ = (
        db.PrimaryKeyConstraint("schedule_id", "course_id"),
    )

    def __repr__(self):
        return (
            f"<Section(schedule_id={self.schedule_id}, course_id={self.course_id}, section_num={self.section_num}, "
            f"index_num={self.index_num}, instructor={self.instructor})>"
        )
