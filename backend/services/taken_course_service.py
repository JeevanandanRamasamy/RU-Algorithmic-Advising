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
    def get_course_taken_by_student(username, course_id):
        try:
            course_taken = (
                db.session.query(CourseTaken, Course)
                .join(Course, Course.course_id == CourseTaken.course_id)
                .filter(
                    CourseTaken.username == username, CourseTaken.course_id == course_id
                )
                .first()
            )

            if not course_taken:
                return None  # Or return a message like "Course not found"

            taken, course = course_taken
            return {
                "username": taken.username,
                "term": taken.term,
                "year": taken.year,
                "grade": taken.grade,
                "course_info": {
                    "course_id": taken.course_id,
                    "course_name": course.course_name,
                    "credits": course.credits,
                    "course_link": course.course_link,
                },
            }

        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course: {str(e)}"

    @staticmethod
    def get_courses_taken_by_student(username):
        try:
            courses = (
                db.session.query(CourseTaken, Course)
                .join(Course, Course.course_id == CourseTaken.course_id)
                .filter(CourseTaken.username == username)
                .all()
            )
            return [
                {
                    "username": taken.username,
                    "term": taken.term,
                    "year": taken.year,
                    "grade": taken.grade,
                    "course_info": {
                        "course_id": taken.course_id,
                        "course_name": course.course_name,
                        "credits": course.credits,
                        "course_link": course.course_link,
                    },
                }
                for taken, course in courses
            ]
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving courses taken: {str(e)}"

    @staticmethod
    def insert_course_taken_by_student(username, course_id):
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
            return TakenCourseService.get_course_taken_by_student(username, course_id)

        except SQLAlchemyError as e:

            db.session.rollback()

            return f"Error inserting program for student: {str(e)}"

    @staticmethod
    def remove_course_taken_by_student(username, course_id):
        try:
            if not UserService.check_account_exists(username):
                return f"User account not found"

            course = CourseService.get_course_by_id(course_id)

            if not course:
                return f"Course not found"

            taken_course = (
                db.session.query(CourseTaken)
                .filter(
                    CourseTaken.username == username, CourseTaken.course_id == course_id
                )
                .first()
            )
            if not taken_course:
                return "Student has not taken this course"

            taken_course_joined = TakenCourseService.get_course_taken_by_student(
                username, course_id
            )

            db.session.delete(taken_course)
            db.session.commit()
            return taken_course_joined

        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting program for student: {str(e)}"
