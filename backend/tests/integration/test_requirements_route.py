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


@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture
def frozen_time():
    with freeze_time("2025-04-20 12:00:00"):
        yield


@pytest.fixture
def auth_header(frozen_time):
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def register_user(client):
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
        "/api/users/details",
        headers={"Authorization": f"Bearer {access_token}"},
    )


# T24
def test_get_course_requirements_string(client):
    response = client.get("/api/users/requirements/string")
    data = response.get_json()

    assert response.status_code == 200
    assert data["message"] == "successfully retrieved course requirements"
    assert len(data["course_requirements_string"]) == 3165


@pytest.fixture
def add_courses_records_success_get_missing_requirements_for_planned_courses(
    client, auth_header, frozen_time
):
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


# T25
def test_get_missing_requirements_for_planned_courses(
    client,
    register_user,
    auth_header,
    add_courses_records_success_get_missing_requirements_for_planned_courses,
):

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


@pytest.fixture
def add_courses_records_failure_get_missing_requirements_for_planned_courses(
    client, auth_header, frozen_time
):
    client.post(
        "/api/users/course_record",
        json={"course_id": "01:198:213", "term": "Fall", "year": 2026},
        headers=auth_header,
    )

    yield

    client.delete(
        "/api/users/course_record",
        json={"course_id": "01:198:112"},
        headers=auth_header,
    )


# T26
def test_get_missing_requirements_for_planned_courses_missing(
    client,
    register_user,
    auth_header,
    add_courses_records_failure_get_missing_requirements_for_planned_courses,
):
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
