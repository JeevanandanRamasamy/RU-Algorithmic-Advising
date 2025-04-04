from db import db
from models.schedule_plan import SchedulePlan
from sqlalchemy.exc import SQLAlchemyError

class DBService:
    # ------------------ SCHEDULE PLAN OPERATIONS ------------------
    @staticmethod
    def get_schedule(username):
        """Retrieve all schedules associated with a student."""
        try:
            return SchedulePlan.query.filter_by(username=username).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving schedules: {str(e)}"

    @staticmethod
    def insert_schedule(schedule_data):
        """Insert a new schedule plan."""
        try:
            new_schedule = SchedulePlan(**schedule_data)
            db.session.add(new_schedule)
            db.session.commit()
            return new_schedule
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting schedule: {str(e)}"

    @staticmethod
    def delete_schedule(schedule_id):
        """Delete a schedule plan by its ID."""
        try:
            schedule = SchedulePlan.query.filter_by(schedule_id=schedule_id).first()
            if schedule:
                db.session.delete(schedule)
                db.session.commit()
                return f"Schedule {schedule_id} deleted successfully"
            else:
                return "Schedule not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting schedule: {str(e)}"

    # ------------------ GENERAL OPERATIONS ------------------
    @staticmethod
    def execute_raw_sql(query):
        """Execute a raw SQL query and return the result."""
        try:
            result = db.session.execute(query)
            return result.fetchall()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error executing query: {str(e)}"

    @staticmethod
    def commit_session():
        """Commit the current database session."""
        try:
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error committing session: {str(e)}"
