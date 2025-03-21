from flask import Flask, request, jsonify
from services.user_service import UserService
from services.db_service import DBService
from sqlalchemy.exc import SQLAlchemyError
from flask import Blueprint

register_bp = Blueprint("register", __name__)  # Create a Blueprint object


@register_bp.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    role = "student"  # Default role for all new users

    # Validation
    if not username or not password or not first_name or not last_name:
        return jsonify({"message": "All fields are required."}), 400

    if len(username) > 6:
        return (
            jsonify({"message": "Username must be at most 6 characters."}),
            400,
        )

    if len(password) < 6:
        return (
            jsonify(
                {
                    "message": "Password must be at least 6 characters.",
                }
            ),
            400,
        )

    # Check if username already exists
    if UserService.check_account_exists(username):
        return jsonify({"message": "Username already taken."}), 409

    # Insert into database
    account_data = {
        "username": username,
        "password": password,  # No hashing for simplicity
        "first_name": first_name,
        "last_name": last_name,
        "role": role,
    }

    result = UserService.insert_new_account(account_data)

    if isinstance(result, str):  # If DBService returns an error string
        return (
            jsonify(
                {
                    "message": result,
                }
            ),
            500,
        )

    return jsonify({"message": "Registration successful"}), 201
