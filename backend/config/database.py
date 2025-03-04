import os
from dotenv import load_dotenv
from db import db
from datetime import timedelta

# Load environment variables
load_dotenv(dotenv_path=".env")

# Fetch database credentials from environment variables
username = os.getenv("DB_USERNAME")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST", "localhost")
dbname = os.getenv("DB_NAME")
port = os.getenv("PORT_NUM")
key = os.getenv("KEY")

# Database Configuration Dictionary
DB_CONFIG = {
    "SQLALCHEMY_DATABASE_URI": f"mariadb+mariadbconnector://{username}:{password}@{host}:{port}/{dbname}",
    "SQLALCHEMY_TRACK_MODIFICATIONS": False,
    "JWT_SECRET_KEY": key,
    "JWT_ACCESS_TOKEN_EXPIRES": timedelta(hours=1),  # Tokens expire in 1 hour
}

def init_db(app):
    """Initialize the database with the app."""
    app.config.update(DB_CONFIG)
    db.init_app(app)
