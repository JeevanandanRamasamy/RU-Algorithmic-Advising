from flask import Flask, request, jsonify
from services.db_service import DBService
from sqlalchemy.exc import SQLAlchemyError
from flask import Blueprint

register_bp = Blueprint("register", __name__) # Create a Blueprint object

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
        return jsonify({"message": "All fields are required.", "status": "error"}), 400

    # if len(username) > 6:
    #     return jsonify({"message": "Username must be at most 6 characters.", "status": "error"}), 400

    # if len(password) < 6:
    #     return jsonify({"message": "Password must be at least 6 characters.", "status": "error"}), 400

    # Check if username already exists
    if DBService.check_account_exists(username):
        return jsonify({"message": "Username already taken.", "status": "error"}), 409

    # Insert into database
    account_data = {
        "username": username,
        "password": password,  # No hashing for simplicity
        "first_name": first_name,
        "last_name": last_name,
        "role": role
    }
    
    result = DBService.insert_new_account(account_data)


    if isinstance(result, str):  # If DBService returns an error string
        return jsonify({"message": result, "status": "error"}), 500

    student_detail = {
    "username" : username,
    "grad_date": 2025,
    "enroll_date": 2025,
    "credits_earned": 0,
    "gpa": 0.00,
    "class_year": "Freshman"
    }

    result = DBService.add_student_details(student_detail)

    ## Can add some validation to make sure student details is added
    print(result)

    return jsonify({"message": "Registration successful", "status": "success"}), 201
