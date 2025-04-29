import time
import threading
import requests
from app import create_app
from services.user_service import UserService

BASE_URL = "http://localhost:8080/api"
REGISTER_URL = f"{BASE_URL}/register"
LOGIN_URL = f"{BASE_URL}/login"

NUM_USERS = 250
TEST_USERS = [
    {"username": f"t{i}", "password": "123456", "first_name": "Test", "last_name": f"User{i}"}
    for i in range(NUM_USERS)
]

def test_concurrent_logins_under_10_seconds():
    # 1. Register all users
    for user in TEST_USERS:
        response = requests.post(REGISTER_URL, json=user)
        assert response.status_code == 201

    # 2. Prepare and perform login in parallel
    responses = []
    threads = []

    def login(user):
        try:
            res = requests.post(LOGIN_URL, json={"username": user["username"], "password": user["password"]})
            responses.append(res.status_code)
        except Exception as e:
            responses.append(f"error: {e}")

    start_time = time.time()

    for user in TEST_USERS:
        thread = threading.Thread(target=login, args=(user,))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join()

    end_time = time.time()
    total_time = end_time - start_time

    print(f"Time taken for 50 concurrent logins: {total_time:.2f} seconds")
    success_count = responses.count(200)

    assert total_time <= 10, f"Expected logins to finish within 10 seconds, took {total_time:.2f}"
    assert success_count == NUM_USERS, f"Expected {NUM_USERS} successful logins, got {success_count}"

    # 3. Cleanup: delete all users
    app = create_app()
    with app.app_context():
        for user in TEST_USERS:
            UserService.delete_account(user["username"])
    
    print(f"Time taken for {NUM_USERS} concurrent logins: {total_time:.2f} seconds")
