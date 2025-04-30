from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from services.user_service import UserService
from werkzeug.security import check_password_hash

login_bp = Blueprint("login", __name__)


@login_bp.route("/api/login", methods=["POST"])
def login():
    """
    API endpoint for user login.
    Expects a JSON payload with "username" and "password".
    Returns a JWT token if login is successful.
    """
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
    if account:
        stored_pw = account.password
        password_valid = check_password_hash(stored_pw, password) # Check if password matches with hashed

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
                    }
                ),
                200,
            )

    # If no account or password check failed
    return jsonify({"message": "Invalid credentials", "status": "error"}), 401
