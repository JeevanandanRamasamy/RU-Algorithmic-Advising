from app import create_app
from backend.models.student_details import StudentDetails
from backend.services.course_record_service import CourseRecordService
import pytest
from app import create_app
from flask_jwt_extended import create_access_token
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify
from db import db
from freezegun import freeze_time


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
def register_user(client, frozen_time):
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


@pytest.fixture
def add_courses_records(client, auth_header, frozen_time):
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
        json={"course_id": "01:198:142", "term": "Fall", "year": 2026, "grade": "A"},
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
        json={"course_id": "01:198:142"},
        headers=auth_header,
    )


# T07
def test_get_course_records_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    response = client.get("/api/users/course_record", headers=auth_header)
    assert response.status_code == 200
    assert response.json == {
        "course_records": [
            {
                "course_info": {
                    "course_id": "01:198:111",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-111-introduction-to-computer-science",
                    "course_name": "INTRO COMPUTER SCI",
                    "credits": "4.0",
                },
                "term": "fall",
                "username": "test",
                "year": 2023,
            },
            {
                "course_info": {
                    "course_id": "01:198:112",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-112-data-structures",
                    "course_name": "DATA STRUCTURES",
                    "credits": "4.0",
                },
                "term": None,
                "username": "test",
                "year": None,
            },
            {
                "course_info": {
                    "course_id": "01:198:142",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-142-data-101-data-literacy",
                    "course_name": "DATA LITERACY",
                    "credits": "4.0",
                },
                "term": "fall",
                "username": "test",
                "year": 2026,
            },
        ],
        "message": " Course Records retrieved for user test",
    }


# T08
def test_get_course_records_with_terms_courses_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    response = client.get("/api/users/course_record/terms", headers=auth_header)

    assert response.status_code == 200
    assert response.json == {
        "course_records": [
            {
                "course_info": {
                    "course_id": "01:198:111",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-111-introduction-to-computer-science",
                    "course_name": "INTRO COMPUTER SCI",
                    "credits": "4.0",
                },
                "term": "fall",
                "username": "test",
                "year": 2023,
            },
            {
                "course_info": {
                    "course_id": "01:198:142",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-142-data-101-data-literacy",
                    "course_name": "DATA LITERACY",
                    "credits": "4.0",
                },
                "term": "fall",
                "username": "test",
                "year": 2026,
            },
        ],
        "message": " Course Records retrieved for user test",
    }


# T09
def test_get_taken_courses_courses_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    response = client.get("/api/users/course_record/taken", headers=auth_header)

    assert response.status_code == 200
    assert response.json == {
        "message": "Taken Courses retrieved for user test",
        "taken_courses": [
            {
                "course_info": {
                    "course_id": "01:198:111",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-111-introduction-to-computer-science",
                    "course_name": "INTRO COMPUTER SCI",
                    "credits": "4.0",
                },
                "term": "fall",
                "username": "test",
                "year": 2023,
            },
            {
                "course_info": {
                    "course_id": "01:198:112",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-112-data-structures",
                    "course_name": "DATA STRUCTURES",
                    "credits": "4.0",
                },
                "term": None,
                "username": "test",
                "year": None,
            },
        ],
    }


# T10
def test_get_termless_courses_courses_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    response = client.get("/api/users/course_record/termless", headers=auth_header)

    assert response.status_code == 200
    assert response.json == {
        "message": "Taken Courses retrieved for user test",
        "taken_courses": [
            {
                "course_id": "01:198:112",
                "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-112-data-structures",
                "course_name": "DATA STRUCTURES",
                "credits": "4.0",
            }
        ],
    }


# T11
def test_get_planned_courses_courses_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    response = client.get("/api/users/course_record/planned", headers=auth_header)

    assert response.status_code == 200
    assert response.json == {
        "message": "Planned Courses retrieved for user test",
        "planned_courses": [
            {
                "course_info": {
                    "course_id": "01:198:142",
                    "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-142-data-101-data-literacy",
                    "course_name": "DATA LITERACY",
                    "credits": "4.0",
                },
                "term": "fall",
                "username": "test",
                "year": 2026,
            }
        ],
    }


