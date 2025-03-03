from flask import request
from services.db_service import DBService
from flask import Blueprint, jsonify

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("/details", methods=["GET"])
def get_user_details():
    try:
        username = request.args.get("username")
        if not username:
            return jsonify({"error": "Missing username"}), 400
        userDetails = DBService.get_student_details(username)
        if isinstance(userDetails, str):
            return jsonify({"error": userDetails}), 500
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Account Details for {username} successfully retrieved",
                    "user_details": userDetails,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@users_bp.route("/details", methods=["PUT"])
def update_user_details():
    try:
        data = request.get_json()
        username = data.get("username")
        if not username:
            return jsonify({"error": "Missing username"}), 400
        fields = ["grad_date", "enroll_date", "gpa", "class_year"]

        new_data = {
            field: data.get(field) for field in fields if data.get(field) is not None
        }

        updated_user_details = DBService.update_student_details(username, new_data)
        if isinstance(updated_user_details, str):
            return jsonify({"error": updated_user_details}), 500
        print("here")
        print(update_user_details)
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Account for {username} successfully updated",
                    "updated_user_details": updated_user_details,
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@users_bp.route("/program", methods=["GET"])
def get_program_for_student():
    try:
        username = request.args.get("username")
        if not username:
            return jsonify({"error": "Missing username"}), 400
        student_programs = DBService.get_student_programs(username)
        if isinstance(student_programs, str):
            return jsonify({"error": student_programs}), 500
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Programs for {username} successfully retrieved",
                    "student_program": student_programs,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


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
        print(student_program)
        if isinstance(student_program, str):
            return jsonify({"error": student_program}), 500

        return (
            jsonify(
                {
                    "status": "success",
                    "message": "Program inserted successfully",
                    "student_program": student_program,
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500


@users_bp.route("/program", methods=["DELETE"])
def delete_program_for_student():
    """
    API endpoint to delete a program for a student
    """
    try:
        data = request.get_json()
        username = data.get("username")
        program_id = data.get("program_id")
        if not username or not program_id:
            return jsonify({"error": "Missing username or program_id"}), 400
        student_program = DBService.delete_program_for_student(username, program_id)
        if isinstance(student_program, str):
            return jsonify({"error": student_program}), 500
        return (
            jsonify(
                {
                    "status": "success",
                    "message": f"Program {program_id} was deleted from user {username} successfully",
                    "student_program": student_program,
                }
            ),
            202,
        )
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
