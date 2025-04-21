from services.semesters_service import SemestersService
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.course_record_service import CourseRecordService
from services.course_service import CourseService
from services.user_service import UserService
import decimal

# Define a Blueprint for course records
course_record_bp = Blueprint(
    "course_record", __name__, url_prefix="/api/users/course_record"
)


@course_record_bp.route("", methods=["GET"])
@jwt_required()
def get_course_records():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400

        course_records = CourseRecordService.get_course_records(username)
        if isinstance(course_records, str):
            return jsonify({"message": course_records}), 500

        return (
            jsonify(
                {
                    "message": f" Course Records retrieved for user {username}",
                    "course_records": course_records,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching taken courses: {str(e)}"}), 500


@course_record_bp.route("terms", methods=["GET"])
@jwt_required()
def get_course_records_with_terms():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400

        course_records = CourseRecordService.get_course_records_with_terms(username)
        if isinstance(course_records, str):
            return jsonify({"message", course_records}), 500

        return (
            jsonify(
                {
                    "message": f" Course Records retrieved for user {username}",
                    "course_records": course_records,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching taken courses: {str(e)}"}), 500


@course_record_bp.route("taken", methods=["GET"])
@jwt_required()
def get_taken_courses():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400

        taken_courses = CourseRecordService.get_past_course_records(username)
        if isinstance(taken_courses, str):
            return jsonify({"message", taken_courses}), 500

        return (
            jsonify(
                {
                    "message": f"Taken Courses retrieved for user {username}",
                    "taken_courses": taken_courses,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching taken courses: {str(e)}"}), 500


@course_record_bp.route("termless", methods=["GET"])
@jwt_required()
def get_termless_courses():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400

        taken_courses = CourseRecordService.get_termless_course_records(username)
        if isinstance(taken_courses, str):
            return jsonify({"message", taken_courses}), 500

        return (
            jsonify(
                {
                    "message": f"Taken Courses retrieved for user {username}",
                    "taken_courses": taken_courses,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching taken courses: {str(e)}"}), 500


@course_record_bp.route("planned", methods=["GET"])
@jwt_required()
def get_planned_courses():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400

        planned_courses = CourseRecordService.get_future_course_records(username)
        if isinstance(planned_courses, str):
            return jsonify({"message", planned_courses}), 500

        return (
            jsonify(
                {
                    "message": f"Planned Courses retrieved for user {username}",
                    "planned_courses": planned_courses,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching planned courses: {str(e)}"}), 500


@course_record_bp.route("", methods=["POST"])
@jwt_required()
def add_course_record():
    try:
        username = get_jwt_identity()
        data = request.get_json()
        if not username or "course_id" not in data:
            return jsonify({"message": "Missing username or course_id"}), 400
        course_id = data.get("course_id")
        # if "term" not in data or "year" not in data:
        #     return jsonify({"message": "Missing term or year"}), 400
        term = data.get("term")
        year = data.get("year")
        grade = data.get("grade") if "grade" in data else None

        result = CourseRecordService.insert_course_record(
            {
                "username": username,
                "course_id": course_id,
                "term": term,
                "year": year,
                "grade": grade,
            }
        )
        if isinstance(result, str):
            return jsonify({"message": result}), 500

        course = CourseService.get_course_by_id(course_id)
        if isinstance(course, str):
            return jsonify({"message": course}), 500

        UserService.update_taken_credits(username)

        return (
            jsonify(
                {
                    "message": f"Course {course_id} added for user {username}",
                    "course_record": result,
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"message": f"Error adding course: {str(e)}"}), 500


@course_record_bp.route("", methods=["DELETE"])
@jwt_required()
def remove_course_record():
    try:
        username = get_jwt_identity()
        data = request.get_json()
        if not username or "course_id" not in data:
            return jsonify({"message": "Missing username or course_id"}), 400
        course_id = data.get("course_id")

        course_record = CourseRecordService.delete_course_record(username, course_id)
        if isinstance(course_record, str):
            return jsonify({"message": course_record}), 500

        course = CourseService.get_course_by_id(course_id)
        if isinstance(course, str):
            return jsonify({"message": course}), 500

        UserService.update_taken_credits(username)

        return (
            jsonify(
                {
                    "message": f"Course {course_id} removed for user {username}",
                    "removed_course_record": course_record,
                }
            ),
            202,
        )
    except Exception as e:
        return jsonify({"message": f"Error removing course: {str(e)}"}), 500


@course_record_bp.route("", methods=["PUT"])
@jwt_required()
def update_course_record():
    try:
        username = get_jwt_identity()
        data = request.get_json()
        if not username or "course_id" not in data:
            return jsonify({"message": "Missing username or course_id"}), 400
        course_id = data.get("course_id")
        if "term" not in data or "year" not in data:
            return jsonify({"message": "Missing term or year"}), 400
        term = data.get("term")
        year = data.get("year")
        grade = data.get("grade") if "grade" in data else None
        if not username or "course_id" not in data:
            return (
                jsonify({"message": "Missing username, course_id, or new_course_id"}),
                400,
            )

        result = CourseRecordService.update_course_record(
            username=username,
            course_id=course_id,
            new_data={
                "term": term,
                "year": year,
                "grade": grade,
            },
        )

        if isinstance(result, str):
            return jsonify({"message": result}), 500

        UserService.update_taken_credits(username)

        return (
            jsonify(
                {
                    "message": f"Course {course_id} updated  for user {username}",
                    "updated_course_record": result,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error updating course: {str(e)}"}), 500
