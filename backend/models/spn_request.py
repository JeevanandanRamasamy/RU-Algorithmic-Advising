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
from datetime import datetime, timezone
from sqlalchemy.dialects.mysql import YEAR

class SPNRequest(db.Model):
    """
    Data model representing a student's request for a Special Permission Number (SPN).
    This model captures the details of the request, including the student, course,
    section, term, year, reason for the request, status of the request, and the admin
    handling the request.
    """
    __tablename__ = "SPNRequest"

    # Typed class attributes for dataclass compatibility
    student_id: str
    course_id: str
    section_num: str
    index_num: str
    term: str
    year: int
    reason: str
    status: str
    timestamp: datetime
    admin_id: str

    # Foreign key to StudentDetails.username (student making the request)
    student_id = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )

    # Foreign key to Course.course_id (course for which the SPN is requested)
    course_id = Column(
        String(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )

    # Section number of the course (e.g., "01", "02")
    section_num = Column(String(2), nullable=False)

    # Index number of the course section (e.g., "10664")
    index_num = Column(String(5), nullable=False)

    # Academic term when the course is offered
    term = Column(
        Enum("fall", "spring", "summer", "winter", name="term_enum"), nullable=False
    )
    # Academic year (4-digit year)
    year = Column(YEAR, nullable=False)

    # Reason for requesting the SPN (e.g., "Prerequisite not met", "Closed course")
    reason = Column(String(255), nullable=False)

    # Status of the request: "Pending", "Approved", or "Denied"
    status = Column(
        Enum("pending", "approved", "denied"), 
        nullable=False, 
        default="pending"
    )

    # Timestamp of when the request was created
    timestamp = Column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Foreign key to Account.username (admin handling the request)
    admin_id = Column(
        String(6),
        ForeignKey("Account.username", ondelete="SET NULL"),
    )

    # Composite primary key ensures each student can only have one request per course section
    __table_args__ = (
        PrimaryKeyConstraint("student_id", "course_id", "section_num"),
        CheckConstraint(
            "status IN ('Pending', 'Approved', 'Denied')",
            name="check_status_enum",
        ),
    )

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<SPNRequest(student_id={self.student_id}, "
            f"course_id={self.course_id}, "
            f"section_num={self.section_num}, "
            f"index_num={self.index_num}, "
            f"term={self.term}, "
            f"year={self.year}, "
            f"reason={self.reason}, "
            f"status={self.status}, "
            f"timestamp={self.timestamp}, "
            f"admin_id={self.admin_id})>"
        )
    
    # Utility method to return the SPN request as a dictionary (useful for API responses)
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