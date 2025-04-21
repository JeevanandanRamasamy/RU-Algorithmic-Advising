from db import db
from sqlalchemy import (
    Column,
    String,
    Integer,
    JSON,
    ForeignKey,
)
from sqlalchemy.dialects.mysql import CHAR
from dataclasses import dataclass


@dataclass
class RequirementGroup(db.Model):
    __tablename__ = "RequirementGroup"
    __table_args__ = {'extend_existing': True}
    group_id = Column(Integer, primary_key=True, autoincrement=True)
    group_name = db.Column(db.String(255)) # Added group_name column
    program_id = Column(String(7), ForeignKey("Program.program_id", ondelete="CASCADE"))
    course_id = Column(CHAR(10), ForeignKey("Course.course_id", ondelete="CASCADE"))
    num_required = Column(Integer, default=None)
    list = Column(JSON, default=None)
    parent_group_id = Column(
        Integer,
        ForeignKey("RequirementGroup.group_id", ondelete="CASCADE"),
        default=None,
    )

    def __repr__(self):
        return (
            f"<RequirementGroup(group_id={self.group_id}, program_id={self.program_id}, course_id={self.course_id}, "
            f"num_required={self.num_required}, list={self.list}, parent_group_id={self.parent_group_id})>"
        )
