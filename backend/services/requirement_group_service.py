from db import db
from models.requirement_group import RequirementGroup
from sqlalchemy.exc import SQLAlchemyError


class RequirementGroupService:
    # ------------------ REQUIREMENT GROUP OPERATIONS ------------------
    @staticmethod
    def get_requirement_group_by_id(group_id):
        """Retrieve a requirement group by its group_id."""
        try:
            return RequirementGroup.query.filter_by(group_id=group_id).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving requirement group: {str(e)}"

    @staticmethod
    def get_requirement_group_by_program(program_id):
        """Retrieve all requirement groups associated with a program."""
        try:
            return RequirementGroup.query.filter_by(program_id=program_id).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving requirement groups: {str(e)}"

    @staticmethod
    def get_requirement_group_by_course(course_id):
        """Retrieve all requirement groups associated with a course."""
        try:
            return RequirementGroup.query.filter_by(course_id=course_id).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving requirement groups: {str(e)}"

    @staticmethod
    def get_child_requirement_groups(parent_group_id):
        """Retrieve all child requirement groups associated with a parent group."""
        try:
            return RequirementGroup.query.filter_by(
                parent_group_id=parent_group_id
            ).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving child requirement groups: {str(e)}"

    @staticmethod
    def insert_requirement_group(requirement_data):
        """Insert a new requirement group."""
        try:
            new_requirement = RequirementGroup(**requirement_data)
            db.session.add(new_requirement)
            db.session.commit()
            return new_requirement
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting requirement group: {str(e)}"

    @staticmethod
    def delete_requirement_group(group_id):
        """Delete a requirement group by its group_id."""
        try:
            requirement = RequirementGroup.query.filter_by(group_id=group_id).first()
            if requirement:
                db.session.delete(requirement)
                db.session.commit()
                return f"Requirement group {group_id} deleted successfully"
            else:
                return "Requirement group not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting requirement group: {str(e)}"
