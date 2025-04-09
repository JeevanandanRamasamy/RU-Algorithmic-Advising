from db import db
from sqlalchemy import (
    Column,
    String,
    Enum,
    DateTime,
    PrimaryKeyConstraint,
    ForeignKey,
    CheckConstraint,
)
from datetime import datetime
from sqlalchemy.dialects.mysql import YEAR

class SPNRequest(db.Model):
    __tablename__ = "SPNRequest"
    student_id = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )
    course_id = Column(
        String(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )
    section_num = Column(String(2), nullable=False)
    index_num = Column(String(5), nullable=False)
    term = Column(
        Enum("fall", "spring", "summer", "winter", name="term_enum"), nullable=False
    )
    year = Column(YEAR, nullable=False)
    reason = Column(String(255), nullable=False)
    status = Column(
        Enum("pending", "approved", "denied"), nullable=False, default="pending"
    )
    timestamp = Column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    admin_id = Column(
        String(6),
        ForeignKey("Account.username", ondelete="SET NULL"),
    )
    __table_args__ = (
        PrimaryKeyConstraint("student_id", "course_id", "section_num"),
        CheckConstraint(
            "status IN ('Pending', 'Approved', 'Denied')",
            name="check_status_enum",
        ),
    )

    def __repr__(self):
        return (
            f"<SPNRequest(student_id={self.student_id}, course_id={self.course_id}, section_num={self.section_num}, "
            f"index_num={self.index_num}, term={self.term}, year={self.year}, reason={self.reason}, "
            f"status={self.status}, timestamp={self.timestamp}, admin_id={self.admin_id})>"
        )
    
    def to_dict(self):
        return {
            "student_id": self.student_id,
            "course_id": self.course_id,
            "section_num": self.section_num,
            "index_num": self.index_num,
            "term": self.term,
            "year": self.year,
            "reason": self.reason,
            "status": self.status,
            "timestamp": self.timestamp,
            "admin_id": self.admin_id,
        }