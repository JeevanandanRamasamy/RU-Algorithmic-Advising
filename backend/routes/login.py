from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from services.user_service import UserService

# from services.db_service import DBService  # Assuming DBService is inside services
from werkzeug.security import check_password_hash

login_bp = Blueprint("login", __name__)


@login_bp.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # Check in DB
    if not UserService.check_account_exists(username):
        return (
            jsonify(
                {"message": "Account doesn't exist, please register", "status": "error"}
            ),
            401,
        )

    # Fetch user record
    account = UserService.get_account_by_username(username)

    # Check if account exists
    # if account:
    stored_pw = account.password

    # if stored_pw.startswith("pbkdf2:"):
    # Looks like a hashed password
    password_valid = check_password_hash(stored_pw, password)
    # else:
    #     # Fallback to plain text comparison
    #     password_valid = stored_pw == password

    # print(f"DB: {account.password}, Input: {password}")

    if password_valid:
        # Create JWT token
        access_token = create_access_token(identity=username)
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "status": "success",
                    "role": account.role,
                    "access_token": access_token,
                    "role": account.role
                }
            ),
            200,
        )

    # If no account or password check failed
    return jsonify({"message": "Invalid credentials", "status": "error"}), 401
