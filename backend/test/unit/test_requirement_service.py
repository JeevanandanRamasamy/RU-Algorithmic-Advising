import json
import os
from unittest.mock import patch

import pytest

from backend.services.requirement_service import RequirementService

PREREQUISITES_FILE_PATH = os.path.join(
    os.path.dirname(__file__), "../..", "data", "prerequisites.json"
)


@pytest.fixture(scope="module")
def course_prerequisites_strings():
    with open(PREREQUISITES_FILE_PATH, "r") as prereq_file:
        course_prerequisites_strings = json.load(prereq_file)
    return course_prerequisites_strings


# #32CD32 is a shade of green
# ##FF6347 is a shade of red


@patch("services.requirement_service.CourseService.get_course_string")
def test_validate_prerequisite_string_failing_to_meet_requirement(
    mock_get_course_string,
    course_prerequisites_strings,
):
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


@patch("services.requirement_service.CourseService.get_course_string")
def test_validate_prerequisite_string_meeting_requirement(
    mock_get_course_string,
    course_prerequisites_strings,
):

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


@patch("services.requirement_service.CourseService.get_course_string")
def test_validate_prerequisite_string_to_meeting_requirement_with_multiple_prerequisites(
    mock_get_course_string, course_prerequisites_strings
):
    mock_get_course_string.side_effect = lambda course_id: {
        "01:198:213": "01:198:213 SOFTWARE METHODOLOGY",
        "01:198:314": "01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES",
        "01:198:336": "01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT",
        "01:198:352": "01:198:352 INTERNET TECHNOLOGY",
        "01:198:416": "01:198:416 OPERATING SYSTEMS DESIGN",
        "01:198:431": "01:198:431 COMPUTER ARCHITECTURE",
    }[course_id]
    prerequisite_string = course_prerequisites_strings["01:198:431"]
    assert (
        prerequisite_string
        == "(\n    (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:352 INTERNET TECHNOLOGY\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:416 OPERATING SYSTEMS DESIGN\n  )\n)"
    )
    assert RequirementService.validate_prerequisite_string(
        prerequisite_string=prerequisite_string,
        prerequisite=[
            "01:198:213",
            "01:198:314",
            "01:198:336",
            "01:198:352",
            "01:198:416",
        ],
        taken_courses=set(),
    ) == (
        '(\n    (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES</span>\n  )\n  OR   (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT</span>\n  )\n  OR   (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:352 INTERNET TECHNOLOGY</span>\n  )\n  OR   (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:416 OPERATING SYSTEMS DESIGN</span>\n  )\n)'
    )


@patch("services.requirement_service.CourseService.get_course_string")
def test_validate_prerequisite_string_to_meeting_requirement_with_multiple_prerequisites(
    mock_get_course_string, course_prerequisites_strings
):

    prerequisite_string = course_prerequisites_strings["01:198:431"]

    mock_get_course_string.side_effect = lambda course_id: {
        "01:198:213": "01:198:213 SOFTWARE METHODOLOGY",
        "01:198:314": "01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES",
        "01:198:336": "01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT",
        "01:198:352": "01:198:352 INTERNET TECHNOLOGY",
        "01:198:416": "01:198:416 OPERATING SYSTEMS DESIGN",
        "01:198:431": "01:198:431 COMPUTER ARCHITECTURE",
    }[course_id]
    assert (
        prerequisite_string
        == "(\n    (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:352 INTERNET TECHNOLOGY\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:416 OPERATING SYSTEMS DESIGN\n  )\n)"
    )
    assert (
        RequirementService.validate_prerequisite_string(
            prerequisite_string=prerequisite_string,
            prerequisite=[
                "01:198:213",
                "01:198:314",
                "01:198:336",
                "01:198:352",
                "01:198:416",
            ],
            taken_courses={"01:198:213", "01:198:336"},
        )
        == '(\n    (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES</span>\n  )\n  OR   (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#32CD32;">01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT</span>\n  )\n  OR   (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:352 INTERNET TECHNOLOGY</span>\n  )\n  OR   (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:416 OPERATING SYSTEMS DESIGN</span>\n  )\n)'
    )
