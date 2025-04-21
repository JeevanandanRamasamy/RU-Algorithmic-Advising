import pytest
from flask_jwt_extended import create_access_token
from backend.app import create_app

@pytest.fixture
def client():
    flask_app = create_app()
    with flask_app.test_client() as client:
        with flask_app.app_context():
            yield client

@pytest.fixture
def auth_header():
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}

@pytest.fixture
def base_spn_payload():
    return {
        "username": "test",
        "course_id": "01:198:111",
        "semester": {"season": "fall", "year": 2025},
        "sections": [
            {"section_number": "01", "index": "12345"},
            {"section_number": "02", "index": "12346"}
        ],
        "reason": "Need for graduation"
    }

def test_add_spn_success(client, auth_header, base_spn_payload):
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

@pytest.mark.parametrize(
    "override,expected_status",
    [
        ({"username": None}, 400), # username missing
        ({"course_id": None}, 400), # course_id missing
        ({"sections": []}, 400), # sections missing
        ({}, 400), # every parameter missing
    ]
)

def test_add_spn_missing_fields(client, auth_header, base_spn_payload, override, expected_status):
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

def test_update_spn_success(client, auth_header):
    payload = {
        "student_id": "test",
        "course_id": "01:198:111",
        "section_num": "01",
        "year": 2025,
        "term": "fall",
        "status": "approved"
    }

    response = client.put(
        "/api/spn/update",
        json=payload,
        headers=auth_header,
    )

    data = response.get_json()
    assert response.status_code in (200, 404)  # depends if it exists
    assert "message" in data

def test_delete_spn_success(client, auth_header):
    payload = {
        "student_id": "test",
        "course_id": "01:198:111",
        "section_num": "01",
        "year": 2025,
        "term": "fall"
    }

    response = client.delete(
        "/api/spn/drop",
        json=payload,
        headers={**auth_header, "Content-Type": "application/json"},
    )

    assert response.status_code in (200, 500)  # 200 if deleted, 500 if it doesn't exist
    assert response.get_json()

@pytest.mark.parametrize(
    "payload,expected_status",
    [
        ({"student_id": None, "course_id": "01:198:111", "section_num": "01", "year": 2025, "term": "fall"}, 400),
        ({"student_id": "test", "course_id": None, "section_num": "01", "year": 2025, "term": "fall"}, 400),
        ({}, 400),
    ]
)
def test_delete_spn_missing_fields(client, auth_header, payload, expected_status):
    response = client.delete(
        "/api/spn/drop",
        json=payload,
        headers={**auth_header, "Content-Type": "application/json"},
    )
    data = response.get_json()
    assert response.status_code == expected_status
    assert "message" in data

@pytest.mark.parametrize("query", [
    "student_id=test",
    "",
    "pending_param=true",
    "pending_param=false"
])
def test_get_spn_query_params(client, auth_header, query):
    url = f"/api/spn?{query}" if query else "/api/spn"
    response = client.get(url, headers=auth_header)
    assert response.status_code in (200, 500)
    assert isinstance(response.get_json(), list)
