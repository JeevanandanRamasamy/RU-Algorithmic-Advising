from backend.app import create_app
import pytest
import sys
import os
from unittest.mock import patch
from flask import Flask
from flask_jwt_extended import create_access_token
from freezegun import freeze_time


sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
)

USERNAME = "test"
PASSWORD = "test_password"


# Fixture to create a test client for making HTTP requests
@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


# Fixture to freeze the time during tests
@pytest.fixture
def frozen_time():
    with freeze_time("2025-04-20 12:00:00"):
        yield


# Fixture to generate an authentication header for tests
@pytest.fixture
def auth_header(frozen_time):
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


# Fixture to register a test user
@pytest.fixture
def register_user(client):
    client.post(
        "/api/register",
        json={
            "username": USERNAME,
            "password": PASSWORD,
            "first_name": "John",
            "last_name": "Doe",
        },
    )
    yield
    access_token = create_access_token(identity="test")
    client.delete(
        "/api/users/details",
        headers={"Authorization": f"Bearer {access_token}"},
    )


# T51
def test_reset_password_success(client, register_user):
    """
    Verifies that the password reset API works as expected. This test ensures that a
    user can successfully reset their password and then log in with the new password.

    The test checks the following:
    1. A successful password reset triggers a 200 status code and a confirmation message
       indicating that the password was reset successfully.
    2. After the password reset, the user is able to log in with the new password.

    The test ensures that the API behaves correctly by verifying the status code and
    message returned after a password reset and then testing the new credentials through a login.
    """
    payload = {
        "username": "test",
        "new_password": "new_secure_password123",
    }

    response = client.post("/api/reset_password", json=payload)
    data = response.get_json()

    assert response.status_code == 200
    assert data == {
        "message": "Password reset successful.",
        "status": "success",
    }

    response = client.post(
        "/api/login", json={"username": "test", "password": "new_secure_password123"}
    )

    assert response.status_code == 200
