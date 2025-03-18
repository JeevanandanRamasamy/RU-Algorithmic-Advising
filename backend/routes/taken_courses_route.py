from flask import request
from services.taken_course_service import TakenCourseService
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

taken_courses_bp = Blueprint("user_taken_courses", __name__, url_prefix="/api/users")


@taken_courses_bp.route("/taken_courses", methods=["GET"])
@jwt_required
def get_taken_courses():
    try:
        username = get_jwt_identity()

        if not username:
            return jsonify({"error": "Missing username"}), 400
        taken_courses = TakenCourseService.get_courses_taken_by_student()

        if isinstance(taken_courses, str):
            return jsonify({"error", taken_courses}), 500
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Courses retrieved for user {username}",
                    "taken_courses": taken_courses,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching taken courses: {str(e)}"}), 500


@taken_courses_bp.route("/taken_courses", methods=["POST"])
@jwt_required()
def add_taken_course():
    try:
        username = get_jwt_identity()
        data = request.get_json()

        if not username or "course_id" not in data:
            return jsonify({"error": "Missing username or course_id"}), 400

        course_id = data.get("course_id")

        result = TakenCourseService.add_course_for_student(username, course_id)

        if isinstance(result, str):
            return jsonify({"error": result}), 500

        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Course {course_id} added for user {username}",
                    "taken_course": result,
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": f"Error adding course: {str(e)}"}), 500


@taken_courses_bp.route("/taken_courses", methods=["DELETE"])
@jwt_required()
def remove_taken_course():
    try:
        username = get_jwt_identity()
        data = request.get_json()

        if not username or "course_id" not in data:
            return jsonify({"error": "Missing username or course_id"}), 400

        course_id = data["course_id"]

        result = TakenCourseService.remove_course_for_student(username, course_id)

        if isinstance(result, str):
            return jsonify({"error": result}), 500

        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Course {course_id} removed for user {username}",
                    "removed_course": result,
                }
            ),
            202,
        )
    except Exception as e:
        return jsonify({"error": f"Error removing course: {str(e)}"}), 500


@taken_courses_bp.route("/taken_courses", methods=["PUT"])
@jwt_required()
def update_taken_course():
    try:
        username = get_jwt_identity()
        data = request.get_json()

        if not username or "course_id" not in data or "new_course_id" not in data:
            return (
                jsonify({"error": "Missing username, course_id, or new_course_id"}),
                400,
            )

        course_id = data["course_id"]
        new_course_id = data["new_course_id"]

        result = TakenCourseService.update_course_for_student(
            username, course_id, new_course_id
        )

        if isinstance(result, str):
            return jsonify({"error": result}), 500

        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Course {course_id} updated to {new_course_id} for user {username}",
                    "updated_course": result,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Error updating course: {str(e)}"}), 500
