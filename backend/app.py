import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from db import db
from models import Account
from flask_cors import CORS
from routes.users import users_bp
from routes.programs import programs_bp
from routes.courses import course_bp

load_dotenv()

app = Flask(__name__)
app.register_blueprint(course_bp)
app.register_blueprint(users_bp)
app.register_blueprint(programs_bp)

CORS(app)

# @app.after_request
# def add_cors_headers(response):
#     response.headers["Access-Control-Allow-Origin"] = "*"
#     response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
#     response.headers["Access-Control-Allow-Headers"] = "Content-Type"
#     return response


username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST", "localhost")
dbname = os.getenv("DB_NAME")
print(username)
print(password)
print(host)
print(dbname)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mariadb+mariadbconnector://{username}:{password}@{host}/{dbname}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

# Hardcoded username and password
USER_CREDENTIALS = {"username": "admin", "password": "password123"}


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if (
        username == USER_CREDENTIALS["username"]
        and password == USER_CREDENTIALS["password"]
    ):

        return jsonify({"message": "Login successful", "status": "success"}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "error"}), 401


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
