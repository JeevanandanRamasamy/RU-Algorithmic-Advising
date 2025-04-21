from backend.app import create_app
from backend.models.student_details import StudentDetails
import pytest
from flask_jwt_extended import create_access_token


# class TestUsersRoutes:
@pytest.fixture
def client():
    flask_app = create_app()
    with flask_app.test_client() as client:
        with flask_app.app_context():
            yield client


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
