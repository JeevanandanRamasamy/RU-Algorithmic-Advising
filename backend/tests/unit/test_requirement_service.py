import pytest
import logging
import decimal
import json
import os

from unittest.mock import patch
from backend.app import create_app
from backend.db import db
from flask_jwt_extended import create_access_token
from backend.services.user_program_service import UserProgramService
from backend.services.requirement_service import RequirementService

logging.basicConfig(level=logging.INFO)

PREREQUISITES_FILE_PATH = os.path.join(
    os.path.join(os.path.dirname(__file__), "..", "..", "data", "prerequisites.json")
)

USERNAME = "test"
PASSWORD = "test_password"
PROGRAMS = ["01", "NB198SJ"]
COURSES_TAKEN = ["01:198:111", "01:198:112", "01:198:142"]


# Fixture to load course prerequisite strings from a JSON file
@pytest.fixture(scope="module")
def course_prerequisites_strings():
    with open(PREREQUISITES_FILE_PATH, "r") as prereq_file:
        course_prerequisites_strings = json.load(prereq_file)
    return course_prerequisites_strings


# #32CD32 is a shade of green
# ##FF6347 is a shade of red
# Test T22: User has not taken the required course
@patch("services.requirement_service.CourseService.get_course_string")
def test_validate_prerequisite_string_failing_to_meet_requirement(
    mock_get_course_string,
    course_prerequisites_strings,
):
    """
    Verifies that when a user has not taken the required course, the prerequisite
    string is displayed with the appropriate color (red).
    """
    mock_get_course_string.side_effect = lambda course_id: {
        "01:198:112": "01:198:112 DATA STRUCTURES",
        "01:198:111": "01:198:111 INTRO COMPUTER SCI",
    }[course_id]
    prerequisite_string = course_prerequisites_strings["01:198:112"]
    prerequisite = ["01:198:111"]
    taken_courses = set()

    expected_output = (
        '(\n  <span style="color:#FF6347;">01:198:111 INTRO COMPUTER SCI</span>\n)'
    )
    assert prerequisite_string == "(\n  01:198:111 INTRO COMPUTER SCI\n)"

    assert (
        RequirementService.validate_prerequisite_string(
            prerequisite_string=prerequisite_string,
            prerequisite=prerequisite,
            taken_courses=taken_courses,
        )
        == expected_output
    )


# Test T23: User has met the course prerequisite
@patch("services.requirement_service.CourseService.get_course_string")
def test_validate_prerequisite_string_meeting_requirement(
    mock_get_course_string,
    course_prerequisites_strings,
):
    """
    Verifies that when a user has met the course prerequisite, the prerequisite
    string is displayed with the appropriate color (green).
    """

    mock_get_course_string.side_effect = lambda course_id: {
        "01:198:112": "01:198:112 DATA STRUCTURES",
        "01:198:111": "01:198:111 INTRO COMPUTER SCI",
    }[course_id]

    prerequisite_string = course_prerequisites_strings["01:198:112"]
    prerequisite = ["01:198:111"]
    taken_courses = {"01:198:111"}

    expected_output = (
        '(\n  <span style="color:#32CD32;">01:198:111 INTRO COMPUTER SCI</span>\n)'
    )

    assert prerequisite_string == "(\n  01:198:111 INTRO COMPUTER SCI\n)"
    assert (
        RequirementService.validate_prerequisite_string(
            prerequisite_string=prerequisite_string,
            prerequisite=prerequisite,
            taken_courses=taken_courses,
        )
        == expected_output
    )


# Fixture to create Flask test client
@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        with app.app_context():
            yield client


# Fixture to generate a JWT auth header
@pytest.fixture
def auth_header():
    access_token = create_access_token(identity="test")
    return {"Authorization": f"Bearer {access_token}"}


# Fixture to register a user and enroll them in multiple programs
@pytest.fixture
def register_user(client):
    client.post(
        "/api/register",
        json={
            "username": USERNAME,
            "password": PASSWORD,
            "first_name": "John",
            "last_name": "Doe",
        },
    )
    for program_id in PROGRAMS:
        UserProgramService.insert_program_for_student(
            username="test", program_id=program_id
        )

    yield
    access_token = create_access_token(identity="test")
    client.delete(
        "/api/users/details",
        headers={"Authorization": f"Bearer {access_token}"},
    )


