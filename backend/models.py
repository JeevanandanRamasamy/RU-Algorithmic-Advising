from db import db
from sqlalchemy import (
    Column,
    String,
    Text,
    Boolean,
    Integer,
    Numeric,
    Enum,
    DateTime,
    JSON,
    PrimaryKeyConstraint,
    ForeignKey,
    CheckConstraint,
)
from sqlalchemy.dialects.mysql import YEAR, CHAR
from dataclasses import dataclass


@dataclass
class Account(db.Model):
    __tablename__ = "Account"

    username = Column(String(6), primary_key=True)
    password = Column(String(30))
    first_name = Column(String(50))
    last_name = Column(String(50))
    role = Column(
        Enum("student", "admin", name="role_enum"), default="student", nullable=False
    )

    def __repr__(self):
        return f"<Account(username={self.username}, role={self.role})>"


@dataclass
class StudentDetails(db.Model):
    __tablename__ = "StudentDetails"
    username: str
    grad_date: str
    enroll_date: str
    credits_earned: str
    gpa: str
    class_year: str

    username = Column(
        String(6), ForeignKey("Account.username", ondelete="CASCADE"), primary_key=True
    )
    grad_date = Column(YEAR)
    enroll_date = Column(YEAR)
    credits_earned = Column(Integer, CheckConstraint("credits_earned >= 0"))
    gpa = Column(Numeric(3, 2), CheckConstraint("gpa BETWEEN 0.00 AND 4.00"))
    class_year = Column(
        Enum(
            "freshman",
            "sophomore",
            "junior",
            "senior",
            "graduate",
            name="class_year_enum",
        ),
        nullable=False,
    )
    credits_earned = Column(Numeric(4, 1), CheckConstraint("credits_earned >= 0"))
    gpa = Column(Numeric(3, 2), CheckConstraint("gpa BETWEEN 0.00 AND 4.00"))
    class_year = Column(
        Enum(
            "freshman",
            "sophomore",
            "junior",
            "senior",
            "graduate",
            name="class_year_enum",
        ),
        nullable=False,
    )

    def __repr__(self):
        return (
            f"<StudentDetails(username={self.username}, class_year={self.class_year})>"
        )


@dataclass
class Course(db.Model):
    __tablename__ = "Course"

    course_id = Column(String(10), primary_key=True)
    course_name = Column(String(200), nullable=False)
    credits = Column(Integer, CheckConstraint("credits > 0"), nullable=False)
    credits = Column(Numeric(3, 1), CheckConstraint("credits >= 0"), nullable=False)
    course_link = Column(String(255))

    def __repr__(self):
        return f"<Course(course_id={self.course_id}, course_name={self.course_name}, credits={self.credits}, course_link={self.course_link})>"


@dataclass
class CourseTaken(db.Model):
    __tablename__ = "CourseTaken"

    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )
    course_id = Column(
        String(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )
    term = Column(Enum("fall", "spring", "summer", "winter", name="term_enum"))
    year = Column(YEAR)
    grade = Column(
        String(2),
        CheckConstraint(
            "grade IN ('A', 'B+', 'B', 'C+', 'C', 'D', 'F', 'PA', 'NC', 'W')"
        ),
    )

    __table_args__ = (PrimaryKeyConstraint("username", "course_id", "term", "year"),)

    def __repr__(self):
        return f"<CourseTaken(username={self.username}, course_id={self.course_id}, term={self.term}, year={self.year})>"


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


@dataclass
class StudentProgram(db.Model):
    __tablename__ = "StudentProgram"

    username: str
    program_id: str

    username = Column(
        String(6),
        ForeignKey("StudentDetails.username", ondelete="CASCADE"),
        nullable=False,
    )
    program_id = Column(
        String(7), ForeignKey("Program.program_id", ondelete="CASCADE"), nullable=False
    )

    __table_args__ = (PrimaryKeyConstraint("username", "program_id"),)

    def __repr__(self):
        return (
            f"<StudentProgram(username={self.username}, program_id={self.program_id})>"
        )


@dataclass
class RequirementGroup(db.Model):
    __tablename__ = "RequirementGroup"

    group_id = Column(Integer, primary_key=True, autoincrement=True)
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


@dataclass
class PlannedCourse(db.Model):
    __tablename__ = "PlannedCourse"

    plan_id = Column(
        Integer, ForeignKey("DegreePlan.plan_id", ondelete="CASCADE"), nullable=False
    )
    course_id = Column(
        CHAR(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )
    term = Column(
        Enum("fall", "spring", "summer", "winter", name="term_enum"), nullable=False
    )
    year = Column(YEAR, nullable=False)

    __table_args__ = (db.PrimaryKeyConstraint("plan_id", "course_id"),)

    def __repr__(self):
        return f"<PlannedCourse(plan_id={self.plan_id}, course_id={self.course_id}, term={self.term}, year={self.year})>"


@dataclass
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


@dataclass
class Section(db.Model):
    __tablename__ = "Section"

    schedule_id = Column(
        Integer,
        ForeignKey("SchedulePlan.schedule_id", ondelete="CASCADE"),
        nullable=False,
    )
    course_id = Column(
        CHAR(10), ForeignKey("Course.course_id", ondelete="CASCADE"), nullable=False
    )
    section_num = Column(CHAR(2), nullable=False)
    index_num = Column(CHAR(5), nullable=False)
    instructor = Column(String(50), nullable=False)

    __table_args__ = (
        db.PrimaryKeyConstraint("schedule_id", "course_id", "section_num"),
    )

    def __repr__(self):
        return (
            f"<Section(schedule_id={self.schedule_id}, course_id={self.course_id}, section_num={self.section_num}, "
            f"index_num={self.index_num}, instructor={self.instructor})>"
        )
