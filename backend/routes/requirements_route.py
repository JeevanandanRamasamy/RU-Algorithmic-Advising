from services.user_service import UserService
from services.requirement_service import RequirementService
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json

requirements_bp = Blueprint(
    "requirements", __name__, url_prefix="/api/users/requirements"
)

PREREQUISITES_FILE_PATH = os.path.join(
    os.path.dirname(__file__), "..", "data", "prerequisites.json"
)


@requirements_bp.route("string", methods=["GET"])
def get_course_requirements_string():
    try:
        if not os.path.exists(PREREQUISITES_FILE_PATH):
            return jsonify({"message": "Prerequisites file not found."}), 404

        with open(PREREQUISITES_FILE_PATH, "r") as json_file:
            course_requirements = json.load(json_file)
        return (
            jsonify(
                {
                    "message": "successfully retrieved course requirements",
                    "course_requirements_string": course_requirements,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching requirements : {str(e)}"}), 500


@requirements_bp.route("", methods=["GET"])
def get_course_requirements():
    try:
        course_id = request.args.get("course_id")
        prerequisuites = RequirementService.get_prerequisites_tree(course_id)
        return (
            jsonify(
                {
                    "message": "successfully retrieved course requirements",
                    "course_requirements": prerequisuites.to_dict(),
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching requirements : {str(e)}"}), 500


@requirements_bp.route("/planned-courses/missing", methods=["GET"])
@jwt_required()
def get_missing_requirements_for_planned_courses():
    username = get_jwt_identity()
    student_details = UserService.get_student_details(username=username)
    if isinstance(student_details, str):
        return jsonify({"message": student_details}), 500

    courses_missing_requirements = (
        RequirementService.fetch_courses_missing_requirements(student_details)
    )

    return (
        jsonify(
            {
                "message": "Successfully fetched courses with missing requirements",
                "courses_missing_requirements": courses_missing_requirements,
            }
        ),
        200,
    )


@requirements_bp.route("/planned-courses/group", methods=["GET"])
@jwt_required()
def get_requirements_for_planned_courses():
    username = get_jwt_identity()
    student_details = UserService.get_student_details(username=username)
    if isinstance(student_details, str):
        return jsonify({"message": student_details}), 500

    courses_missing_requirements = (
        RequirementService.fetch_courses_missing_requirements(student_details)
    )

    return (
        jsonify(
            {
                "message": "Successfully fetched courses with missing requirements",
                "courses_missing_requirements": courses_missing_requirements,
            }
        ),
        200,
    )
