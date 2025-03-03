import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from db import db
from models import Account
from routes.courses import course_bp
from routes.db_courses import db_course_bp
from routes.db_planned_courses import db_planned_courses_bp
from routes.users import users_bp
from routes.programs import programs_bp
from flask_cors import CORS
from db_service import DBService
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from jwt_helper import init_jwt

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

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    # Check in DB
    if not DBService.check_account_exists(username):
        return jsonify({"message": "Account doesn't exist, please register", "status": "error"}), 401

    # Check if credentials match
    account = DBService.get_account_by_username(username)
    if username == account.username and password == account.password:
        # Create JWT token
        access_token = create_access_token(identity=username)
        
        # Return token as part of the response
        return jsonify({"message": "Login successful", "status": "success", "access_token": access_token}), 200
    else:
        return jsonify({"message": "Invalid credentials", "status": "error"}), 401

app.register_blueprint(course_bp)
app.register_blueprint(db_course_bp)
app.register_blueprint(db_planned_courses_bp)
app.register_blueprint(programs_bp)
app.register_blueprint(users_bp)
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
host = os.getenv('DB_HOST', 'localhost')
dbname = os.getenv('DB_NAME')
port = os.getenv('PORT_NUM')
key = os.getenv('KEY')
print(username)
print(password)
print(host)
print(dbname)
print(port)
app.config["SQLALCHEMY_DATABASE_URI"] = f"mariadb+mariadbconnector://{username}:{password}@{host}:{port}/{dbname}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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
