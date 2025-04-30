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
    """
    Data model representing a student's enrollment in a specific program.
    This model establishes a many-to-many relationship between students and programs.
    """
    __tablename__ = "StudentProgram"

    # Typed class attributes for dataclass compatibility
    username: str
    program_id: str

    # Foreign key to StudentDetails.username (student enrolled in the program)
    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )

    # Foreign key to Program.program_id (program in which the student is enrolled)
    program_id = Column(
        String(7), ForeignKey("Program.program_id", ondelete="CASCADE"), nullable=False
    )

    # Composite primary key ensures each student can only be enrolled in a program once
    __table_args__ = (PrimaryKeyConstraint("username", "program_id"),)

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<StudentProgram(username={self.username}, "
            f"program_id={self.program_id})>"
        )
