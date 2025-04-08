from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.spn_request_service import SPNRequestService

# Define a Blueprint for course records
spn_request_bp = Blueprint(
    "spn_request", __name__, url_prefix="/api/spn"
)

@spn_request_bp.rout("/", methods=["GET"])
@jwt_required
def get_all_spn():
    all_spns = SPNRequestService.get_spn_requests()
    return jsonify(all_spns)

@spn_request_bp.route("/<student_id>", methods=["GET"])
@jwt_required()
def get_student_spn_requests(student_id):
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400
        
        students_requests = SPNRequestService.get_spn_requests_by_student_id(student_id)

        return (
            jsonify(
                {
                    "message": f"SPN requests retrieved for user {student_id}",
                    "course_records": students_requests,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Error fetching requests: {str(e)}"}), 500

# Add course to the user's planned courses
@spn_request_bp.route("/add", methods=["POST"])
@jwt_required()  # Ensure the user is authenticated
def add_planned_course():
    data = request.get_json()
    username = data.get("username")
    course_id = data.get("course_id")
    semester = data.get("semester")
    season = semester.get("season")
    year = semester.get("year")
    sections = data.get("sections")
    reason = data.get("reason")

    if season == "spring":
        season = "1"
    elif season == "fall":
        season = "9"
    elif season == "winter":
        season = "0"
    elif season == "summer":
        season = "7"
    else:
        return jsonify({"error": f"Invalid semester: {semester}"})

    if not username or not course_id or len(sections) < 1:
        return jsonify({"message": "Missing required fields"}), 400

    try: #TODO: Handle SPN request for multiple sections at once.
        # Call the service function to add the course to the user's requests
        for section in sections:
            section_num = section.get("section_num")
            index = section.get("index")
            spn_request = SPNRequestService.insert_spn_request(
                username, course_id, section_num, index, season, year, reason
            )

        if isinstance(spn_request, str):
            return jsonify({"message", spn_request}), 500
        return jsonify(
            {"message": f"SPN request inserted", "spn_request": spn_request}
        )
    except Exception as e:
        return jsonify({"message": f"Error adding SPN request: {str(e)}"}), 500


@spn_request_bp.route("/drop", methods=["DELETE"])
@jwt_required()  # Ensure the user is authenticated
def drop_planned_course():
    print("dpc")
    data = request.get_json()
    username = data.get("username")
    course_id = data.get("course_id")

    if not username or not course_id:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        # Call the service function to remove the course from the user's planned courses
        response = SPNRequestService.delete_spn_request(spn_request_id)
        print(response)

        if isinstance(response, dict):
            return jsonify(response), 200  # Successfully removed
        else:
            return jsonify({"message": response}), 500  # Error message
    except Exception as e:
        return jsonify({"message": f"Error removing planned course: {str(e)}"}), 500