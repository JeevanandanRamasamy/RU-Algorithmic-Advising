from db import db
from datetime import datetime
from models.course import Course
from models.course_record import CourseRecord
from sqlalchemy.exc import SQLAlchemyError


class CourseRecordService:
    @staticmethod
    def convert_courses_to_dict(courses):
        """Helper Method: Convert course records to a list of dictionaries."""
        return [
            {
                "username": course_record.username,
                "term": course_record.term,
                "year": course_record.year,
                "course_info": {
                    "course_id": course.course_id,
                    "course_name": course.course_name,
                    "credits": course.credits,
                    "course_link": course.course_link,
                },
            }
            for course_record, course in courses
        ]

    # ------------------ COURSE RECORD OPERATIONS ------------------
    @staticmethod
    def check_course_exists_for_student(username, course_id):
        try:
            return CourseRecord.query.filter(
                CourseRecord.username == username, CourseRecord.course_id == course_id
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking course for student: {str(e)}"

    @staticmethod
    def get_course_records(username):
        """Retrieve all course records from a user's degree plan."""
        try:
            courses = (
                db.session.query(CourseRecord, Course)
                .filter(CourseRecord.username == username)
                .join(Course, Course.course_id == CourseRecord.course_id)
                .all()
            )
            return CourseRecordService.convert_courses_to_dict(courses)
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course records: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_course_records_with_terms(username):
        """Retrieve all course records from a user's degree plan."""
        try:
            courses = (
                db.session.query(CourseRecord, Course)
                .filter(CourseRecord.username == username, CourseRecord.term != None)
                .join(Course, Course.course_id == CourseRecord.course_id)
                .all()
            )

            return CourseRecordService.convert_courses_to_dict(courses)
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course records: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_course_record_by_course_id(username, course_id):
        """Retrieve a course record by its username and course_id."""
        try:
            course = (
                db.session.query(CourseRecord, Course)
                .filter_by(username=username, course_id=course_id)
                .join(Course, Course.course_id == CourseRecord.course_id)
                .first()
            )
            print(course)
            return CourseRecordService.convert_courses_to_dict([course])[0]
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course record: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_course_record_by_term(username, term, year):
        """Retrieve course records from a user's degree plan by semester and year."""
        try:
            courses = (
                db.session.query(CourseRecord, Course)
                .filter(
                    CourseRecord.username == username,
                    CourseRecord.term == term,
                    CourseRecord.year == year,
                )
                .join(Course, Course.course_id == CourseRecord.course_id)
                .all()
            )
            return CourseRecordService.convert_courses_to_dict(courses)
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course records: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_past_course_records(username):
        """Retrieve all past course records from a user's degree plan."""
        try:
            # use datetime to filter past records
            current_date = datetime.now()
            terms = []
            if current_date.month > 5:
                terms.append("spring")
            if current_date.month > 8:
                terms.append("summer")
            if current_date.month == 12:
                terms.append("fall")

            if terms:
                courses = (
                    db.session.query(CourseRecord, Course)
                    .filter(
                        CourseRecord.username == username,
                        CourseRecord.term.in_(terms),
                        CourseRecord.year <= current_date.year,
                    )
                    .join(Course, Course.course_id == CourseRecord.course_id)
                    .all()
                )
            else:  # no terms completed in the current year
                courses = (
                    db.session.query(CourseRecord, Course)
                    .filter(
                        CourseRecord.username == username,
                        CourseRecord.year < current_date.year,
                    )
                    .join(Course, Course.course_id == CourseRecord.course_id)
                    .all()
                )
            return CourseRecordService.convert_courses_to_dict(
                courses
            ) + CourseRecordService.get_termless_course_records_joined(username)
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving past course records: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_future_course_records(username):
        """Retrieve all future course records from a user's degree plan."""
        try:
            # use datetime to filter future records
            current_date = datetime.now()
            terms = []
            if current_date.month < 9:
                terms.append("fall")
            if current_date.month < 6:
                terms.append("summer")
            if current_date.month == 1:
                terms.append("spring")

            if terms:
                courses = (
                    db.session.query(CourseRecord, Course)
                    .filter(
                        CourseRecord.username == username,
                        CourseRecord.term.in_(terms),
                        CourseRecord.year >= current_date.year,
                    )
                    .join(Course, Course.course_id == CourseRecord.course_id)
                    .all()
                )
            else:  # all terms completed in the current year
                courses = (
                    db.session.query(CourseRecord, Course)
                    .filter(
                        CourseRecord.username == username,
                        CourseRecord.year > current_date.year,
                    )
                    .join(Course, Course.course_id == CourseRecord.course_id)
                    .all()
                )
            return CourseRecordService.convert_courses_to_dict(courses)
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving future course records: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_termless_course_records(username):
        """Retrieve all course records from a user's degree plan that have no term assigned (e.g., AP or transfer credits)."""
        try:
            courses = (
                db.session.query(Course)
                .filter(CourseRecord.username == username, CourseRecord.term == None)
                .join(CourseRecord, Course.course_id == CourseRecord.course_id)
                .all()
            )
            return [course.to_dict() for course in courses]
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving termless course records: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_termless_course_records_joined(username):
        """Retrieve all course records from a user's degree plan that have no term assigned (e.g., AP or transfer credits)."""
        try:
            courses = (
                db.session.query(CourseRecord, Course)
                .filter(CourseRecord.username == username, CourseRecord.term == None)
                .join(Course, Course.course_id == CourseRecord.course_id)
                .all()
            )
            return CourseRecordService.convert_courses_to_dict(courses)
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving termless course records: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def insert_course_record(course_record_data):
        """Insert a course record into a user's degree plan."""
        try:
            print(course_record_data)

            new_course = CourseRecord(**course_record_data)
            db.session.add(new_course)
            db.session.commit()
            return CourseRecordService.get_course_record_by_course_id(
                course_record_data["username"], course_record_data["course_id"]
            )

            # return new_course
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting course record: {str(e)}"

    @staticmethod
    def update_course_record(username, course_id, new_data):
        """Update a course record by its username and course_id."""
        try:
            course_record = CourseRecord.query.filter_by(
                username=username, course_id=course_id
            ).first()
            print(course_record)
            if course_record:
                for key, value in new_data.items():
                    if hasattr(course_record, key):
                        setattr(course_record, key, value)
                    else:
                        return f"Invalid field: {key}"
                db.session.commit()
                return CourseRecordService.get_course_record_by_course_id(
                    username, course_id
                )
            else:
                return "Course record not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating course record: {str(e)}"

    @staticmethod
    def delete_course_record(username, course_id):
        """Delete a course record from a user's degree plan."""
        try:
            course_record = CourseRecord.query.filter_by(
                username=username, course_id=course_id
            ).first()
            if course_record:
                db.session.delete(course_record)
                db.session.commit()
                return course_record
            else:
                return "Course record not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting course record: {str(e)}"

    @staticmethod
    def delete_all_course_records(username):
        """Delete all course records from a user's degree plan."""
        try:
            course_records = CourseRecord.query.filter_by(username=username).all()
            if not course_records:
                return "No course records found for this user"
            for course_record in course_records:
                db.session.delete(course_record)
            db.session.commit()
            return "All course records deleted successfully"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting course records: {str(e)}"
