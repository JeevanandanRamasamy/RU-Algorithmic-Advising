from db import db
from models.section import Section
from models.schedule_plan import SchedulePlan
from sqlalchemy.exc import SQLAlchemyError
import datetime


class SectionService:
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

    @staticmethod
    def get_sections_by_course_ids(course_ids):
        """Retrieve courses by their course_ids."""
        try:
            return Section.query.filter(Section.course_id.in_(course_ids)).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving courses: {str(e)}"
