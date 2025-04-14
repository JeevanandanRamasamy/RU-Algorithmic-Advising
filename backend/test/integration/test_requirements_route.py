import pytest
import sys
import os
from unittest.mock import patch
from flask import Flask
from flask_jwt_extended import create_access_token


sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


def get_auth_headers(username="test_user"):
    token = create_access_token(identity=username)
    return {"Authorization": f"Bearer {token}"}


def test_validate_endpoint(mock_validate, mock_fulfill, mock_prereqs, mock_check):
    mock_validate.return_value = ["01:198:111"]
    response = client.get("/api/requirements/planned-courses/validate")
    assert response.status_code == 200
    assert response.get_json() == {}
