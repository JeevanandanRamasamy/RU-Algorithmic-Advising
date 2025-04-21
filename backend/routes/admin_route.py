from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.spn_request_service import SPNRequestService
from services.course_service import CourseService
from services.user_service import UserService
from services.course_record_service import CourseRecordService
from datetime import datetime

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# — SPN: list & update —


@admin_bp.route("/spn", methods=["GET"])
@jwt_required()
def list_spn_requests():
    pending = request.args.get("pending", "true").lower() == "true"
    spns = SPNRequestService.get_spn_pending(pending)
    return jsonify([s.to_dict() for s in spns]), 200


@admin_bp.route("/spn", methods=["PUT"])
@jwt_required()
def update_spn_request():
    data = request.get_json()
    sid = data.get("student_id")
    cid = data.get("course_id")
    sec = data.get("section_num")
    raw_status = data.get("status", "")
    if not all([sid, cid, sec, raw_status]):
        return jsonify({"success": False, "message": "Missing required fields"}), 400

    # normalize to capital‑case
    status = raw_status.title()
    if status not in ("Pending", "Approved", "Denied"):
        return jsonify({"success": False, "message": "Invalid status"}), 400

    admin_id = get_jwt_identity()
    updated = SPNRequestService.update_spn_request(
        {"student_id": sid, "course_id": cid, "section_num": sec},
        {"status": status, "admin_id": admin_id, "timestamp": datetime.utcnow()},
    )
    if hasattr(updated, "to_dict"):
        out = updated.to_dict()
        out["success"] = True
        return jsonify(out), 200
    return jsonify({"success": False, "message": updated}), 400


# — Popularity —


@admin_bp.route("/courses/popular", methods=["GET"])
@jwt_required()
def popular_courses():
    top_n = int(request.args.get("top", 3))
    bot_n = int(request.args.get("bottom", 3))
    most = CourseService.get_most_popular_courses(top_n)
    least = CourseService.get_least_popular_courses(bot_n)
    return jsonify({"most_popular": most, "least_popular": least}), 200


# — Student directory & schedules —


@admin_bp.route("/students", methods=["GET"])
@jwt_required()
def list_students():
    q = request.args.get("q", "")
    students = UserService.search_students(q)
    # return basic info
    return (
        jsonify(
            [
                {
                    "username": s.username,
                    "first_name": s.first_name,
                    "last_name": s.last_name,
                }
                for s in students
            ]
        ),
        200,
    )


@admin_bp.route("/students/<string:student_id>/schedule", methods=["GET"])
@jwt_required()
def student_schedule(student_id):
    recs = CourseRecordService.get_all_course_records(student_id)
    return jsonify(recs), 200
