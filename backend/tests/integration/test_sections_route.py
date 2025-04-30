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


# T50: Test successful saving of a schedule with valid sections and metadata
def test_save_schedule_success(client, register_user, auth_header, frozen_time):
    """
    Verifies that the API successfully saves a schedule when valid sections and metadata
    are provided. The test checks that the returned schedule data contains the correct
    information, including the schedule name, term, year, and username. It also validates
    that the sections are correctly saved and associated with the schedule, ensuring that
    each section includes the correct course ID, index number, and schedule ID.

    The test ensures that the response status is 200, a success message is returned,
    and the saved data matches the expected values.
    """
    payload = {
        "scheduleName": "My Spring Schedule",
        "term": "Spring",
        "year": 2025,
        "sections": [
            {"course_id": "01:198:111", "index_num": "12345"},
            {"course_id": "01:198:112", "index_num": "12346"},
        ],
    }

    # Post the new schedule
    response = client.post("/api/sections/schedule", json=payload, headers=auth_header)
    data = response.get_json()

    assert response.status_code == 200
    assert data["message"] == "Successfully saved new schedule"
    schedule = data["schedule"]["schedule"]
    sections = data["schedule"]["sections"]

    assert schedule["schedule_name"] == "My Spring Schedule"
    assert schedule["term"] == "spring"
    assert schedule["year"] == 2025
    assert schedule["username"] == "test"
    assert isinstance(schedule["schedule_id"], int)

    # Validate sections
    expected_sections = [
        {"course_id": "01:198:111", "index_num": "12345"},
        {"course_id": "01:198:112", "index_num": "12346"},
    ]
    assert len(sections) == len(expected_sections)
    for actual, expected in zip(sections, expected_sections):
        assert actual["course_id"] == expected["course_id"]
        assert actual["index_num"] == expected["index_num"]
        assert actual["schedule_id"] == schedule["schedule_id"]
