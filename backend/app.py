import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# from services.user_service import UserService
from db import db
from models.account import Account
from routes.courses_route import course_bp
from routes.course_record_route import course_record_bp
from routes.programs_route import programs_bp
from routes.register_route import register_bp
from routes.login import login_bp
from routes.reset_password import reset_password_bp
from routes.verification import verification_bp
from routes.user_programs_route import users_programs_bp
from routes.users_route import users_bp
from routes.sections_route import section_bp
from routes.spn_route import spn_request_bp

from flask_cors import CORS

# from flask_jwt_extended import (
#    JWTManager,
#    create_access_token,
#    jwt_required,
#    get_jwt_identity,
# )
from datetime import timedelta
from jwt_helper import init_jwt


load_dotenv()

app = Flask(__name__)
CORS(app)


@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight successful"})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add(
            "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS"
        )
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type, Authorization"
        )
        return response, 200


# @app.after_request
# def add_cors_headers(response):
#     response.headers["Access-Control-Allow-Origin"] = "*"
#     response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
#     response.headers["Access-Control-Allow-Headers"] = "Content-Type"
#     return response


app.register_blueprint(course_bp)
app.register_blueprint(course_record_bp)
app.register_blueprint(programs_bp)
app.register_blueprint(users_bp)
app.register_blueprint(users_programs_bp)
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)
app.register_blueprint(verification_bp)
app.register_blueprint(section_bp)
app.register_blueprint(spn_request_bp)

username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST", "localhost")
dbname = os.getenv("DB_NAME")
port = os.getenv("PORT_NUM")
key = os.getenv("KEY")
print(username)
print(password)
print(host)
print(dbname)
print(port)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mariadb+mariadbconnector://{username}:{password}@{host}:{port}/{dbname}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = key
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)  # Tokens expire in 1 hour
db.init_app(app)
init_jwt(app)  # Initialize JWTManager


@app.route("/")
def home():
    return "Welcome to  the RU Algorithmic Advising Web Server!"


@app.route("/check_db")
def check_db_connection():
    try:
        test_account = Account.query.first()
        if test_account:
            return (
                f"Database connected successfully! First user: {test_account.username}"
            )
        else:
            return "Database connected, but no users found."
    except Exception as e:
        return f"Database connection failed: {e}"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
