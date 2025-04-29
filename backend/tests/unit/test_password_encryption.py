import pytest
from werkzeug.security import check_password_hash
from app import create_app
from db import db
from models.account import Account

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


def test_all_users_passwords_encrypted(client):
    """
    Test that all users' passwords are encrypted in the database.
    """
    with client.application.app_context():
        # Query all users from the database
        users = Account.query.all()

        # Check if each user's password is hashed
        for user in users:
            assert user.password
            assert len(user.password) > 100
            assert user.password[:6] == "scrypt"


def test_new_user_password_encrypted(client):
    """
    Test that a new user's password is encrypted when created.
    """
    # Create a new user
    response = client.post(
        "/api/register",
        json={
            "username": "test",
            "password": "123456",
            "first_name": "Jane",
            "last_name": "Doe",
        },
    )
    assert response.status_code == 201
    assert response.get_json() == {
        "message": "Registration successful",
        "status": "success",
    }

    # Query the user from the database
    user = Account.query.filter_by(username="test").first()
    assert user is not None
    assert user.password
    assert len(user.password) > 100 # Not 123456
    assert user.password[:6] == "scrypt"
    assert check_password_hash(user.password, "123456")

    # Clean up: delete the user
    db.session.delete(user)
    db.session.commit()
