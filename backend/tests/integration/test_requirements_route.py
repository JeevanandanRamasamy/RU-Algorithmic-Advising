import pytest
import sys
import os
from flask_jwt_extended import create_access_token
from freezegun import freeze_time

# TESTS DO NOT WORK, TRIED TO FIX
# REPLACE AS YOU SEE FIT

sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
)
from backend.app import create_app


# Fixture for setting up a Flask test client
@pytest.fixture
def client():
    """
    Create a test client for the Flask application.
    """
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


# Fixture to freeze the time during tests
@pytest.fixture
def frozen_time():
    """
    Freeze time to a specific date and time for testing.
    """
    with freeze_time("2025-04-20 12:00:00"):
        yield


# Fixture to generate an authentication header for tests
@pytest.fixture
def auth_header(frozen_time):
    """
    Create an authorization header with a JWT token for testing.
    """
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


# Fixture to register a test user
@pytest.fixture
def register_user(client):
    """
    Register a test user for the API.
    """
    client.post(
        "/api/register",
        json={
            "username": "test",
            "password": "test_password",
            "first_name": "John",
            "last_name": "Doe",
        },
    )
    yield
    access_token = create_access_token(identity="test")
    client.delete(
        "/api/users/account",
        headers={"Authorization": f"Bearer {access_token}"},
    )


# T24: Test successful retrieval of course requirements string
def test_get_course_requirements_string(client):
    """
    Test the endpoint for getting course requirements as a string.
    """
    response = client.get("/api/users/requirements/string")
    data = response.get_json()

    assert response.status_code == 200
    assert data["message"] == "successfully retrieved course requirements"
    assert len(data["course_requirements_string"]) == 3165


# fixture for T25, add course records for success for missing requirements for planned courses
@pytest.fixture
def add_courses_records_success_get_missing_requirements_for_planned_courses(
    client, auth_header, frozen_time
):
    """
    Add course records for a user to test the missing requirements endpoint's success case.
    """
    # past
    client.post(
        "/api/users/course_record",
        json={"course_id": "01:198:111", "term": "Fall", "year": 2023, "grade": "A"},
        headers=auth_header,
    )

    # termless
    client.post(
        "/api/users/course_record",
        json={"course_id": "01:198:112"},
        headers=auth_header,
    )

    # future
    client.post(
        "/api/users/course_record",
        json={"course_id": "01:198:213", "term": "Fall", "year": 2026},
        headers=auth_header,
    )

    yield

    # Clean up the test data
    client.delete(
        "/api/users/course_record",
        json={"course_id": "01:198:111"},
        headers=auth_header,
    )

    client.delete(
        "/api/users/course_record",
        json={"course_id": "01:198:112"},
        headers=auth_header,
    )

    client.delete(
        "/api/users/course_record",
        json={"course_id": "01:198:213"},
        headers=auth_header,
    )


# T25: Test successful retrieval of missing requirements for future planned courses
def test_get_missing_requirements_for_planned_courses(
    client,
    register_user,
    auth_header,
    add_courses_records_success_get_missing_requirements_for_planned_courses,
):
    """
    Test the endpoint for getting missing requirements for planned courses.
    """
    response = client.get(
        "/api/users/requirements/planned-courses/missing",
        headers=auth_header,
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "courses_missing_requirements": {
            "01:198:213": {
                "requirement_string": '(\n  <span style="color:#32CD32;">01:198:112 DATA STRUCTURES</span>\n  OR <span style="color:#FF6347;">14:332:351 PROGRM METHODOLOGYII</span>\n)',
                "requirements_fulfilled": True,
            }
        },
        "message": "Successfully fetched courses with missing requirements",
    }


# fixture for T26, adds courses for testing failure for missing requirements
@pytest.fixture
def add_courses_records_failure_get_missing_requirements_for_planned_courses(
    client, auth_header, frozen_time
):
    """
    Add course records for a user to test the missing requirements endpoint's failure case.
    """
    client.post(
        "/api/users/course_record",
        json={"course_id": "01:198:213", "term": "Fall", "year": 2026},
        headers=auth_header,
    )

    yield

    # Clean up the test data
    client.delete(
        "/api/users/course_record",
        json={"course_id": "01:198:112"},
        headers=auth_header,
    )


# T26: Test retrieval of missing requirements when prerequisites are not fulfilled
def test_get_missing_requirements_for_planned_courses_missing(
    client,
    register_user,
    auth_header,
    add_courses_records_failure_get_missing_requirements_for_planned_courses,
):
    """
    Test the endpoint for getting missing requirements for planned courses when requirements are not fulfilled.
    """
    response = client.get(
        "/api/users/requirements/planned-courses/missing",
        headers=auth_header,
    )

    assert response.status_code == 200
    assert response.get_json() == {
        "courses_missing_requirements": {
            "01:198:213": {
                "requirement_string": '(\n  <span style="color:#FF6347;">01:198:112 DATA STRUCTURES</span>\n  OR <span style="color:#FF6347;">14:332:351 PROGRM METHODOLOGYII</span>\n)',
                "requirements_fulfilled": False,
            }
        },
        "message": "Successfully fetched courses with missing requirements",
    }
