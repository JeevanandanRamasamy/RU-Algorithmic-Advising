from models.planned_course import PlannedCourse
from utils.semesters import generate_semesters
from db import db

# from datetime import datetime
from models.account import Account
from models.student_details import StudentDetails
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import tuple_


class UserService:
    # ------------------ ACCOUNT OPERATIONS ------------------
    @staticmethod
    def get_account_by_username(username):
        try:
            return Account.query.filter_by(username=username).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving account: {str(e)}"

    @staticmethod
    def check_account_exists(username):
        try:
            return db.session.query(
                db.exists().where(Account.username == username)
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking account existence: {str(e)}"

    @staticmethod
    def insert_new_account(account_data):
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
        try:
            account = Account.query.filter_by(username=username).first()
            if account:
                db.session.delete(account)
                db.session.commit()
                return f"Account {username} deleted successfully"
            else:
                return "Account not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting account: {str(e)}"

    @staticmethod
    def delete_all_accounts():
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
        try:
            return StudentDetails.query.filter_by(username=username).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving student details: {str(e)}"

    @staticmethod
    def update_student_details(username, enrolled_year, grad_year, gpa):
        try:
            if int(enrolled_year) >= int(grad_year):
                return "Enrolled year can not be the same as graduate year"
            student_details = StudentDetails.query.filter_by(username=username).first()
            if student_details:
                student_details.enrolled_year = enrolled_year
                student_details.grad_year = grad_year
                student_details.gpa = gpa
                semesters = generate_semesters(int(enrolled_year), grad_year)
                valid_terms = {(s["term"], s["year"]) for s in semesters}
                PlannedCourse.query.filter(
                    tuple_(PlannedCourse.term, PlannedCourse.year).notin_(valid_terms)
                ).delete(synchronize_session=False)
                db.session.commit()
                return student_details
            else:
                return "StudentDetails not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating account: {str(e)}"
