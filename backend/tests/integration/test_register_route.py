import pytest
import sys
import os
from unittest.mock import patch
from flask import Flask
from flask_jwt_extended import create_access_token
from freezegun import freeze_time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app import create_app


from unittest.mock import patch
from flask import jsonify
from datetime import datetime


@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


# T30
def test_register_success(client):
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
        "/api/users/details",
        headers={"Authorization": f"Bearer {token}"},
    )


# T31
def test_register_missing_fields(client):
    response = client.post(
        "/api/register",
        json={
            "username": "test2",
            "password": "123456",
        },
    )
    assert response.status_code == 400
    assert response.get_json()["message"] == "All fields are required."


# T32
def test_register_username_too_long(client):
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


# T33
def test_register_password_too_short(client):
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


@pytest.fixture
def register_existing_user(client):
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
        "/api/users/details",
        headers={"Authorization": f"Bearer {token}"},
    )


# T34
def test_register_username_taken(client, register_existing_user):
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
