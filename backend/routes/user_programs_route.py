from flask import request
from services.user_program_service import UserProgramService
from services.db_service import DBService
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint("user_programs", __name__, url_prefix="/api/users/programs")


@users_bp.route("", methods=["GET"])
@jwt_required()
def get_program_for_student():
    try:
        username = get_jwt_identity()
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


@users_bp.route("", methods=["POST"])
@jwt_required()
def insert_program_for_student():
    """
    API endpoint to insert a program for a student
    """
    try:
        data = request.get_json()
        username = get_jwt_identity()
        program_id = data.get("program_id")
        if not username or not program_id:
            return jsonify({"error": "Missing username or program_id"}), 400

        student_program = UserProgramService.insert_program_for_student(
            username, program_id
        )
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


@users_bp.route("", methods=["DELETE"])
@jwt_required()
def delete_program_for_student():
    """
    API endpoint to delete a program for a student
    """
    try:
        data = request.get_json()
        username = get_jwt_identity()
        program_id = data.get("program_id")
        if not username or not program_id:
            return jsonify({"error": "Missing username or program_id"}), 400
        student_program = UserProgramService.delete_program_for_student(
            username, program_id
        )
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
