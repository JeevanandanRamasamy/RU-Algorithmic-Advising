from services.program_service import ProgramService
from services.user_service import UserService
from db import db
# from datetime import datetime
from models.student_details import StudentDetails
from models.program import Program
from models.student_program import StudentProgram
from sqlalchemy.exc import SQLAlchemyError


class UserProgramService:
    @staticmethod
    def get_student_programs(username):
        try:
            return (
                Program.query.join(
                    StudentProgram, Program.program_id == StudentProgram.program_id
                )
                .filter(StudentProgram.username == username)
                .all()
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving student programs: {str(e)}"

    @staticmethod
    def get_students_in_program(program_id):
        try:
            return (
                StudentDetails.query.join(
                    StudentProgram, StudentDetails.username == StudentProgram.username
                )
                .filter(StudentProgram.program_id == program_id)
                .all()
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving students in program: {str(e)}"

    @staticmethod
    def insert_program_for_student(username, program_id):

        try:
            if not UserService.check_account_exists(username):
                return f"User account not found"

            program = ProgramService.get_program(program_id)

            if not program:
                return f"Program not found"

            if UserProgramService.check_program_exists_for_student(
                username, program_id
            ):
                return f"Student has already added program"

            student_program = StudentProgram(username=username, program_id=program_id)

            db.session.add(student_program)
            db.session.commit()

            return program

        except SQLAlchemyError as e:

            db.session.rollback()

            return f"Error inserting program for student: {str(e)}"

    @staticmethod
    def delete_program_for_student(username, program_id):
        try:
            if not UserService.check_account_exists(username):
                return f"User account not found"

            program = ProgramService.get_program(program_id)
            if not program:
                return f"Program not found"

            student_program = (
                db.session.query(StudentProgram)
                .filter_by(username=username, program_id=program_id)
                .first()
            )
            if not student_program:
                return "Program not found for the student."

            db.session.delete(student_program)
            db.session.commit()
            return program
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting inserting program for student: {str(e)}"

    @staticmethod
    def check_program_exists_for_student(username, program_id):
        try:
            return StudentProgram.query.filter(
                StudentProgram.username == username,
                StudentProgram.program_id == program_id,
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking program for student: {str(e)}"
