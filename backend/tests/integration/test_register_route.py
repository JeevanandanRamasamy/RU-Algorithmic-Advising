import pytest
import sys
import os
from flask_jwt_extended import create_access_token

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app import create_app


@pytest.fixture
def client():
    """
    Create a test client for the Flask application.
    """
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


# T30: Test successful user registration
def test_register_success(client):
    """
    Test the registration route with valid data.
    """
    response = client.post(
        "/api/register",
        json={
            "username": "test",
            "password": "123456",
            "first_name": "Jane",
            "last_name": "Doe",
        },
    )

    assert response.status_code == 201
    assert response.get_json() == {
        "message": "Registration successful",
        "status": "success",
    }

    token = create_access_token(identity="test")
    client.delete(
        "/api/users/account",
        headers={"Authorization": f"Bearer {token}"},
    )


# T31: Test registration with missing required fields
def test_register_missing_fields(client):
    """
    Test the registration route with missing fields.
    """
    response = client.post(
        "/api/register",
        json={
            "username": "test2",
            "password": "123456",
        },
    )
    assert response.status_code == 400
    assert response.get_json()["message"] == "All fields are required."


# T32: Test registration with username longer than 6 characters
def test_register_username_too_long(client):
    """
    Test the registration route with a username that is too long.
    """
    response = client.post(
        "/api/register",
        json={
            "username": "longusername",  # > 6 characters
            "password": "123456",
            "first_name": "Alice",
            "last_name": "Smith",
        },
    )
    assert response.status_code == 400
    data = response.get_json()
    assert data["message"] == "Username must be at most 6 characters."
    assert data["status"] == "error"


# T33: Test registration with password shorter than 6 characters
def test_register_password_too_short(client):
    """
    Test the registration route with a password that is too short.
    """
    response = client.post(
        "/api/register",
        json={
            "username": "tiny",
            "password": "123",  # too short
            "first_name": "Bob",
            "last_name": "Brown",
        },
    )
    assert response.status_code == 400
    data = response.get_json()
    assert data["message"] == "Password must be at least 6 characters."
    assert data["status"] == "error"


# function to test T34. Adds temporary user
@pytest.fixture
def register_existing_user(client):
    """
    Fixture to register a user that already exists in the database.
    """
    client.post(
        "/api/register",
        json={
            "username": "exist",
            "password": "123456",
            "first_name": "Jane",
            "last_name": "Doe",
        },
    )
    yield
    token = create_access_token(identity="exist")
    client.delete(
        "/api/users/account",
        headers={"Authorization": f"Bearer {token}"},
    )


# T34: Test registration fails when username is already taken
def test_register_username_taken(client, register_existing_user):
    """
    Test the registration route with a username that is already taken.
    """
    response = client.post(
        "/api/register",
        json={
            "username": "exist",
            "password": "123456",
            "first_name": "Jane",
            "last_name": "Doe",
        },
    )

    assert response.status_code == 409
    data = response.get_json()
    assert data["message"] == "Username already taken."
