import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import timedelta
from dotenv import load_dotenv
from flask_jwt_extended import JWTManager


from db import db
from models.account import Account
from jwt_helper import init_jwt

# Import routes
from routes.courses_route import course_bp
from routes.course_record_route import course_record_bp
from routes.programs_route import programs_bp
from routes.register_route import register_bp
from routes.login_route import login_bp
from routes.reset_password_route import reset_password_bp
from routes.verification_route import verification_bp
from routes.user_programs_route import users_programs_bp
from routes.users_route import users_bp
from routes.sections_route import section_bp
from routes.spn_route import spn_request_bp
from routes.requirements_route import requirements_bp
from routes.degree_navigator_route import degree_navigator_bp
from routes.admin_route import admin_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Config
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
        f"mariadb+mariadbconnector://{username}:{password}@{host}/{dbname}"
    )
    app.config["JWT_SECRET_KEY"] = key
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Init
    db.init_app(app)
    init_jwt(app)

    # Register blueprints
    app.register_blueprint(course_bp)
    app.register_blueprint(course_record_bp)
    app.register_blueprint(programs_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(users_programs_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(verification_bp)
    app.register_blueprint(reset_password_bp)
    app.register_blueprint(requirements_bp)
    app.register_blueprint(spn_request_bp)
    app.register_blueprint(section_bp)
    app.register_blueprint(degree_navigator_bp)
    app.register_blueprint(admin_bp)

    # CORS preflight
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

    @app.route("/")
    def home():
        return "Welcome to the RU Algorithmic Advising Web Server!"

    @app.route("/api/db_check", methods=["GET"])
    def check_db_connection():
        """
        Check the database connection and return a message.
        """
        try:
            test_account = Account.query.first()
            if test_account:
                return jsonify({"status": "ok"}), 200
            else:
                return jsonify({"status": "error", "message": "No accounts found"}), 500
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    @app.route("/api/health", methods=["GET"])
    def health_check():
        """
        Health check endpoint to verify the server is running.
        """
        return jsonify({"status": "ok"}), 200

    jwt = JWTManager(app)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=8080, debug=True)
