from db import db
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Enum,
)

from dataclasses import dataclass


@dataclass
class Program(db.Model):
    """
    Data model representing an academic program (e.g., major, minor, certificate).
    """
    __tablename__ = "Program"

    # Typed class attributes for dataclass compatibility
    program_id: str
    program_name: str
    program_type: str
    is_credit_intensive: bool
    additional_details: str

    # Unique identifier for the program (e.g., "NB198SJ")
    program_id = Column(String(7), primary_key=True)

    # Name of the program (e.g., "Major in Computer Science - B.S.")
    program_name = Column(String(200), nullable=False)

    # Type of program: major, minor, certificate, or SAS core
    program_type = Column(
        Enum("major", "minor", "certificate", "sas_core", name="program_type_enum"),
        nullable=False,
    )

    # Indicates if the program is credit-intensive (e.g., requires a certain number of credits)
    is_credit_intensive = Column(Boolean, 
        nullable=False, 
        default=False,
    )

    # Additional details about the program (e.g., prerequisites, restrictions)
    additional_details = Column(Text)

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<Program(program_id={self.program_id}, "
            f"program_name={self.program_name}, "
            f"program_type={self.program_type})>"
        )
