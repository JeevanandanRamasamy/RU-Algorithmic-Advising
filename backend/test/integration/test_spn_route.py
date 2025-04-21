from app import create_app
from backend.models.spn_request import SPNRequest
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


# Figure out later which test id
def test_create_spn(client):
    access_token = create_access_token(identity="test")

    semester = {"season": "fall", "year": 2025}
    sections = ["01", "02", "03"]

    response = client.put(
        "/api/spn/add",
        json={"username": "test", 
              "course_id": "01:198:111", 
              "semester": semester,
              "sections": sections,
              "reason": "aflack"},
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = response.get_json()
    assert response.status_code == 201
    assert data.get("username") == "test"
    assert data.get("course_id") == "01:198:111"
    assert data.get("semester").get("season").lower() == "fall"
    assert data.get("semester").get("year") == 2025
    assert data.get("sections") == ["01", "02", "03"]
    assert data.get("reason") == "aflack"

@pytest.mark.parametrize(
    "payload,missing_field",
    [
        # : Missing username
        (
            {"username": None, 
              "course_id": "01:198:111", 
              "semester": {"season": "fall", "year": 2025},
              "sections": ["01", "02", "03"],
              "reason": "aflack"},
            {
                "field": "username",
                "expected_json": {"message": "Missing required fields"}
            },
        ),
        # : Missing course_id
        (
            {"username": "test", 
              "course_id": None, 
              "semester": {"season": "fall", "year": 2025},
              "sections": ["01", "02", "03"],
              "reason": "aflack"},
            {
                "field": "course_id",
                "expected_json": {"message": "Missing required fields"}
            },
        ),
        # : No sections selected
        (
            {"username": "test", 
              "course_id": "01:198:111", 
              "semester": {"season": "fall", "year": 2025},
              "sections": [],
              "reason": "aflack"},
            {
                "field": "sections",
                "expected_json": {"message": "Missing required fields"}
            },
        ),
        # : Empty payload
        (
            {},
            {
                "field": "all fields",
                "expected_json": {"message": "Missing required fields"},
            },
        ),
    ],
)
def test_add_spn_with_null_fields(
    client, payload, missing_field, register_user
):
    access_token = create_access_token(identity="test")

    response = client.put(
        "/api/spn/add",
        json=payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = response.get_json()
    assert response.status_code == 400
    assert data == missing_field["expected_json"]

def test_update_spns(client):
    access_token = create_access_token(identity="test")

    response = client.put(
        "/api/spn/update",
        json={"username": "test", 
              "course_id": "01:198:111",
              "section_num": "01",
              "year": 2025,
              "term": "fall",
              "status": "approved"},
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = response.get_json()
    assert response.status_code == 201
    assert data.get("username") == "test"
    assert data.get("course_id") == "01:198:111"
    assert data.get("semester").get("season").lower() == "fall"
    assert data.get("semester").get("year") == 2025
    assert data.get("section_num") == "01"
    assert data.get("status") == "approved"

def test_delete_spns(client):
    access_token = create_access_token(identity="test")

    response = client.put(
        "/api/spn/update",
        json={"username": "test", 
              "course_id": "01:198:111",
              "section_num": "01",
              "year": 2025,
              "term": "fall"},
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = response.get_json()
    assert response.status_code == 201
    assert data.get("username") == "test"
    assert data.get("course_id") == "01:198:111"
    assert data.get("semester").get("season").lower() == "fall"
    assert data.get("semester").get("year") == 2025
    assert data.get("section_num") == "01"

@pytest.mark.parametrize(
    "payload,missing_field",
    [
        # : Missing username
        (
            {"student_id": None, 
              "course_id": "01:198:111", 
              "section_num": "02",
              "year": 2025,
              "term": "fall"},
            {
                "field": "student_id",
                "expected_json": {"message": "Missing required fields"}
            },
        ),
        # : Missing course_id
        (
            {"student_id": "test", 
              "course_id": None, 
              "section_num": "02",
              "year": 2025,
              "term": "fall"},
            {
                "field": "course_id",
                "expected_json": {"message": "Missing required fields"}
            },
        ),
        # : Empty payload
        (
            {},
            {
                "field": "all fields",
                "expected_json": {"message": "Missing required fields"}
            },
        ),
    ],
)
def test_delete_spn_with_null_fields(
    client, payload, missing_field, register_user
):
    access_token = create_access_token(identity="test")

    response = client.put(
        "/api/spn/drop",
        json=payload,
        headers={"Authorization": f"Bearer {access_token}"},
    )

    data = response.get_json()
    assert response.status_code == 400
    assert data == missing_field["expected_json"]