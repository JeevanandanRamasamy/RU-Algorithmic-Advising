from db import db
from sqlalchemy import (
    Column,
    String,
    PrimaryKeyConstraint,
    ForeignKey,
)
from dataclasses import dataclass


@dataclass
class StudentProgram(db.Model):
    __tablename__ = "StudentProgram"
    username: str
    program_id: str
    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )
    program_id = Column(
        String(7), ForeignKey("Program.program_id", ondelete="CASCADE"), nullable=False
    )
    __table_args__ = (PrimaryKeyConstraint("username", "program_id"),)

    def __repr__(self):
        return (
            f"<StudentProgram(username={self.username}, program_id={self.program_id})>"
        )
