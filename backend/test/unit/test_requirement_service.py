import json
import os

import pytest

from backend.services.requirement_service import RequirementService

PREREQUISITES_FILE_PATH = os.path.join(
    os.path.dirname(__file__), "../..", "data", "prerequisites.json"
)

COURSE_STRINGS_FILE_PATH = os.path.join(
    os.path.dirname(__file__), "../..", "data", "course_strings.json"
)


@pytest.fixture(scope="module")
def course_data():
    with open(PREREQUISITES_FILE_PATH, "r") as prereq_file:
        course_requirements = json.load(prereq_file)

    with open(COURSE_STRINGS_FILE_PATH, "r") as strings_file:
        course_strings = json.load(strings_file)

    return {
        "course_requirements": course_requirements,
        "course_strings": course_strings,
    }


# #32CD32 is a shade of green
# ##FF6347 is a shade of red
# def test_validate_prerequisite_string_failing_to_meet_requirement(course_data):
#     prerequisite_string = course_data["course_requirements"]["01:198:112"]
#     prerequisite = ["01:198:111"]
#     course_strings = course_data["course_strings"]
#     taken_courses = set()

#     expected_output = (
#         '(\n  <span style="color:#FF6347;">01:198:111 INTRO COMPUTER SCI</span>\n)'
#     )
#     assert prerequisite_string == "(\n  01:198:111 INTRO COMPUTER SCI\n)"

#     assert (
#         RequirementService.validate_prerequisite_string(
#             prerequisite_string=prerequisite_string,
#             prerequisite=prerequisite,
#             course_strings=course_strings,
#             taken_courses=taken_courses,
#         )
#         == expected_output
#     )


# def test_validate_prerequisite_string_meeting_requirement(course_data):
#     prerequisite_string = course_data["course_requirements"]["01:198:112"]
#     prerequisite = ["01:198:111"]
#     course_strings = course_data["course_strings"]
#     taken_courses = {"01:198:111"}

#     expected_output = (
#         '(\n  <span style="color:#32CD32;">01:198:111 INTRO COMPUTER SCI</span>\n)'
#     )

#     assert prerequisite_string == "(\n  01:198:111 INTRO COMPUTER SCI\n)"
#     assert (
#         RequirementService.validate_prerequisite_string(
#             prerequisite_string=prerequisite_string,
#             prerequisite=prerequisite,
#             course_strings=course_strings,
#             taken_courses=taken_courses,
#         )
#         == expected_output
#     )


def test_validate_prerequisite_string_failing_to_meet_requirement_with_multiple_prerequisites(
    course_data,
):

    prerequisite_string = course_data["course_requirements"]["01:198:431"]
    # assert (
    #     prerequisite_string
    #     == "(\n    (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:352 INTERNET TECHNOLOGY\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:416 OPERATING SYSTEMS DESIGN\n  )\n)"
    # )
    assert RequirementService.validate_prerequisite_string(
        prerequisite_string=prerequisite_string,
        prerequisite=[
            "01:198:213",
            "01:198:314",
            "01:198:336",
            "01:198:352",
            "01:198:416",
        ],
        course_strings=course_data["course_strings"],
        taken_courses=set(),
    ) == (
        '(\n    (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES</span>\n  )\n  OR   (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT</span>\n  )\n  OR   (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:352 INTERNET TECHNOLOGY</span>\n  )\n  OR   (\n    <span style="color:#FF6347;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:416 OPERATING SYSTEMS DESIGN</span>\n  )\n)'
    )


def test_validate_prerequisite_string_to_meeting_requirement_with_multiple_prerequisites(
    course_data,
):

    prerequisite_string = course_data["course_requirements"]["01:198:431"]
    # assert (
    #     prerequisite_string
    #     == "(\n    (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:352 INTERNET TECHNOLOGY\n  )\n  OR   (\n    01:198:213 SOFTWARE METHODOLOGY\n    AND 01:198:416 OPERATING SYSTEMS DESIGN\n  )\n)"
    # )
    assert (
        RequirementService.validate_prerequisite_string(
            prerequisite_string=course_data["course_requirements"]["01:198:431"],
            prerequisite=[
                "01:198:213",
                "01:198:314",
                "01:198:336",
                "01:198:352",
                "01:198:416",
            ],
            course_strings=course_data["course_strings"],
            taken_courses={"01:198:213", "01:198:336"},
        )
        == '(\n    (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:314 PRINCIPLES OF PROGRAMMING LANGUAGES</span>\n  )\n  OR   (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#32CD32;">01:198:336 PRINCIPLES OF INFORMATION AND DATA MANAGEMENT</span>\n  )\n  OR   (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:352 INTERNET TECHNOLOGY</span>\n  )\n  OR   (\n    <span style="color:#32CD32;">01:198:213 SOFTWARE METHODOLOGY</span>\n    AND <span style="color:#FF6347;">01:198:416 OPERATING SYSTEMS DESIGN</span>\n  )\n)'
    )
