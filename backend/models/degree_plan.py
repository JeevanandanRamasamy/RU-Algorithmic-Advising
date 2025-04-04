from db import db
from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
)

class DegreePlan(db.Model):
    __tablename__ = "DegreePlan"
    plan_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )
    plan_name = Column(String(50))
    last_updated = Column(DateTime, nullable=False)

    def __repr__(self):
        return f"<DegreePlan(plan_id={self.plan_id}, username={self.username}, plan_name={self.plan_name}, last_updated={self.last_updated})>"
    
    def to_dict(self):
        return {
            "plan_id": self.plan_id,
            "username": self.username,
            "plan_name": self.plan_name,
            "last_updated": self.last_updated
        }