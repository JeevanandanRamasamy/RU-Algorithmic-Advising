from db import db
from sqlalchemy import (
    Column,
    String,
    Integer,
    Enum,
    DateTime,
    ForeignKey,
)
from sqlalchemy.dialects.mysql import YEAR

class SchedulePlan(db.Model):
    __tablename__ = "SchedulePlan"
    schedule_id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )
    schedule_name = Column(String(50))
    last_updated = Column(DateTime, nullable=False)
    term = Column(
        Enum("fall", "spring", "summer", "winter", name="term_enum"), nullable=False
    )
    year = Column(YEAR, nullable=False)

    def __repr__(self):
        return (
            f"<SchedulePlan(schedule_id={self.schedule_id}, username={self.username}, schedule_name={self.schedule_name}, "
            f"last_updated={self.last_updated}, term={self.term}, year={self.year})>"
        )