from flask import Blueprint, request, jsonify
from services.user_service import UserService
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash

reset_password_bp = Blueprint("reset_password", __name__)  # Create a Blueprint object


@reset_password_bp.route("/api/validate_username", methods=["POST"])
def validate_username():
    """
    Validate if the username exists in the database.
    Returns a JSON response indicating whether the username is valid or not.
    """
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"message": "Username is required.", "status": "error"}), 400

    # Validation
    if not UserService.check_account_exists(username):
        return jsonify({"message": "User not found.", "status": "error"}), 404

    return jsonify({"message": "Username is valid.", "status": "success"}), 200


@reset_password_bp.route("/api/reset_password", methods=["POST"])
def reset_password():
    """
    Reset the password for a user account.
    Expects a JSON payload with the username and new password.
    Returns a JSON response indicating the success or failure of the operation.
    """
    data = request.json
    username = data.get("username")
    new_password = data.get("new_password")

    # Validation
    if not username or not new_password:
        return (
            jsonify(
                {
                    "message": "Username and new password are required.",
                    "status": "error",
                }
            ),
            400,
        )

    # Check if user exists
    if not UserService.check_account_exists(username):
        return jsonify({"message": "User not found.", "status": "error"}), 404

    # Update password
    try:
        account = UserService.get_account_by_username(username)
        account_data = {
            "username": username,
            "password": generate_password_hash(new_password),
            "first_name": account.first_name,
            "last_name": account.last_name,
            "role": account.role,
        }
        update_result = UserService.update_account(username, account_data)

        if update_result:
            return (
                jsonify({"message": "Password reset successful.", "status": "success"}),
                200,
            )
        else:
            return (
                jsonify({"message": "Failed to reset password.", "status": "error"}),
                500,
            )

    except SQLAlchemyError as e:
        return jsonify({"message": f"Database error: {str(e)}", "status": "error"}), 500
