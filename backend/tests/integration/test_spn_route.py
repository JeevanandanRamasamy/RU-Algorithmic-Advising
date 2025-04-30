import pytest
from flask_jwt_extended import create_access_token
from backend.app import create_app


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


# Fixture: Base payload for SPN request used in SPN-related tests
@pytest.fixture
def base_spn_payload():
    return {
        "username": "test",
        "course_id": "01:198:111",
        "semester": {"season": "fall", "year": 2025},
        "sections": [
            {"section_number": "01", "index": "12345"},
            {"section_number": "02", "index": "12346"},
        ],
        "reason": "Need for graduation",
    }


# T39: Test successful SPN submission with all required fields present
def test_add_spn_success(client, auth_header, base_spn_payload):
    """
    Verifies that the SPN request is successfully processed when all required fields
    are provided. The test checks that the response contains a success message and
    that the "inserted" and "skipped" keys are included in the response data.
    """
    response = client.post(
        "/api/spn/add",
        json=base_spn_payload,
        headers={**auth_header, "Content-Type": "application/json"},
    )

    assert response.status_code == 200
    data = response.get_json()
    assert data["message"] == "SPN request processing complete."
    assert "inserted" in data
    assert "skipped" in data


# T40-T43: Parameterized test to check that missing required fields result in 400 error
@pytest.mark.parametrize(
    "override,expected_status",
    [
        ({"username": None}, 400),  # username missing
        ({"course_id": None}, 400),  # course_id missing
        ({"sections": []}, 400),  # sections missing
        ({}, 400),  # every parameter missing
    ],
)
def test_add_spn_missing_fields(
    client, auth_header, base_spn_payload, override, expected_status
):
    """
    Verifies that the SPN request returns a 400 error when one or more required fields
    are missing in the request payload. The test checks for appropriate error messages
    when fields such as `username`, `course_id`, or `sections` are not provided.
    """
    payload = base_spn_payload.copy()

    if not override:  # This checks if override is an empty dictionary
        payload = {}  # Explicitly set payload to an empty dictionary
    else:
        payload.update(override)  # Otherwise, update the payload as normal

    response = client.post(
        "/api/spn/add",
        json=payload,
        headers=auth_header,
    )

    data = response.get_json()
    print(f"Payload: {payload}")
    print(f"Response Data: {data}")
    print(f"Response Status Code: {response.status_code}")
    assert response.status_code == expected_status
    assert data["message"] == "Missing required fields"
