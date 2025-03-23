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


class DBService:
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

    # ------------------ DEGREE PLAN OPERATIONS ------------------
    @staticmethod
    def get_degree_plans(username):
        try:
            return DegreePlan.query.filter_by(username=username).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving degree plans: {str(e)}"

    @staticmethod
    def insert_degree_plan(plan_data):
        """Insert a new degree plan into the database."""
        try:
            new_plan = DegreePlan(**plan_data)
            db.session.add(new_plan)
            db.session.commit()
            return new_plan
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting degree plan: {str(e)}"

    @staticmethod
    def delete_degree_plan(plan_id):
        """Delete a degree plan by its ID."""
        try:
            plan = DegreePlan.query.filter_by(plan_id=plan_id).first()
            if plan:
                db.session.delete(plan)
                db.session.commit()
                return f"Degree plan {plan_id} deleted successfully"
            else:
                return "Degree plan not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting degree plan: {str(e)}"

    # ------------------ PLANNED COURSE OPERATIONS ------------------
    @staticmethod
    def get_planned_courses(plan_id):
        try:
            return PlannedCourse.query.filter_by(plan_id=plan_id).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving planned courses: {str(e)}"

    @staticmethod
    def insert_planned_course(planned_course_data):
        """Insert a planned course into a degree plan."""
        try:
            new_course = PlannedCourse(**planned_course_data)
            db.session.add(new_course)
            plan_id = planned_course_data.get("plan_id")
            degree_plan = DegreePlan.query.filter_by(plan_id=plan_id).first()
            if degree_plan:
                degree_plan.last_updated = datetime.now()
                db.session.add(degree_plan)
            db.session.commit()
            return new_course
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting planned course: {str(e)}"

    @staticmethod
    def delete_planned_course(plan_id, course_id):
        """Delete a planned course from a degree plan and update the last_updated timestamp."""
        try:
            planned_course = PlannedCourse.query.filter_by(
                plan_id=plan_id, course_id=course_id
            ).first()
            if planned_course:
                db.session.delete(planned_course)
                degree_plan = DegreePlan.query.filter_by(plan_id=plan_id).first()
                if degree_plan:
                    degree_plan.last_updated = datetime.now()
                    db.session.add(degree_plan)
                db.session.commit()
                return f"Planned course {course_id} deleted successfully from plan {plan_id}"
            else:
                return "Planned course not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting planned course: {str(e)}"

    @staticmethod
    def update_planned_course(plan_id, course_id, new_data):
        """Update a planned course by its plan_id and course_id."""
        try:
            planned_course = PlannedCourse.query.filter_by(
                plan_id=plan_id, course_id=course_id
            ).first()
            if planned_course:
                for key, value in new_data.items():
                    setattr(planned_course, key, value)
                db.session.commit()
                return planned_course
            else:
                return "Planned course not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating planned course: {str(e)}"

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

    # ------------------ SECTION OPERATIONS ------------------
    @staticmethod
    def get_sections_in_schedule(schedule_data):
        """Insert a new schedule plan."""
        try:
            new_schedule = SchedulePlan(**schedule_data)
            db.session.add(new_schedule)
            db.session.commit()
            return new_schedule
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving sections: {str(e)}"

    @staticmethod
    def insert_section(section_data):
        """Insert a new section into a schedule plan."""
        try:
            new_section = Section(**section_data)
            db.session.add(new_section)
            schedule_id = section_data.get("schedule_id")
            schedule_plan = SchedulePlan.query.filter_by(
                schedule_id=schedule_id
            ).first()
            if schedule_plan:
                schedule_plan.last_updated = datetime.now()
                db.session.add(schedule_plan)
            db.session.commit()
            return new_section
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting section: {str(e)}"

    @staticmethod
    def delete_section(schedule_id, course_id, section_num):
        """Delete a section from a schedule plan."""
        try:
            section = Section.query.filter_by(
                schedule_id=schedule_id, course_id=course_id, section_num=section_num
            ).first()
            if section:
                db.session.delete(section)
                schedule_plan = SchedulePlan.query.filter_by(
                    schedule_id=schedule_id
                ).first()
                if schedule_plan:
                    schedule_plan.last_updated = datetime.now()
                    db.session.add(schedule_plan)
                db.session.commit()
                return f"Section {section_num} of course {course_id} deleted successfully from schedule {schedule_id}"
            else:
                return "Section not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting section: {str(e)}"

    @staticmethod
    def update_section(schedule_id, course_id, section_num, new_data):
        """Update a section in a schedule plan."""
        try:
            section = Section.query.filter_by(
                schedule_id=schedule_id, course_id=course_id, section_num=section_num
            ).first()
            if section:
                for key, value in new_data.items():
                    setattr(section, key, value)
                db.session.commit()
                return section
            else:
                return "Section not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating section: {str(e)}"

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
