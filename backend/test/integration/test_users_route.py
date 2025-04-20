from app import create_app
from backend.models.student_details import StudentDetails
import pytest
from app import create_app
from flask_jwt_extended import create_access_token


# class TestUsersRoutes:
@pytest.fixture
def client():
    flask_app = create_app()
    with flask_app.test_client() as client:
        with flask_app.app_context():
            yield client


def get_auth_headers(username="test_user"):
    token = create_access_token(identity=username)
    return {"Authorization": f"Bearer {token}"}


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


def test_update_user_details_success(client, register_user):
    register_user
    access_token = create_access_token(identity="test")

    response = client.put(
        "/api/users/details",
        json={"enroll_year": 2020, "grad_year": 2024, "gpa": 3.9},
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = response.get_json()
    assert response.status_code == 201
    assert data["updated_user_details"]["enroll_year"] == 2020
    assert data["updated_user_details"]["grad_year"] == 2024
    assert data["updated_user_details"]["gpa"] == "3.90"
