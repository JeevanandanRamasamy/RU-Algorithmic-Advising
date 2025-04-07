from db import db
from sqlalchemy import (
    Column,
    String,
    Enum,
)
from dataclasses import dataclass


@dataclass
class Account(db.Model):
    __tablename__ = "Account"
    username = Column(String(6), primary_key=True)
    password = Column(String(256))
    first_name = Column(String(50))
    last_name = Column(String(50))
    role = Column(
        Enum("student", "admin", name="role_enum"), default="student", nullable=False
    )

    def __repr__(self):
        return f"<Account(username={self.username}, role={self.role})>"
