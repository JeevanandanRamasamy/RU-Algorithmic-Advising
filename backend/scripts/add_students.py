import sys
import os

# Add backend/ to sys.path so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app
import pytest
from app import create_app
from flask_jwt_extended import create_access_token
from freezegun import freeze_time

app = create_app()


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


# Fixture to register a test user
@pytest.fixture
def register_user(client):
    """
    Register a test user before running the tests.
    """
    client.post(
        "/api/register",
        json={
            "username": "test1",
            "password": "123456",
            "first_name": "John",
            "last_name": "Doe",
        },
    )

    client.post(
        "/api/register",
        json={
            "username": "test2",
            "password": "123456",
            "first_name": "John",
            "last_name": "Doe",
        },
    )


def testA(register_user):
    pass


# def prompt_admin_details():
#     """
#     Prompt the user for admin account details and validate them.
#     Returns:
#         dict: A dictionary containing the admin account details.
#     """
#     print("🔧 Admin Account Creation")
#     username = input("Username (max 6 chars): ").strip()

#     if len(username) > 6:
#         print("❌ Username must be at most 6 characters.")
#         sys.exit(1)

#     if UserService.check_account_exists(username):
#         print("❌ This username already exists.")
#         sys.exit(1)

#     password = getpass("Password (min 6 chars): ")
#     if len(password) < 6:
#         print("❌ Password must be at least 6 characters.")
#         sys.exit(1)

#     confirm_password = getpass("Confirm password: ")
#     if password != confirm_password:
#         print("❌ Passwords do not match.")
#         sys.exit(1)

#     first_name = input("First Name: ").strip()
#     last_name = input("Last Name: ").strip()

#     if not all([first_name, last_name]):
#         print("❌ First and Last name are required.")
#         return None

#     hashed_password = generate_password_hash(password)

#     return {
#         "username": username,
#         "password": hashed_password,
#         "first_name": first_name,
#         "last_name": last_name,
#         "role": "student",
#     }


# if __name__ == "__main__":
#     app = create_app()

#     with app.app_context():  # Ensure the app context is available
#         user_data = prompt_admin_details()
#         if user_data is None:
#             print("🚫 Aborting admin creation.")
#             sys.exit(1)

#         result = UserService.insert_new_account(
#             user_data
#         )  # Insert the new admin account

#         if isinstance(result, str):  # Check if the result is an error message
#             print(f"❌ Failed to create admin account: {result}")
#         else:
#             print(f"✅ Admin account '{user_data['username']}' created successfully.")