# Fixture to add and then delete course records for a user
@pytest.fixture
def add_courses_records(client, auth_header):
    for course_id in ["01:198:111", "01:198:112", "01:198:142"]:
        response = client.post(
            "/api/users/course_record",
            json={"course_id": course_id, "term": "Fall", "year": 2023},
            headers=auth_header,
        )

    yield

    for course_id in ["01:198:111", "01:198:112", "01:198:142"]:
        response = client.delete(
            "/api/users/course_record",
            json={"course_id": course_id},
            headers=auth_header,
        )


# Test 35
def test_get_all_prerequisites(client):
    """
    Verifies that the prerequisites for a course are fetched correctly and
    match the expected prerequisites.
    """
    with client.application.app_context():
        prerequisites = RequirementService.get_all_prerequisites(course_id="01:640:151")
        assert isinstance(prerequisites, set)
        assert len(prerequisites) > 0, "Prerequisites should not be empty"
        assert prerequisites == {
            "21:640:113",
            "21:640:114",
            "50:640:113",
            "50:640:114",
            "01:640:112",
            "01:640:115",
        }

        prerequisites = RequirementService.get_all_prerequisites(course_id="01:198:112")
        assert isinstance(prerequisites, set)
        assert len(prerequisites) > 0, "Prerequisites should not be empty"
        assert prerequisites == {"01:198:111"}

        prerequisites = RequirementService.get_all_prerequisites(course_id="01:198:110")
        assert isinstance(prerequisites, set)
        assert len(prerequisites) == 0, "Prerequisites should be empty for this course"
        assert prerequisites == set()


# T36
def test_check_requirements_met(client, register_user, add_courses_records):
    """
    Verifies that the `check_requirements_met` method correctly evaluates whether
    the requirements for a program or course have been met, considering the courses
    taken by the user.
    """
    with client.application.app_context():
        for program_id in PROGRAMS:
            requirements_met = RequirementService.check_requirements_met(
                username=USERNAME, program_id=program_id
            )

            assert isinstance(requirements_met, bool)
            assert (
                requirements_met is False
            ), f"Requirements should not be met for program {program_id}"

        extra_courses = [
            "01:198:205",
            "01:198:206",
            "01:198:211",
            "01:198:344",
            "01:640:151",
            "01:640:152",
            "01:640:250",
            "01:198:210",
            "01:198:213",
            "01:198:214",
            "01:198:314",
            "01:198:336",
            "01:198:439",
            "01:198:462",
            "01:750:203",
            "01:750:204",
            "01:750:205",
            "01:750:206",
        ]
        requirements_met = RequirementService.check_requirements_met(
            username=USERNAME, program_id="NB198SJ", extra_courses=extra_courses
        )

        assert isinstance(requirements_met, bool)
        assert requirements_met is True, "Requirements should be met with extra courses"

        for course_id in ["01:198:211", "01:198:205", "01:640:151"]:
            requirements_met = RequirementService.check_requirements_met(
                username=USERNAME, course_id=course_id
            )
            assert isinstance(requirements_met, bool)
            assert (
                requirements_met is True
            ), f"Requirements should be met for course {course_id}"


# Test T37: Check if requirement group is fulfilled
def test_check_group_fulfillment(client):
    """
    Verifies that the `check_group_fulfillment` method correctly checks if the
    requirements for a group of courses are fulfilled, based on the courses taken.
    """
    with client.application.app_context():
        # Group 47: ALL from ["01:198:111", "01:198:112", "01:198:205", "01:198:211", "01:198:344"]
        group_47_fulfilled = RequirementService.check_group_fulfillment(
            group_id=47, courses_taken=COURSES_TAKEN
        )
        assert isinstance(group_47_fulfilled, bool)
        assert (
            group_47_fulfilled is False
        ), "Group 47 should not be fulfilled with current courses"

        # Group 48: ONE from ["01:198:206", "01:640:477", "14:332:226"]
        group_48_fulfilled = RequirementService.check_group_fulfillment(
            group_id=48, courses_taken=COURSES_TAKEN + ["01:198:206"]
        )
        assert isinstance(group_48_fulfilled, bool)
        assert (
            group_48_fulfilled is True
        ), "Group 48 should be fulfilled with current courses"


