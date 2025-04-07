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


    # Check hashed password
    if account and check_password_hash(account.password, password):
        # Create JWT token
        access_token = create_access_token(identity=username)

        # Return token as part of the response
        return (
            jsonify(
                {
                    "message": "Login successful",
                    "status": "success",
                    "access_token": access_token,
                }
            ),
            200,
        )
    else:
        return jsonify({"message": "Invalid credentials", "status": "error"}), 401
