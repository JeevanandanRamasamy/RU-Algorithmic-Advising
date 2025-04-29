from datetime import datetime
from flask import request, jsonify
from services.user_service import UserService
from flask import Blueprint
from werkzeug.security import generate_password_hash  # pbkdf2:sha256 hashing method

register_bp = Blueprint("register", __name__)  # Create a Blueprint object


@register_bp.route("/api/check_username_exists", methods=["POST"])
def validate_username():
    data = request.json
    username = data.get("username")

    if not username:
        return jsonify({"message": "Username is required.", "status": "error"}), 400

    # Check if username already exists
    if UserService.check_account_exists(username):
        return jsonify({"message": "User already exists.", "status": "error"}), 409

    return jsonify({"message": "Username is valid.", "status": "success"}), 200


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
            jsonify(
                {"message": "Username must be at most 6 characters.", "status": "error"}
            ),
            400,
        )

    if len(password) < 6:
        return (
            jsonify(
                {
                    "message": "Password must be at least 6 characters.",
                    "status": "error",
                }
            ),
            400,
        )

    # Check if username already exists
    if UserService.check_account_exists(username):
        return jsonify({"message": "Username already taken."}), 409

    hashed_password = generate_password_hash(password)
    print("🔐 Hashed password:", hashed_password)
    print("📏 Hash length:", len(hashed_password))

    # Insert into database
    account_data = {
        "username": username,
        "password": hashed_password,
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

    current_year = datetime.now().year

    student_detail = {
        "username": username,
        "grad_year": current_year + 4,
        "enroll_year": current_year,
        "credits_earned": 0,
        "gpa": 0.00,
    }

    result = UserService.add_student_details(student_detail)

    ## Can add some validation to make sure student details is added

    return jsonify({"message": "Registration successful", "status": "success"}), 201
