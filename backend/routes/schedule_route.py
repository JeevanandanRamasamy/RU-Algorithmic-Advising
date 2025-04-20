from flask import Blueprint, request, jsonify
from services.user_service import UserService
from sqlalchemy.exc import SQLAlchemyError

schedule_bp = Blueprint("Schedule", __name__, "/schedule")


@schedule_bp.route("/generate_schedules", methods=["POST"])
def generate_all_valid_schedules():
    data = request.json
    checked_sections = data.get("checked_sections")
    print(checked_sections)
