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


@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture
def auth_header(frozen_time):
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}
