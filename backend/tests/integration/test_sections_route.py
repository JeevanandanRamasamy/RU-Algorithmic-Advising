from app import create_app
import pytest
import sys
import os
from flask_jwt_extended import create_access_token


sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
)


@pytest.fixture
def client():
    """
    A test client for the Flask application.
    """
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture
def auth_header(frozen_time):
    """
    Fixture to create an authorization header with a JWT token for testing.
    """
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}
