import pytest
import logging
from backend.app import create_app
from backend.db import db
from flask_jwt_extended import create_access_token
from backend.services.user_program_service import UserProgramService
from backend.services.requirement_service import RequirementService
logging.basicConfig(level=logging.INFO)

COURSES_TAKEN = ['01:198:111', '01:198:112', '01:198:142']

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client

@pytest.fixture
def auth_header():
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
    for program_id in ["NB198SJ", "01"]:
        UserProgramService.insert_program_for_student(username="test", program_id=program_id)

    yield
    access_token = create_access_token(identity="test")
    client.delete(
        "/api/users/details",
        headers={"Authorization": f"Bearer {access_token}"},
    )

@pytest.fixture
def add_courses_records(client, auth_header):
    for course_id in ["01:198:111", "01:198:112", "01:198:142"]:
        response = client.post(
            "/api/users/course_record",
            json={"course_id": course_id, "term": "Fall", "year": 2023},
            headers=auth_header,
        )

    yield

    for course_id in ["01:198:111", "01:198:112", "01:198:142"]:
        response = client.delete(
            "/api/users/course_record",
            json={"course_id": course_id},
            headers=auth_header,
        )

def test_get_missing_requirements(client, register_user, add_courses_records):
    with client.application.app_context():
        missing_courses = RequirementService.get_missing_requirements(username="test", program_id="01")
        assert isinstance(missing_courses, list)
        for course in COURSES_TAKEN:
            assert course not in missing_courses, f"Course {course} should not be in missing courses"
        
        missing_courses = RequirementService.get_missing_requirements(username="test", program_id="NB198SJ")
        assert isinstance(missing_courses, list)
        for course in COURSES_TAKEN:
            assert course not in missing_courses, f"Course {course} should not be in missing courses"

def test_get_all_prerequisites(client):
    with client.application.app_context():
        prerequisites = RequirementService.get_all_prerequisites(course_id="01:640:151")
        assert isinstance(prerequisites, list)
        assert len(prerequisites) > 0, "Prerequisites should not be empty"
