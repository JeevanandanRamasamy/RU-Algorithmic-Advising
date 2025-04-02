from flask import request
from services.user_service import UserService
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("/details", methods=["GET"])
@jwt_required()
def get_user_details():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400
        userDetails = UserService.get_student_details(username)
        if isinstance(userDetails, str):
            return jsonify({"message": userDetails}), 500
        return (
            jsonify(
                {
                    "message": f"Account Details for {username} successfully retrieved",
                    "user_details": userDetails,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500


@users_bp.route("/details", methods=["PUT"])
@jwt_required()
def update_user_details():
    try:
        data = request.get_json()
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400

        updated_user_details = UserService.update_student_details(
            username, data["enroll_year"], data["grad_year"], data["gpa"]
        )
        if isinstance(updated_user_details, str):
            return jsonify({"message": updated_user_details}), 500
        return (
            jsonify(
                {
                    "message": f"Account for {username} successfully updated",
                    "updated_user_details": updated_user_details,
                }
            ),
            201,
        )

    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500
