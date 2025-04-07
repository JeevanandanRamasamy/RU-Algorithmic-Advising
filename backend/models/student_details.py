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
    credits_earned = Column(Integer, CheckConstraint("credits_earned >= 0"))
    gpa = Column(Numeric(3, 2), CheckConstraint("gpa BETWEEN 0.00 AND 4.00"))
    credits_earned = Column(Numeric(4, 1), CheckConstraint("credits_earned >= 0"))
    gpa = Column(Numeric(3, 2), CheckConstraint("gpa BETWEEN 0.00 AND 4.00"))
    class_year = Column(
        Enum(
            "freshman",
            "sophomore",
            "junior",
            "senior",
            "graduate",
            name="class_year_enum",
        ),
        nullable=False,
    )

    def __repr__(self):
        return (
            f"<StudentDetails(username={self.username}, class_year={self.class_year})>"
        )
