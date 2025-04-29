from db import db
from sqlalchemy import (
    Column,
    String,
    Enum,
)
from dataclasses import dataclass


@dataclass
class Account(db.Model):
    """
    Data model for user accounts in the system.
    Represents both students and admins.
    """
    __tablename__ = "Account"

    # Typed class attributes for dataclass compatibility
    username: str
    password: str
    first_name: str
    last_name: str
    role: str

    # Unique username, serves as the primary key (max length 6 characters)
    username = Column(String(6), primary_key=True)

    # Encrypted password (should be hashed before storing)
    password = Column(String(256))

    # First and last names of the user
    first_name = Column(String(50))
    last_name = Column(String(50))

    # User role: either 'student' or 'admin'. Default is 'student'.
    role = Column(
        Enum("student", "admin", name="role_enum"), 
        default="student", 
        nullable=False,
    )

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<Account(username={self.username}, "
            f"role={self.role})>"
        )
