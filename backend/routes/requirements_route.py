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


@requirements_bp.route("", methods=["POST"])
def validate_requirements():
    data = request.get_json()

    courses_to_check = data.get("courses_to_be_validated", [])
    taken_courses = data.get("taken_courses", [])

    invalid_ids = RequirementService.validate(
        course_ids=courses_to_check, taken_ids=taken_courses
    )

    return jsonify({"invalid_ids": invalid_ids})
