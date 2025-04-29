import pytest
import time
import logging
from app import create_app

logging.basicConfig(level=logging.INFO)


# Test fixture for app
@pytest.fixture
def client():
    app = create_app()
    return app.test_client()


# Test case for health check endpoint
def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.get_json() == {"status": "ok"}


# Test to check uptime over a simulated day
def test_uptime_over_day(client):
    # total_checks = 24 * 60 * 60  # 24 hours in seconds
    total_checks = 3  # To be removed for actual testing
    passed_checks = 0
    failed_responses = []

    for i in range(total_checks):
        try:
            response = client.get("/api/health")
            if response.status_code == 200 and response.get_json() == {"status": "ok"}:
                passed_checks += 1
            else:
                failed_responses.append(
                    {
                        "check": i,
                        "status_code": response.status_code,
                        "response": response.get_json(),
                    }
                )
        except Exception as e:
            failed_responses.append({"check": i, "error": str(e)})

        time.sleep(1)  # Simulate 1 second between checks

    uptime_percent = (passed_checks / total_checks) * 100
    logging.info(
        f"✅ Uptime: {uptime_percent:.2f}% ({passed_checks}/{total_checks} checks passed)"
    )

    if failed_responses:
        logging.info("\n❌ Failed Checks Details:")
        for failure in failed_responses:
            logging.info(failure)

    assert uptime_percent >= 95.0, f"Uptime below threshold: {uptime_percent:.2f}%"