# Test 38: Get number of requirements for a program or course
def test_get_num_requirements(client):
    """
    Verifies that the `get_num_requirements` method returns the correct number
    of requirements for a program or course.
    """
    with client.application.app_context():
        num_requirements = [14, 45]
        for program_id, num_reqs in zip(PROGRAMS, num_requirements):
            result = RequirementService.get_num_requirements(program_id=program_id)
            assert isinstance(result, int)
            assert (
                result == num_reqs
            ), f"Number of requirements for program {program_id} should be {num_reqs}"

        num_requirements = [1, 2]
        courses = ["01:198:112", "01:198:206"]
        for course_id, num_reqs in zip(courses, num_requirements):
            result = RequirementService.get_num_requirements(course_id=course_id)
            assert isinstance(result, int)
            assert (
                result == num_reqs
            ), f"Number of requirements for course {course_id} should be {num_reqs}"


# Test 39: Count number of courses taken that fulfill requirements
def test_get_num_courses_taken(client, register_user, add_courses_records):
    """
    Verifies that the `get_num_courses_taken` method returns the correct number
    of courses taken that fulfill requirements for a program or course.
    """
    with client.application.app_context():
        num_courses_taken = [2, 2]
        for program_id, num_courses in zip(PROGRAMS, num_courses_taken):
            num_courses_taken = RequirementService.get_num_courses_taken(
                username=USERNAME, program_id=program_id
            )
            print(
                f"Number of courses taken for program {program_id}: {num_courses_taken}"
            )
            assert isinstance(num_courses_taken, int)
            assert (
                num_courses_taken == num_courses
            ), f"Number of courses taken for program {program_id} should be {num_courses}"

        num_courses_taken = [1, 1]
        courses = ["01:198:205", "01:960:291"]
        for course_id, num_courses in zip(courses, num_courses_taken):
            num_courses_taken = RequirementService.get_num_courses_taken(
                username=USERNAME, course_id=course_id
            )
            assert isinstance(num_courses_taken, int)
            assert (
                num_courses_taken == num_courses
            ), f"Number of courses taken for course {course_id} should be {num_courses}"


# T40:
def test_get_missing_requirements(client, register_user, add_courses_records):
    """
    Verifies that the `get_missing_requirements` method returns the correct missing
    requirements for a program or course.
    """
    with client.application.app_context():
        for program_id in PROGRAMS:
            missing_courses = RequirementService.get_missing_requirements(
                username=USERNAME, program_id=program_id
            )
            print(f"Missing courses for program {program_id}: {missing_courses}")
            assert isinstance(missing_courses, list)
            for course in COURSES_TAKEN:
                assert (
                    course not in missing_courses
                ), f"Course {course} should not be in missing courses"

            # Using missing courses as extra courses in check_requirements_met
            requirements_met = RequirementService.check_requirements_met(
                username=USERNAME, program_id=program_id, extra_courses=missing_courses
            )
            assert isinstance(requirements_met, bool)
            assert (
                requirements_met is True
            ), "Requirements should be met with extra courses"


# T41:
def test_get_suggested_courses(client, register_user, add_courses_records):
    """
    Verifies that the `get_suggested_courses` method returns valid courses and
    total credits without exceeding the credit limit, and that it does not suggest
    courses that the user has already taken.
    """
    with client.application.app_context():
        result = RequirementService.get_suggested_courses(
            username=USERNAME, max_credits=17
        )
        assert "error" not in result, "Error should not be present in the result"
        suggested_courses, total_credits = result["courses"], result["credits"]
        assert len(suggested_courses) > 0, "Suggested courses should not be empty"
        print(total_credits, type(total_credits))
        assert isinstance(total_credits, decimal.Decimal)
        assert total_credits <= 17, "Total credits should not exceed max credits"

        for course in COURSES_TAKEN:
            assert (
                course not in suggested_courses
            ), f"Course {course} should not be in suggested courses"


# 42
def test_create_degree_plan(client, register_user, add_courses_records):
    """
    Verifies that the `create_degree_plan` method generates a valid degree plan,
    ensures no errors are present, and that no previously taken courses are included in the plan.
    """
    with client.application.app_context():
        result = RequirementService.create_degree_plan(
            username=USERNAME, max_credits=17
        )
        assert "error" not in result, "Error should not be present in the result"
        degree_plan = result["plan"]
        assert isinstance(degree_plan, list)
        assert len(degree_plan) > 0, "Degree plan should not be empty"

        taken_set = set(COURSES_TAKEN)

        # Ensure none of the taken courses appear in the plan
        for planned_set in degree_plan:
            assert isinstance(
                planned_set, set
            ), "Each entry in degree_plan should be a set"
            assert taken_set.isdisjoint(
                planned_set
            ), f"Taken courses should not appear in the degree plan: overlap with {planned_set & taken_set}"
