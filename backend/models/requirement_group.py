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
    """
    Represents a group of course requirements within a program.
    This can be a leaf group (containing a list of course IDs) or a parent group composed of child groups.
    """
    __tablename__ = "RequirementGroup"
    __table_args__ = {"extend_existing": True}

    # Typed class attributes for dataclass compatibility
    group_id: int
    group_name: str
    program_id: str
    course_id: str
    num_required: int
    list: list
    parent_group_id: int

    group_id = Column(Integer, primary_key=True, autoincrement=True)

    # Optional display name for the group
    group_name = db.Column(db.String(255))

    # Progam this group is tied to (not always used)
    program_id = Column(String(7), ForeignKey("Program.program_id", ondelete="CASCADE"))

    # Course this group is tied to (not always used)
    course_id = Column(CHAR(10), ForeignKey("Course.course_id", ondelete="CASCADE"))

    # Number of items required to fulfill this group (e.g., take any 2 of these 4)
    num_required = Column(Integer, default=None)

    # List of course IDs (JSON array)
    list = Column(JSON, default=None)

    # Foreign key to the parent group (if this is a child group)
    parent_group_id = Column(
        Integer,
        ForeignKey("RequirementGroup.group_id", ondelete="CASCADE"),
        default=None,
    )

    # String representation for debugging/logging purposes
    def __repr__(self):
        return (
            f"<RequirementGroup(group_id={self.group_id}, "
            f"program_id={self.program_id}, "
            f"course_id={self.course_id}, "
            f"num_required={self.num_required}, "
            f"list={self.list}, "
            f"parent_group_id={self.parent_group_id})>"
        )
