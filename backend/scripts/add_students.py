import sys
import os

# Add backend/ to sys.path so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
import pytest
from app import create_app
from flask_jwt_extended import create_access_token
from freezegun import freeze_time

app = create_app()


# Fixture to create a test client for making HTTP requests
@pytest.fixture
def client():
    """
    Create a test client for the Flask application.
    """
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


# Fixture to register a test user
@pytest.fixture
def register_user(client):
    """
    Register a test user before running the tests.
    """
    client.post(
        "/api/register",
        json={
            "username": "test1",
            "password": "123456",
            "first_name": "John",
            "last_name": "Doe",
        },
    )

    client.post(
        "/api/register",
        json={
            "username": "test2",
            "password": "123456",
            "first_name": "John",
            "last_name": "Doe",
        },
    )


def test_add_students(register_user):
    pass
