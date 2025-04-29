from db import db
from sqlalchemy import (
    Column,
    String,
    Numeric,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.dialects.mysql import YEAR
from dataclasses import dataclass


@dataclass
class StudentDetails(db.Model):
    """
    Data model for student details in the system.
    This includes academic information such as graduation year,
    enrollment year, credits earned, and GPA.
    """
    __tablename__ = "StudentDetails"
    __table_args__ = {"extend_existing": True}

    # Typed class attributes for dataclass compatibility
    username: str
    grad_year: int
    enroll_year: int
    credits_earned: str
    gpa: str
    
    # Foreign key to Account.username (student account)
    username = Column(
        String(6), ForeignKey("Account.username", ondelete="CASCADE"), primary_key=True
    )
    
    # Graduation and enrollment years (4-digit year)
    grad_year = Column(YEAR)
    enroll_year = Column(YEAR)

    # Credits earned (numeric with one decimal place, must be non-negative)
    credits_earned = Column(Numeric(4, 1), CheckConstraint("credits_earned >= 0"))

    # GPA (numeric with two decimal places, must be between 0.00 and 4.00)
    gpa = Column(Numeric(3, 2), CheckConstraint("gpa BETWEEN 0.00 AND 4.00"))

    # String representation for debugging/logging purposes
    def __repr__(self):
        return f"<StudentDetails(username={self.username}>"
