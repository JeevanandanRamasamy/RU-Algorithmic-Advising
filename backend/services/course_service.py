from db import db
from models.course import Course
from sqlalchemy.exc import SQLAlchemyError


class CourseService:
    # ------------------ COURSE OPERATIONS ------------------
    @staticmethod
    def get_course_prefix_from_subject(subject):
        pattern = f"%:{subject}:%"
        course = Course.query.filter(Course.course_id.like(pattern)).first()
        return course.course_id.split(":")[0]

    @staticmethod
    def get_course_string(course_id):
        try:
            course = CourseService.get_course_by_id(course_id)
            if course:
                return f"{course_id} {course.course_name if course.course_name else ''}"
            return course_id

        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course: {str(e)}"

    @staticmethod
    def get_course_by_id(course_id):
        """Retrieve a course by its course_id."""
        try:
            return Course.query.filter_by(course_id=course_id).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course: {str(e)}"

    @staticmethod
    def get_courses_by_ids(course_ids):
        """Retrieve courses by their course_ids."""
        try:
            return Course.query.filter(Course.course_id.in_(course_ids)).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving courses: {str(e)}"

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
