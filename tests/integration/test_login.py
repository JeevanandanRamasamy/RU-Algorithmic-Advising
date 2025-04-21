import requests
import pytest

# URL is defined as a fixture to avoid repeating the URL in every test
@pytest.fixture
def base_url():
    return "http://127.0.0.1:8080/api/login"

@pytest.fixture(scope="module", autouse=True)
def register_test_user():
    url = "http://127.0.0.1:8080/api/register"
    payload = {"username": "test", "password": "123456", "first_name": "John", "last_name": "Doe"}
    response = requests.post(url, json=payload)
    # It's okay if the user is already registered
    assert response.status_code == 201

# Parametrize tests to reduce redundancy for checking different login cases
@pytest.mark.parametrize(
    "username, password, expected_status_code, expected_response",
    [
        ("test", "123456", 200, ["token", "message"]),  # Correct password
        ("unknown", "178", 401, {"message": "Account doesn't exist, please register", "status": "error"}),  # Unknown user
        ("test", "178", 401, {"message": "Invalid credentials", "status": "error"}),  # Incorrect password
    ]
)
def test_login(base_url, username, password, expected_status_code, expected_response):
    payload = {"username": username, "password": password}

    response = requests.post(base_url, json=payload)

    # Assert that the status code matches the expected one
    assert response.status_code == expected_status_code

    # Parse the response data
    data = response.json()
    
    # Assert that the response is a dictionary (assuming JSON response)
    assert isinstance(data, dict)
    
    if isinstance(expected_response, list):
        # In case of successful login, check for token/message key
        assert any(key in data for key in expected_response)
    elif isinstance(expected_response, dict):
        # For error cases, check if the response matches the expected message and status
        assert data == expected_response
