from flask import request
from backend.services.user_service import UserService
from services.db_service import DBService
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("/details", methods=["GET"])
@jwt_required()
def get_user_details():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"error": "Missing username"}), 400
        userDetails = UserService.get_student_details(username)
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
@jwt_required()
def update_user_details():
    try:
        data = request.get_json()
        username = get_jwt_identity()
        if not username:
            return jsonify({"error": "Missing username"}), 400
        fields = ["grad_date", "enroll_date", "gpa", "class_year"]

        new_data = {
            field: data.get(field) for field in fields if data.get(field) is not None
        }

        updated_user_details = UserService.update_student_details(username, new_data)
        if isinstance(updated_user_details, str):
            return jsonify({"error": updated_user_details}), 500
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
