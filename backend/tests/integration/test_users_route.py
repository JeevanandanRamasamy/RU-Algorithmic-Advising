from backend.app import create_app
from backend.models.student_details import StudentDetails
import pytest
from flask_jwt_extended import create_access_token


# Fixture to create a test client for making HTTP requests
@pytest.fixture
def client():
    flask_app = create_app()
    with flask_app.test_client() as client:
        with flask_app.app_context():
            yield client


# Fixture to generate an authentication header for tests
@pytest.fixture
def auth_header():
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


# Fixture to register a test user
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


# T02
def test_update_user_details_success(client, register_user, auth_header):
    """
    Verifies that the user details are successfully updated when valid data is provided,
    including enrollment year, graduation year, and GPA. The GPA should be formatted to
    two decimal places, and the response should contain the updated user details.
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


# T03-T05: Parameterized test for missing required fields in user detail update
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
    Verifies that the user detail update fails with appropriate error messages when
    required fields are missing or provided as null. This test covers the scenarios where
    `enroll_year`, `grad_year`, or the entire payload are missing.
    """
    access_token = create_access_token(identity="test")

    response = client.put("/api/users/details", json=payload, headers=auth_header)

    data = response.get_json()
    assert response.status_code == 400
    assert data == missing_field["expected_json"]


# T06
def test_update_user_details_missing_gpa(client, register_user, auth_header):
    """
    Verifies that when GPA is missing during user detail update, it defaults to "0.00".
    The response should reflect the default GPA and the other valid user details.
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
