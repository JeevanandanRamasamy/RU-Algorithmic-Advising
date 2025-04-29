import time
import threading
import requests
from queue import Queue
from app import create_app
from services.user_service import UserService

REGISTER_URL = "http://localhost:8080/api/register"
LOGIN_URL = "http://localhost:8080/api/login"

NUM_USERS = 250
TEST_USERS = [
    {"username": f"t{i}", "password": "123456", "first_name": "Test", "last_name": f"User{i}"}
    for i in range(NUM_USERS)
]

def test_concurrent_logins_under_10_seconds():
    """
    Test concurrent logins for 250 users to ensure the system can handle multiple login requests simultaneously.
    The test will:
    1. Register 250 users.
    2. Perform login requests in parallel using threading.
    3. Measure the time taken for all login requests to complete.
    4. Assert that the time taken is under 10 seconds.
    5. Assert that all login requests are successful (status code 200).
    6. Cleanup by deleting all registered users.
    """
    # 1. Register all users
    for user in TEST_USERS:
        response = requests.post(REGISTER_URL, json=user)
        assert response.status_code == 201

    # 2. Prepare and perform login in parallel
    responses = Queue()
    threads = []

    def login(user):
        try:
            res = requests.post(LOGIN_URL, json={"username": user["username"], "password": user["password"]})
            responses.put(res.status_code) # Store the status code in the queue
        except Exception as e:
            responses.put(f"error: {e}")

    start_time = time.time()

    for user in TEST_USERS: # Create a thread for each user
        thread = threading.Thread(target=login, args=(user,))
        thread.start()
        threads.append(thread)

    for thread in threads:
        thread.join() # Wait for all threads to finish

    end_time = time.time()
    total_time = end_time - start_time

    print(f"Time taken for {NUM_USERS} concurrent logins: {total_time:.2f} seconds")
    results = [responses.get() for _ in range(NUM_USERS)] # Collect all responses
    success_count = results.count(200)

    assert total_time <= 10, f"Expected logins to finish within 10 seconds, took {total_time:.2f}"
    assert success_count == NUM_USERS, f"Expected {NUM_USERS} successful logins, got {success_count}"

    # 3. Cleanup: delete all users
    app = create_app()
    with app.app_context():
        for user in TEST_USERS:
            UserService.delete_account(user["username"])
    
    # 4. Print the results
    print(f"Time taken for {NUM_USERS} concurrent logins: {total_time:.2f} seconds")
