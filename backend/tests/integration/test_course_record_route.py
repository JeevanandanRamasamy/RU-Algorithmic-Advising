from app import create_app
import pytest
from app import create_app
from flask_jwt_extended import create_access_token
from freezegun import freeze_time


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


# Fixture to freeze the time during tests
@pytest.fixture
def frozen_time():
    """
    Freeze time for the duration of the test.
    """
    with freeze_time("2025-04-20 12:00:00"):
        yield


# Fixture to generate an authentication header for tests
@pytest.fixture
def auth_header(frozen_time):
    """
    Create an authorization header with a JWT token for the test user.
    """
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


# Fixture to register a test user
@pytest.fixture
def register_user(client, frozen_time):
    """
    Register a test user before running the tests.
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


# Fixture to add course records for a test user
@pytest.fixture
def add_courses_records(client, auth_header, frozen_time):
    """
    Add course records for the test user before running the tests.
    This includes past, termless, and future courses.
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
        json={"course_id": "01:198:142", "term": "Fall", "year": 2026, "grade": "A"},
        headers=auth_header,
    )

    yield

    # Cleanup: remove the added course records after the tests
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
    """
    This test checks if the course records are returned correctly
    after adding them to the database.
    """
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
    """
    This test checks if the course records with terms are returned correctly
    after adding them to the database.
    """
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
# Test: Get taken courses
def test_get_taken_courses_courses_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    """
    This test checks if the taken courses are returned correctly
    after adding them to the database.
    """
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
# Test: Get termless courses
def test_get_termless_courses_courses_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    """
    Test the retrieval of termless courses for a user.
    """
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
# Test: Get planned courses
def test_get_planned_courses_courses_added(
    client, auth_header, register_user, frozen_time, add_courses_records
):
    """
    Test the retrieval of planned courses for a user.
    """
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
# Test: Add a new course record with different payloads
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
                        "credits": "4.0",
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
    """
    Test the addition of course records for a user.
    """
    response = client.post(
        "/api/users/course_record", json=payload, headers=auth_header
    )
    assert response.status_code == expected_status
    assert response.get_json() == expected_json


# T14-T15
# Test: Add a new course record with different payloads
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
    """
    Test the failure cases for removing course records.
    """
    response = client.delete(
        "/api/users/course_record",
        json=payload,
        headers=auth_header,
    )

    assert response.status_code == expected_status
    assert response.get_json() == expected_response


# T16: Test removal of a course record
def test_remove_course_record_success(
    client, register_user, frozen_time, auth_header, add_courses_records
):
    """
    Test the successful removal of a course record.
    """
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


# T17: Test update of a non-existing course record
def test_update_course_record_none_added(
    client,
    register_user,
    frozen_time,
    auth_header,
):
    """
    Test the failure case for updating a course record that doesn't exist.
    """
    response = client.put(
        "/api/users/course_record",
        json={"course_id": "01:198:111", "term": "Fall", "year": 2023, "grade": "A"},
        headers=auth_header,
    )
    assert response.status_code == 404
    assert response.get_json() == {"message": "Course record not found"}


# T18-21: Test various updates for course records
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
    """
    Test the update of course records for a user.
    """
    response = client.put("/api/users/course_record", json=payload, headers=auth_header)

    assert response.status_code == expected_status
    assert response.get_json() == expected_json
