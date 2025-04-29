from db import db
from sqlalchemy import (
    Column,
    String,
    Integer,
    Enum,
    DateTime,
    ForeignKey,
)
from sqlalchemy.dialects.mysql import YEAR
from dataclasses import dataclass


@dataclass
class SchedulePlan(db.Model):
    """
    Represents a student's schedule plan, which includes the courses they plan to take in a specific term and year.
    This model is used to manage and track the student's course planning process.
    """
    __tablename__ = "SchedulePlan"

    # Typed class attributes for dataclass compatibility
    schedule_id: str
    username: str
    schedule_name: str
    term: str
    year: int

    # Unique identifier for the schedule plan (auto-incremented)
    schedule_id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign key to StudentDetails.username (student who owns the schedule)
    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )

    # Name of the schedule plan (e.g., "Fall 2023 Plan")
    schedule_name = Column(String(50))

    # Timestamp of the last update to the schedule plan
    last_updated = Column(DateTime, nullable=False)

    # Academic term for the schedule plan (e.g., "fall", "spring", "summer", "winter")
    term = Column(
        Enum("fall", "spring", "summer", "winter", name="term_enum"), nullable=False
    )
    # Academic year for the schedule plan (4-digit year)
    year = Column(YEAR, nullable=False)

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<SchedulePlan(schedule_id={self.schedule_id}, "
            f"username={self.username}, "
            f"schedule_name={self.schedule_name}, "
            f"last_updated={self.last_updated}, "
            f"term={self.term}, "
            f"year={self.year})>"
        )
