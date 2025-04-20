from backend.services.timeService import TimeService
from db import db
from models.section import Section
from models.schedule_plan import SchedulePlan
from sqlalchemy.exc import SQLAlchemyError
import datetime
from itertools import product
from typing import Dict, List


class SectionsService:
    # TODO: check naming for these courses
    @staticmethod
    def get_required_gap(c1, c2):
        groups = [
            {"BUSCH", "LIVINGSTON"},
            {"COLLEGE AVENUE", "C/D"},
        ]
        for group in groups:
            if c1 in group and c2 in group:
                return 30
        return 40

    @staticmethod
    def generate_all_valid_schedules():
        pass

    @staticmethod
    def has_conflict(meetings1, meetings2):
        for m1 in meetings1:
            for m2 in meetings2:
                if m1["day"] != m2["day"]:
                    continue

                start_gap = m2["start"] - m1["end"]
                end_gap = m1["start"] - m2["end"]

                if m1["campus"] == m2["campus"]:
                    if not (m1["end"] <= m2["start"] or m2["end"] <= m1["start"]):
                        return True
                else:
                    required_gap = SectionsService.get_required_gap(
                        m1["campus"], m2["campus"]
                    )
                    if (
                        -required_gap < start_gap < required_gap
                        or -required_gap < end_gap < required_gap
                    ):
                        return True
        return False

    def get_required_gap(c1: str, c2: str) -> int:
        groups = [
            {"Busch", "Livingston"},
            {"College Avenue", "C/D"},
        ]
        for group in groups:
            if c1 in group and c2 in group:
                return 30
        return 40

    def parse_time(t: str) -> int:
        return int(t[:2]) * 60 + int(t[2:])

    # TODO handle meeting day conflict
    def has_conflict(m1: List[dict], m2: List[dict]) -> bool:
        for a in m1:
            for b in m2:
                if a["day"] != b["day"]:
                    continue

                start1 = TimeService.parse_time(a["start_time"])
                end1 = TimeService.parse_time(a["end_time"])
                start2 = TimeService.parse_time(b["start_time"])
                end2 = TimeService.parse_time(b["end_time"])
                gap = TimeService.get_required_gap(a["campus"], b["campus"])

                if (start1 < end2 + gap and start1 >= start2) or (
                    start2 < end1 + gap and start2 >= start1
                ):
                    return True
        return False

    def generate_all_valid_schedules(
        checked_sections: Dict[str, List[str]],
        index_to_meeting_times_map: Dict[str, List[dict]],
    ) -> List[List[str]]:
        from itertools import product

        course_ids = list(checked_sections.keys())
        section_lists = [checked_sections[course_id] for course_id in course_ids]

        all_combinations = product(*section_lists)
        valid_schedules = []

        for combo in all_combinations:
            conflict = False
            for i in range(len(combo)):
                for j in range(i + 1, len(combo)):
                    sec1 = combo[i]
                    sec2 = combo[j]
                    if SectionsService.has_conflict(
                        index_to_meeting_times_map[sec1],
                        index_to_meeting_times_map[sec2],
                    ):
                        conflict = True
                        break
                if conflict:
                    break
            if not conflict:
                valid_schedules.append(list(combo))

        return valid_schedules

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
