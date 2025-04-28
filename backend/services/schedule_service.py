from db import db
from models.section import Section
from models.schedule_plan import SchedulePlan
from sqlalchemy.exc import SQLAlchemyError
import datetime


class ScheduleService:
    @staticmethod
    def get_required_gap(c1, c2):
        groups = [
            {"BUSCH", "LIVINGSTON"},
            {"COLLEGE AVENUE", "COOK/DOUGLASS", "DOWNTOWN"},
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
                    # Same campus: overlap check
                    if not (m1["end"] <= m2["start"] or m2["end"] <= m1["start"]):
                        return True
                else:
                    # Different campuses: need buffer
                    required_gap = ScheduleService.get_required_gap(
                        m1["campus"], m2["campus"]
                    )
                    if (
                        -required_gap < start_gap < required_gap
                        or -required_gap < end_gap < required_gap
                    ):
                        return True
        return False