# T12-T13
@pytest.mark.parametrize(
    "payload,expected_status,expected_json",
    [
        # Missing course_id
        (
            {"term": "Fall", "year": 2023, "grade": "A"},
            400,
            {"message": "Missing username or course_id"},
        ),
        # Success (assuming services are mocked or DB setup properly)
        (
            {"course_id": "01:198:111", "term": "Fall", "year": 2023, "grade": "A"},
            201,
            {
                "course_record": {
                    "course_info": {
                        "course_id": "01:198:111",
                        "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-111-introduction-to-computer-science",
                        "course_name": "INTRO COMPUTER SCI",
                        # "credits": "4.0",
                    },
                    "term": "fall",
                    "username": "test",
                    "year": 2023,
                },
                "message": "Course 01:198:111 added for user test",
            },
        ),
    ],
)
def test_add_course_record(
    client,
    register_user,
    frozen_time,
    auth_header,
    payload,
    expected_status,
    expected_json,
):
    response = client.post(
        "/api/users/course_record", json=payload, headers=auth_header
    )

    assert response.status_code == expected_status
    assert response.get_json() == expected_json


# T14-T15
@pytest.mark.parametrize(
    "payload, expected_status, expected_response",
    [
        (
            {},
            400,
            {"message": "Missing username or course_id"},
        ),
        (
            {"course_id": "01:198:111"},
            500,
            {"message": "Course record not found"},
        ),
    ],
)
def test_remove_course_record_failure(
    client,
    frozen_time,
    register_user,
    auth_header,
    payload,
    expected_status,
    expected_response,
):
    response = client.delete(
        "/api/users/course_record",
        json=payload,
        headers=auth_header,
    )

    assert response.status_code == expected_status
    assert response.get_json() == expected_response


# T16
def test_remove_course_record_success(
    client, register_user, frozen_time, auth_header, add_courses_records
):
    response = client.delete(
        "/api/users/course_record",
        json={"course_id": "01:198:111"},
        headers=auth_header,
    )

    assert response.status_code == 202
    assert response.get_json() == {
        "message": "Course 01:198:111 removed for user test",
        "removed_course_record": {
            "course_id": "01:198:111",
            "grade": "A",
            "term": "fall",
            "username": "test",
            "year": 2023,
        },
    }


# T17
def test_update_course_record_none_added(
    client,
    register_user,
    frozen_time,
    auth_header,
):
    response = client.put(
        "/api/users/course_record",
        json={"course_id": "01:198:111", "term": "Fall", "year": 2023, "grade": "A"},
        headers=auth_header,
    )
    assert response.status_code == 404
    assert response.get_json() == {"message": "Course record not found"}


# T18-21
@pytest.mark.parametrize(
    "payload,expected_status,expected_json",
    [
        (
            {"term": "Fall", "year": 2023, "grade": "A"},
            400,
            {"message": "Missing username or course_id"},
        ),
        (
            {"course_id": "01:198:111", "year": 2023},
            400,
            {"message": "Missing term or year"},
        ),
        (
            {"course_id": "01:198:111", "term": "Fall"},
            400,
            {"message": "Missing term or year"},
        ),
        (
            {"course_id": "01:198:111", "term": "Fall", "year": 2023, "grade": "A"},
            200,
            {
                "message": "Course 01:198:111 updated  for user test",
                "updated_course_record": {
                    "course_info": {
                        "course_id": "01:198:111",
                        "course_link": "https://www.cs.rutgers.edu/academics/undergraduate/course-synopses/course-details/01-198-111-introduction-to-computer-science",
                        "course_name": "INTRO COMPUTER SCI",
                        "credits": "4.0",
                    },
                    "term": "fall",
                    "username": "test",
                    "year": 2023,
                },
            },
        ),
    ],
)
def test_update_course_record_courses_added(
    client,
    register_user,
    frozen_time,
    auth_header,
    add_courses_records,
    payload,
    expected_status,
    expected_json,
):
    response = client.put("/api/users/course_record", json=payload, headers=auth_header)

    assert response.status_code == expected_status
    assert response.get_json() == expected_json
