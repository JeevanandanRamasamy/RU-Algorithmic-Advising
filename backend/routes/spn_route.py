from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.spn_request import SPNRequest
from services.spn_request_service import SPNRequestService
from datetime import datetime, timezone

# Define a Blueprint for course records
spn_request_bp = Blueprint("spn_request", __name__, url_prefix="/api/spn")


@spn_request_bp.route("", methods=["GET"])
@jwt_required()
def get_spn_requests():
    """
    Get SPN requests based on the provided parameters.
    If a student_id is provided, fetch SPN requests for that student.
    If pending_param is provided, fetch SPN requests based on its value.
    If neither is provided, fetch all SPN requests.
    """
    student_id = request.args.get("student_id")
    pending_param = request.args.get("pending_param")

    try:
        if student_id:
            # Get SPNs for the specific student
            requests = SPNRequestService.get_spn_requests_by_student_id(student_id)
        elif pending_param is not None:
            pending = (
                pending_param.lower() == "true"
            )  # Lowercases pending_param, compares it to "true" and returns boolean
            requests = SPNRequestService.get_spn_pending(pending)
        else:
            # Get all SPNs
            requests = SPNRequestService.get_spn_requests()

        spn_list = [spn.to_dict() for spn in requests]

        return jsonify(spn_list), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching SPNs: {e}"}), 500


# Add course to the user's planned courses
@spn_request_bp.route("/add", methods=["POST"])
@jwt_required()  # Ensure the user is authenticated
def add_spn():
    """
    Add SPN requests for a student.
    Expects a JSON payload with the following fields:
    - username: The student's username
    - course_id: The course ID for the SPN request
    - semester: The semester details (season and year)
    - sections: A list of sections for the SPN request
    - reason: The reason for the SPN request
    """
    data = request.get_json()
    username = data.get("username")
    course_id = data.get("course_id")
    semester = data.get("semester")
    sections = data.get("sections")
    reason = data.get("reason") # reason having something is enforced since cannot submit without typing a reason

    if not username or not course_id or len(sections) < 1: # Sections existing implies semester existing 
        return jsonify({"message": "Missing required fields"}), 400
    
    try:
        season = semester.get("season").lower()
        year = semester.get("year")
        spn_requests = [
            SPNRequest(
                student_id=username,
                course_id=course_id,
                section_num=section.get("section_number"),
                index_num=section.get("index"),
                term=season,
                year=year,
                reason=reason,
            )
            for section in sections
        ] # Create SPNRequest objects for each section

        result = SPNRequestService.insert_spn_requests_best_effort(spn_requests)
        return jsonify(
            {
                "message": "SPN request processing complete.",
                "inserted": (
                    "All" if len(result["failed"]) == 0 else len(result["success"])
                ),
                "skipped": len(result["failed"]),
            }
        )
    except Exception as e:
        return jsonify({"message": f"Unexpected error: {str(e)}"}), 500


@spn_request_bp.route("/update", methods=["PUT"])
def update_spn_request():
    """
    Update an existing SPN request.
    Expects a JSON payload with the following fields:
    - student_id: The student's username
    - course_id: The course ID for the SPN request
    - section_num: The section number for the SPN request
    - year: The year of the SPN request
    - term: The term of the SPN request
    - reason: The new reason for the SPN request
    - status: The new status for the SPN request
    """
    data = request.get_json()
    data["timestamp"] = datetime.now(timezone.utc)
    identifier_keys = ["student_id", "course_id", "section_num", "year", "term"]
    identifier = {key: data.get(key) for key in identifier_keys} # Extract the identifier fields from the data

    try:
        # Call the service method to update the SPN request
        updated_spn = SPNRequestService.update_spn_request(identifier, data)

        if updated_spn == "SPN request not found":
            return jsonify({"message": "SPN request not found"}), 404
        else:
            return (
                jsonify(
                    {
                        "message": "SPN request updated successfully",
                        "success": "successful",
                    }
                ),
                200,
            )

    except Exception as e:
        return jsonify({"message": f"Unexpected error: {str(e)}"}), 500


@spn_request_bp.route("/drop", methods=["DELETE"])
@jwt_required()  # Ensure the user is authenticated
def drop_request():
    """
    Remove a course from the user's planned courses.
    Expects a JSON payload with the following fields:
    - student_id: The student's username
    - course_id: The course ID for the SPN request
    - section_num: The section number for the SPN request
    - year: The year of the SPN request
    - term: The term of the SPN request
    """
    data = request.get_json()
    identifier_keys = ["student_id", "course_id", "section_num", "year", "term"]
    identifier = {key: data.get(key) for key in identifier_keys}

    if not identifier.get("student_id") or not identifier.get("course_id"):
        return jsonify({"message": "Missing required fields"}), 400

    try:
        # Call the service function to remove the course from the user's planned courses
        response = SPNRequestService.delete_spn_request(identifier)

        if response.get("success"):
            return jsonify(response.get("msg")), 200  # Successfully removed
        else:
            return jsonify({"message": response.get("msg")}), 500  # Error message
    except Exception as e:
        return jsonify({"message": response.get("msg")}), 500
