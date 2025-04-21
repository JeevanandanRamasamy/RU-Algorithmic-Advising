import requests


def test_get_users():
    response = requests.get("http://127.0.0.1:8080/api/login")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
