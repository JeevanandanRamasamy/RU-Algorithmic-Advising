from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from jwt_helper import init_jwt


#Import routes
from routes.courses import course_bp
from routes.db_courses import db_course_bp
from routes.db_planned_courses import db_planned_courses_bp
from routes.users import users_bp
from routes.programs import programs_bp
from routes.login import login_bp 

# Import database setup
from config.database import init_db
from models import Account

app = Flask(__name__)
CORS(app)

app.register_blueprint(course_bp)
app.register_blueprint(db_course_bp)
app.register_blueprint(db_planned_courses_bp)
app.register_blueprint(programs_bp)
app.register_blueprint(users_bp)
app.register_blueprint(login_bp)

# Initialize Database and JWT
init_db(app)
init_jwt(app)

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
