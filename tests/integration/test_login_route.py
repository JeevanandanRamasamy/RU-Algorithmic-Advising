import pytest
import sys
import os
from unittest.mock import patch
from flask import Flask
from flask_jwt_extended import create_access_token
from freezegun import freeze_time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture
def register_user(client):
    client.post(
        "/api/register",
        json={
            "username": "test",
            "password": "123456",  # real password for login test
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


# T27
def test_login_correct_password(client, register_user):
    response = client.post(
        "/api/login", json={"username": "test", "password": "123456"}
    )

    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, dict)
    assert "access_token" in data
    assert data["message"] == "Login successful"
    assert data["role"] == "student"


# T28
def test_login_unknown_user_password(client, register_user):
    response = client.post(
        "/api/login", json={"username": "unknown", "password": "178"}
    )

    assert response.status_code == 401
    data = response.get_json()
    assert isinstance(data, dict)
    assert data == {
        "message": "Account doesn't exist, please register",
        "status": "error",
    }


# T29
def test_login_incorrect_password(client, register_user):
    response = client.post(
        "/api/login", json={"username": "nyc14", "password": "wrong_password"}
    )

    assert response.status_code == 401
    data = response.get_json()
    assert isinstance(data, dict)
    assert data == {
        "message": "Invalid credentials",
        "status": "error",
    }
