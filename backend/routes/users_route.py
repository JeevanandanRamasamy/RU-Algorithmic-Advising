from flask import request
from services.user_service import UserService
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


@users_bp.route("/account", methods=["GET"])
@jwt_required()
def get_account():
    """
    Get the account information of the logged-in user.
    Returns:
        JSON response with account information or error message.
    """
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
    

@users_bp.route("/account", methods=["PUT"])
@jwt_required()
def update_account():
    """Update the account information of the logged-in user."""
    try:
        data = request.get_json()
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        password = data.get("password")

        new_account = {"first_name":first_name, "last_name":last_name}
        if password and len(password) >= 6:
            new_account["password"] = generate_password_hash(password)

        updated_account = UserService.update_account(
            username=username,
            new_data=new_account
        )
        if isinstance(updated_account, str):
            return jsonify({"message": updated_account}), 500
        return (
            jsonify(
                {
                    "message": f"Account for {username} successfully updated",
                    "updated_account": {
                        "first_name": updated_account.first_name,
                        "last_name": updated_account.last_name
                    },
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500


@users_bp.route("/account", methods=["DELETE"])
@jwt_required()
def delete_account():
    """Delete the account of the logged-in user."""
    try:
        username = get_jwt_identity()
        if not username:
            return jsonify({"message": "Missing username"}), 400
        deleted_account = UserService.delete_account(username)
        if isinstance(deleted_account, str):
            return jsonify({"message": deleted_account}), 500
        return (
            jsonify(
                {
                    "message": f"Account for {username} successfully deleted",
                    "deleted_account": deleted_account,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500


@users_bp.route("/details", methods=["GET"])
@jwt_required()
def get_user_details():
    """
    Get the user details of the logged-in user.
    Returns:
        JSON response with user details or error message.
    """
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
    """Update the user details of the logged-in user."""
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
