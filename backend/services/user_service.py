from decimal import Decimal
from models.course import Course
from models.course_record import CourseRecord
from models.account import Account
from models.student_details import StudentDetails
from services.semesters_service import SemestersService
from db import db
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import tuple_


class UserService:
    """
    Service class for managing user-related operations.
    This includes retrieving, inserting, and deleting user accounts,
    as well as updating account details and credits.
    """

    # ------------------ ACCOUNT OPERATIONS ------------------
    @staticmethod
    def get_account_by_username(username):
        """
        Retrieve an account by username.
        """
        try:
            return Account.query.filter_by(username=username).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving account: {str(e)}"

    @staticmethod
    def check_account_exists(username):
        """
        Check if an account exists by username.
        """
        try:
            return db.session.query(
                db.exists().where(Account.username == username)
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking account existence: {str(e)}"

    @staticmethod
    def insert_new_account(account_data):
        """
        Insert a new account into the database.
        """
        try:
            new_account = Account(**account_data)
            db.session.add(new_account)
            db.session.commit()
            return new_account
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting account: {str(e)}"

    @staticmethod
    def update_account(username, new_data):
        """
        Update the account details for a given username.
        """
        try:
            account = Account.query.filter_by(username=username).first()
            if account:
                for key, value in new_data.items():
                    setattr(account, key, value)
                db.session.commit()
                return account
            else:
                return "Account not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating account: {str(e)}"

    @staticmethod
    def delete_account(username):
        """
        Delete an account by username.
        """
        try:
            account = Account.query.filter_by(username=username).first()
            if account:
                db.session.delete(account)
                db.session.commit()
            else:
                return "Account not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting account: {str(e)}"

    @staticmethod
    def delete_all_accounts():
        """
        Delete all accounts from the database.
        """
        try:
            Account.query.delete()
            db.session.commit()
            return "All accounts deleted successfully"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting all accounts: {str(e)}"

    # ------------------ STUDENT OPERATIONS ------------------
    @staticmethod
    def add_student_details(student_data):
        """
        Add student details to the database.
        """
        try:
            new_student = StudentDetails(**student_data)
            db.session.add(new_student)
            db.session.commit()
            return new_student
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error adding student details: {str(e)}"

    @staticmethod
    def delete_student_details(username):
        """
        Delete student details by username.
        """
        try:
            student = StudentDetails.query.filter_by(username=username).first()
            if student:
                db.session.delete(student)
                db.session.commit()
                return f"Student {username} deleted successfully"
            else:
                return "Student not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting student details: {str(e)}"

    @staticmethod
    def get_student_details(username):
        """
        Retrieve student details by username.
        """
        try:
            return StudentDetails.query.filter_by(username=username).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving student details: {str(e)}"

    @staticmethod
    def update_student_details(username, enroll_year, grad_year, gpa):
        """
        Update the student details for a given username.
        """
        try:
            if enroll_year >= grad_year:
                return "Enrolled year can not be the same as graduate year"
            student_details = StudentDetails.query.filter_by(username=username).first()
            if student_details:
                semesters = SemestersService.generate_semesters(enroll_year, grad_year)
                valid_terms = list({(s["term"], s["year"]) for s in semesters})
                CourseRecord.query.filter(
                    tuple_(CourseRecord.term, CourseRecord.year).notin_(valid_terms)
                ).delete(synchronize_session=False)
                student_details.enroll_year = enroll_year
                student_details.grad_year = grad_year
                if gpa:
                    student_details.gpa = float(gpa)
                db.session.commit()
                return student_details
            else:
                return "StudentDetails not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating account: {str(e)}"

    @staticmethod
    def search_students(query: str):
        """
        Return all student accounts whose username matches the query.
        """
        try:
            pattern = f"%{query}%"
            return Account.query.filter(
                Account.role == "student", Account.username.ilike(pattern)
            ).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error searching students: {str(e)}"

    @staticmethod
    def update_student_credits(username, change):
        """
        Update the credits_earned for a student.
        """
        try:
            student_details = StudentDetails.query.filter_by(username=username).first()
            if student_details:
                student_details.credits_earned += change
                db.session.commit()
                return student_details
            else:
                return "StudentDetails not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating account: {str(e)}"

    @staticmethod
    def update_taken_credits(username):
        """
        Update the credits_earned for a student by summing up the credits
        of all courses taken by the student, excluding future semesters.
        """
        try:
            student_details = UserService.get_student_details(username)
            grad_year = student_details.grad_year

            future_semesters = SemestersService.generate_future_semesters(grad_year)
            future_semester_set = {
                (sem["term"], sem["year"]) for sem in future_semesters
            }

            # Get all course records for the student
            course_records = (
                db.session.query(CourseRecord).filter_by(username=username).all()
            )

            total_credits = Decimal(0)

            for record in course_records:
                # Skip if it's a future course
                if (
                    record.term
                    and record.year
                    and (record.term, record.year) in future_semester_set
                ):
                    continue

                course = db.session.get(Course, record.course_id)
                if not course: # Skip if course not found
                    continue

                credits = course.credits
                if isinstance(credits, Decimal):
                    total_credits += credits # Sum up the credits

            student_details.credits_earned = total_credits
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating account: {str(e)}"
