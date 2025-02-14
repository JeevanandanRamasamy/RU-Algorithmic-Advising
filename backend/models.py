from db import db
from sqlalchemy import Enum

class Account(db.Model):
    __tablename__ = 'account'

    username = db.Column(db.String(6), primary_key=True)
    password = db.Column(db.String(30))
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    role = db.Column(Enum('Student', 'Admin', name='role_enum'), default='Student', nullable=False)

    def __repr__(self):
        return f"<Account(username={self.username}, role={self.role})>"