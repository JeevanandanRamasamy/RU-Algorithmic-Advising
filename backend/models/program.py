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
    __tablename__ = "Program"

    program_id: str
    program_name: str
    program_type: str
    is_credit_intensive: bool
    additional_details: str

    program_id = Column(String(7), primary_key=True)
    program_name = Column(String(200), nullable=False)
    program_type = Column(
        Enum("major", "minor", "certificate", "sas_core", name="program_type_enum"),
        nullable=False,
    )
    is_credit_intensive = Column(Boolean, nullable=False, default=False)
    additional_details = Column(Text)

    def __repr__(self):
        return f"<Program(program_id={self.program_id}, program_name={self.program_name}, program_type={self.program_type})>"
