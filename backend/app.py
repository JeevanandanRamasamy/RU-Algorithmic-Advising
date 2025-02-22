import os
from flask import Flask
from dotenv import load_dotenv
from db import db
from models import Account

load_dotenv()

app = Flask(__name__)
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
host = os.getenv('DB_HOST', 'localhost')
dbname = os.getenv('DB_NAME')
print(username)
print(password)
print(host)
print(dbname)
app.config["SQLALCHEMY_DATABASE_URI"] = f"mariadb+mariadbconnector://{username}:{password}@{host}/{dbname}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route("/")
def home():
    return "Welcome to  the RU Algorithmic Advising Web Server!"

@app.route('/check_db')
def check_db_connection():
    try:
        test_account = Account.query.first()
        if test_account:
            return f"Database connected successfully! First user: {test_account.username}"
        else:
            return "Database connected, but no users found."
    except Exception as e:
        return f"Database connection failed: {e}"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080, debug=True)
