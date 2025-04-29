from app import create_app
import pytest
from flask_jwt_extended import create_access_token


# class TestUsersRoutes:
@pytest.fixture
def client():
    """
    This fixture sets up a test client for the Flask application.
    """
    flask_app = create_app()
    with flask_app.test_client() as client:
        with flask_app.app_context():
            yield client


@pytest.fixture
def auth_header():
    """
    This fixture creates an authorization header with a JWT token for testing.
    """
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


@pytest.fixture
def register_user(client):
    """
    This fixture registers a test user in the database.
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


# T02
def test_update_user_details_success(client, register_user, auth_header):
    """
    Test case for successfully updating user details.
    It verifies that the user details are updated correctly in the database.
    """
    response = client.put(
        "/api/users/details",
        json={"enroll_year": 2020, "grad_year": 2024, "gpa": 3.9},
        headers=auth_header,
    )

    data = response.get_json()
    assert response.status_code == 201
    assert data["updated_user_details"]["enroll_year"] == 2020
    assert data["updated_user_details"]["grad_year"] == 2024
    assert data["updated_user_details"]["gpa"] == "3.90"


@pytest.mark.parametrize(
    "payload,missing_field",
    [
        # T03: Missing enroll_year
        (
            {"enroll_year": None, "grad_year": 2024, "gpa": 3.9},
            {
                "field": "enroll_year",
                "expected_json": {"message": "Missing grad year or enroll year"},
            },
        ),
        # T04: Missing grad_year
        (
            {"enroll_year": 2020, "grad_year": None, "gpa": 3.9},
            {
                "field": "grad_year",
                "expected_json": {"message": "Missing grad year or enroll year"},
            },
        ),
        # T05: Empty payload
        (
            {},
            {
                "field": "all fields",
                "expected_json": {"message": "Missing grad year or enroll year"},
            },
        ),
    ],
)
def test_update_user_details_with_null_fields(
    client, payload, missing_field, register_user, auth_header
):
    """
    Test case for updating user details with null or missing fields.
    It verifies that the API returns a 400 status code and the correct error message.
    """
    access_token = create_access_token(identity="test")

    response = client.put("/api/users/details", json=payload, headers=auth_header)

    data = response.get_json()
    assert response.status_code == 400
    assert data == missing_field["expected_json"]


# T06
def test_update_user_details_missing_gpa(client, register_user, auth_header):
    """
    Test case for updating user details with a missing GPA.
    It verifies that the GPA is set to 0.00 in the database.
    """
    access_token = create_access_token(identity="test")

    response = client.put(
        "/api/users/details",
        json={"enroll_year": 2020, "grad_year": 2024, "gpa": None},
        headers=auth_header,
    )

    data = response.get_json()

    assert response.status_code == 201
    assert data["updated_user_details"]["enroll_year"] == 2020
    assert data["updated_user_details"]["grad_year"] == 2024
    assert data["updated_user_details"]["gpa"] == "0.00"
