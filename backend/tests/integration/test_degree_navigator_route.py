from backend.app import create_app
import pytest
import sys
import os
from unittest.mock import patch
from flask import Flask
from flask_jwt_extended import create_access_token
from freezegun import freeze_time


sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
)

USERNAME = "test"
PASSWORD = "test_password"


# Fixture for setting up a Flask test client
@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


# Fixture to freeze the time for consistent testing
@pytest.fixture
def frozen_time():
    with freeze_time("2025-04-20 12:00:00"):
        yield


# Fixture to register a user and clean up after the test
@pytest.fixture
def register_user(client):
    client.post(
        "/api/register",
        json={
            "username": USERNAME,
            "password": PASSWORD,
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


# Fixture to generate an authorization header with a JWT token
@pytest.fixture
def auth_header(frozen_time):
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


from backend.app import create_app
import pytest
import sys
import os
from unittest.mock import patch
from flask import Flask
from flask_jwt_extended import create_access_token
from freezegun import freeze_time

# Adding the backend directory to the system path for imports
sys.path.insert(
    0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
)

# Constants for username and password to be used in the tests
USERNAME = "test"
PASSWORD = "test_password"


# Fixture for setting up a Flask test client
@pytest.fixture
def client():
    """
    Fixture to create and provide a Flask test client.

    This client can be used to make test requests to the application.
    The client is automatically provided to the test functions that need it.
    """
    app = create_app()  # Create Flask app instance
    with app.test_client() as client:  # Create test client
        with app.app_context():  # Ensure the app context is active
            yield client  # Yield the client to the test function


# Fixture to freeze the time for consistent testing
@pytest.fixture
def frozen_time():
    """
    Fixture to freeze the time at a fixed point ('2025-04-20 12:00:00').

    This is useful for time-dependent tests where the behavior needs to be
    consistent across different test runs.
    """
    with freeze_time("2025-04-20 12:00:00"):
        yield


# Fixture to register a user and clean up after the test
@pytest.fixture
def register_user(client):
    """
    Fixture to register a test user before the test and clean up by deleting
    the user after the test is completed.

    The user is registered with predefined credentials and removed after the test.
    """
    # Register the test user
    client.post(
        "/api/register",
        json={
            "username": USERNAME,
            "password": PASSWORD,
            "first_name": "John",
            "last_name": "Doe",
        },
    )
    yield  # Yield to the test function
    # Clean up: delete the user after the test
    access_token = create_access_token(identity=USERNAME)
    client.delete(
        "/api/users/details",
        headers={"Authorization": f"Bearer {access_token}"},
    )


# Fixture to generate an authorization header with a JWT token
@pytest.fixture
def auth_header(frozen_time):
    access_token = create_access_token(identity=USERNAME)
    return {"Authorization": f"Bearer {access_token}"}


# Test function to ensure the labeled requirement tree is returned successfully
def test_get_labeled_requirement_tree_success(client, register_user, auth_header):
    """
    Test to check the behavior of the API when fetching the labeled requirement tree.

    This ensures that the returned data contains the necessary fields for
    labeled requirement groups and courses.
    """
    response = client.get(
        "/api/degree_navigator/programs/NB198SJ/requirement-tree-labeled?username=test",
        headers=auth_header,
    )

    data = response.get_json()

    def check_group_node(node, depth=0):
        assert isinstance(node, dict)
        assert "label" in node
        assert "group_id" in node
        assert "group_name" in node
        assert "num_required" in node
        assert "courses" in node or "children" in node
        assert isinstance(node["courses"], list) or node.get("children") is not None

        # Check courses if available
        if node["courses"]:
            for course in node["courses"]:
                assert isinstance(course, dict)
                assert "course_id" in course
                assert "course_name" in course
                assert "course_credits" in course
                assert "taken" in course
                assert isinstance(course["taken"], bool)

        # Recurse on children if any
        if node.get("children"):
            for child in node["children"]:
                check_group_node(child, depth + 1)

    # Check each top-level group
    for group in data:
        check_group_node(group)
