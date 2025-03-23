from flask import Blueprint, request, jsonify
from services.db_service import DBService
from sqlalchemy.exc import SQLAlchemyError

reset_password_bp = Blueprint("reset_password", __name__)  # Create a Blueprint object

@reset_password_bp.route("/api/validate_username", methods=["POST"])
def validate_username():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"message": "Username is required.", "status": "error"}), 400

    # Validation
    if not DBService.check_account_exists(username):
        return jsonify({"message": "User not found.", "status": "error"}), 404
    
    return jsonify({"message": "Username is valid.", "status": "success"}), 200

@reset_password_bp.route("/api/reset_password", methods=["POST"])
def reset_password():
    data = request.json
    username = data.get("username")
    new_password = data.get("new_password")

    # Validation
    if not username or not new_password:
        return jsonify({"message": "Username and new password are required.", "status": "error"}), 400

    # Check if user exists
    if not DBService.check_account_exists(username):
        return jsonify({"message": "User not found.", "status": "error"}), 404
    
    # Update password
    try:
        account = DBService.get_account_by_username(username)
        account_data = {
            "username": username,
            "password": new_password,
            "first_name": account.first_name,
            "last_name": account.last_name,
            "role": account.role
        }
        update_result = DBService.update_account(username, account_data)

        if update_result:
            return jsonify({"message": "Password reset successful.", "status": "success"}), 200
        else:
            return jsonify({"message": "Failed to reset password.", "status": "error"}), 500

    except SQLAlchemyError as e:
        return jsonify({"message": f"Database error: {str(e)}", "status": "error"}), 500