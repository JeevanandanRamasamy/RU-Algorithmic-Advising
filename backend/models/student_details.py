from db import db
from sqlalchemy import (
    Column,
    String,
    Integer,
    Numeric,
    Enum,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.dialects.mysql import YEAR
from dataclasses import dataclass


@dataclass
class StudentDetails(db.Model):
    __tablename__ = "StudentDetails"

    __table_args__ = {"extend_existing": True}

    username: str
    grad_year: int
    enroll_year: int
    credits_earned: str
    gpa: str
    
    username = Column(
        String(6), ForeignKey("Account.username", ondelete="CASCADE"), primary_key=True
    )
    grad_year = Column(YEAR)
    enroll_year = Column(YEAR)
    credits_earned = Column(Numeric(4, 1), CheckConstraint("credits_earned >= 0"))
    gpa = Column(Numeric(3, 2), CheckConstraint("gpa BETWEEN 0.00 AND 4.00"))

    def __repr__(self):
        return f"<StudentDetails(username={self.username}>"
