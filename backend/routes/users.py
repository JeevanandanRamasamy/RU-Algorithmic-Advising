from flask import request
from services.db_service import DBService
from flask import Blueprint, jsonify

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("/program", methods=["POST"])
def insert_program_for_student():
    """
    API endpoint to insert a program for a student
    """
    try:
        data = request.get_json()
        username = data.get("username")
        program_id = data.get("program_id")
        if not username or not program_id:
            return jsonify({"error": "Missing username or program_id"}), 400

        student_program = DBService.insert_program_for_student(username, program_id)
        if isinstance(student_program, str):
            return jsonify({"error": student_program}), 500

        return (
            jsonify(
                {
                    "message": "Program inserted successfully",
                    "student_program": {
                        "username": student_program.username,
                        "program_id": student_program.program_id,
                    },
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
