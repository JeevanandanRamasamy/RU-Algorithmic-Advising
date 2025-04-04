from db import db
from models.program import Program
from sqlalchemy.exc import SQLAlchemyError

class ProgramService:
    # ------------------ PROGRAM OPERATIONS ------------------
    @staticmethod
    def get_programs(program_type):
        try:
            return Program.query.filter(program_type=program_type).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error getting programs: {str(e)}"

    @staticmethod
    def get_programs():
        try:
            return Program.query.all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error getting programs: {str(e)}"

    @staticmethod
    def get_program(program_id):
        try:
            return Program.query.filter(Program.program_id == program_id).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking program existence: {str(e)}"

    @staticmethod
    def check_program_exists(program_id):
        try:
            return db.session.query(
                db.exists().where(Program.program_id == program_id)
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking program existence: {str(e)}"

    @staticmethod
    def insert_program(program_data):
        """Insert a new program into the database."""
        try:
            new_program = Program(**program_data)
            db.session.add(new_program)
            db.session.commit()
            return new_program
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting program: {str(e)}"

    @staticmethod
    def delete_program(program_id):
        """Delete a program by its program_id."""
        try:
            program = Program.query.filter_by(program_id=program_id).first()
            if program:
                db.session.delete(program)
                db.session.commit()
                return f"Program {program_id} deleted successfully"
            else:
                return "Program not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting program: {str(e)}"
