from flask import request
from services.user_service import UserService
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("/account", methods=["GET"])
@jwt_required()
def get_account():
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400
        account = UserService.get_account_by_username(username)
        if isinstance(account, str):
            return jsonify({"message": account}), 500
        return (
            jsonify(
                {
                    "message": f"Account for {username} successfully retrieved",
                    "account": {
                        "first_name": account.first_name,
                        "last_name": account.last_name,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500


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
        enroll_year = data.get("enroll_year")
        grad_year = data.get("grad_year")
        gpa = data.get("gpa")

        if not enroll_year or not grad_year:
            return jsonify({"message": f"Missing grad year or enroll year"}), 400

        updated_user_details = UserService.update_student_details(
            username=username, enroll_year=enroll_year, grad_year=grad_year, gpa=gpa
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
