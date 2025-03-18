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
from services.user_service import UserService
from services.course_service import CourseService


class TakenCourseService:
    @staticmethod
    def get_courses_taken_by_student(username):
        try:
            return (
                Course.query.join(
                    CourseTaken, Course.course_id == CourseTaken.course_id
                )
                .filter(CourseTaken.username == username)
                .all()
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving courses taken: {str(e)}"

    @staticmethod
    def insert_courses_taken_by_student(username, course_id):
        try:
            if not UserService.check_account_exists(username):
                return f"User account not found"

            course = CourseService.get_course_by_id(course_id)

            if not course:
                return f"Course not found"

            if CourseService.check_course_exists_for_student(username, course_id):
                return f"Student has already added program"

            taken_course = CourseTaken(username=username, course_id=course_id)

            db.session.add(taken_course)
            db.session.commit()

            return taken_course

        except SQLAlchemyError as e:

            db.session.rollback()

            return f"Error inserting program for student: {str(e)}"
