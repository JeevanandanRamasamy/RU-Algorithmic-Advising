import requests


def test_login_correct_password():
    url = "http://127.0.0.1:8080/api/login"
    # real password 123456
    payload = {"username": "nyc14", "password": "123456"}

    response = requests.post(url, json=payload)

    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "token" in data or "message" in data


def test_login_unknown_user_password():
    url = "http://127.0.0.1:8080/api/login"
    payload = {"username": "unknown", "password": "178"}

    response = requests.post(url, json=payload)
    assert response.status_code == 401

    data = response.json()
    assert isinstance(data, dict)

    assert data == {
        "message": "Account doesn't exist, please register",
        "status": "error",
    }


def test_login_incorrect_password():
    url = "http://127.0.0.1:8080/api/login"
    payload = {"username": "nyc14", "password": "178"}

    response = requests.post(url, json=payload)
    assert response.status_code == 401

    data = response.json()
    assert isinstance(data, dict)

    assert data == {
        "message": "Invalid credentials",
        "status": "error",
    }
