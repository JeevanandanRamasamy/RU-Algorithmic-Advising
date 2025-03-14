from db import db
from datetime import datetime
from models import (
    Account,
    StudentDetails,
    Course,
    CourseTaken,
    Program,
    StudentProgram,
    RequirementGroup,
    DegreePlan,
    PlannedCourse,
    SchedulePlan,
    Section,
)
from sqlalchemy.exc import SQLAlchemyError


class DBCourseService:
    # ------------------ COURSE OPERATIONS ------------------
    @staticmethod
    def get_course_by_id(course_id):
        """Retrieve a course by its course_id."""
        try:
            return Course.query.filter_by(course_id=course_id).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course: {str(e)}"

    @staticmethod
    def insert_course(course_data):
        """Insert a new course into the database."""
        try:
            new_course = Course(**course_data)
            db.session.add(new_course)
            db.session.commit()
            return new_course
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting course: {str(e)}"

    @staticmethod
    def delete_course(course_id):
        """Delete a course by its course_id."""
        try:
            course = Course.query.filter_by(course_id=course_id).first()
            if course:
                db.session.delete(course)
                db.session.commit()
                return f"Course {course_id} deleted successfully"
            else:
                return "Course not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting course: {str(e)}"

    @staticmethod
    def check_course_exists_for_student(username, course_id):
        try:
            return CourseTaken.query.filter(
                CourseTaken.username == username, CourseTaken.course_id == course_id
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking course for student: {str(e)}"
