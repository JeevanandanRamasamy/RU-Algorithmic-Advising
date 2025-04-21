from db import db
from models.course import Course
from sqlalchemy.exc import SQLAlchemyError
from models.course_record import CourseRecord
from sqlalchemy import func, desc, asc


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

    @staticmethod
    def get_most_popular_courses(n=3):
        """Return the n courses with highest enrollment counts."""
        try:
            results = (
                db.session.query(
                    CourseRecord.course_id,
                    func.count(CourseRecord.username).label('count')
                )
                .group_by(CourseRecord.course_id)
                .order_by(desc('count'))
                .limit(n)
                .all()
            )
            return [{"course_id": r.course_id, "count": int(r.count)} for r in results]
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving most popular courses: {str(e)}"

    @staticmethod
    def get_least_popular_courses(n=3):
        """Return the n courses with lowest enrollment counts."""
        try:
            results = (
                db.session.query(
                    CourseRecord.course_id,
                    func.count(CourseRecord.username).label('count')
                )
                .group_by(CourseRecord.course_id)
                .order_by(asc('count'))
                .limit(n)
                .all()
            )
            return [{"course_id": r.course_id, "count": int(r.count)} for r in results]
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving least popular courses: {str(e)}"