from flask import Blueprint, jsonify, request
from services.course_soc_service import RutgersCourseAPI
import requests
import os
import json

# Define a Blueprint for section-related routes
section_bp = Blueprint("sections", __name__, url_prefix="/api/sections")


def get_json(url):
    """Fetches JSON data from a URL."""
    response = requests.get(url)
    return response.json()


@section_bp.route("/subject", methods=["GET"])
def get_course_sections_by_subject():
    subject = request.args.get("subject")
    semester = request.args.get("semester").lower()
    year = request.args.get("year")
    campus = request.args.get("campus", "NB")
    level = request.args.get("level", "UG")
    if semester == "spring":
        semester = "1"
    elif semester == "fall":
        semester = "9"
    elif semester == "winter":
        semester = "0"
    elif semester == "summer":
        semester = "7"
    else:
        return jsonify({"error": f"Invalid semester: {semester}"})

    semester = semester + year

    if not subject or not semester:
        return jsonify({"error": "Missing required parameters"}), 400
    try:
        api = RutgersCourseAPI(
            subject=subject, semester=semester, campus=campus, level=level
        )
        courses = api.get_courses()
        if len(courses) < 1:
            return jsonify({"error": "No courses exist"}), 404

        return jsonify({"sections": courses})

    except Exception as e:
        # Handle any other exceptions
        return jsonify({"error": str(e)}), 500


@section_bp.route("/expanded", methods=["GET"])
def get_course_sections_expanded():
    course_id = request.args.get("course_id")
    _, subject, course_number = course_id.split(":")
    term = request.args.get("term").lower()
    year = request.args.get("year")
    campus = request.args.get("campus", "NB")  # Default to "NB" if not provided
    level = request.args.get("level", "UG")  # Default to "UG" if not provided

    if term == "spring":
        term = "1"
    elif term == "fall":
        term = "9"
    elif term == "winter":
        term = "0"
    elif term == "summer":
        term = "7"
    else:
        return jsonify({"error": f"Invalid semester: {semester}"})

    semester = term + year

    if not subject or not semester or not course_number:
        return jsonify({"error": "Missing required parameters"}), 400
    try:
        api = RutgersCourseAPI(
            subject=subject, semester=semester, campus=campus, level=level
        )
        courses = api.get_courses()
        if len(courses) < 1:
            return jsonify({"error": "No courses exist"}), 404
        if not any(course["course_id"] == course_id for course in courses.values()):
            return jsonify({"error": "Course not found"}), 404

        return jsonify(
            {
                "message": f"Retrieve information for course {course_id}",
                "sections": courses[course_id],
            }
        )

    except Exception as e:
        # Handle any other exceptions
        return jsonify({"error": str(e)}), 500


@section_bp.route("", methods=["GET"])
def get_course_sections():

    course_id = request.args.get("course_id")
    _, subject, course_number = course_id.split(":")
    term = request.args.get("term").lower()
    year = request.args.get("year")
    campus = request.args.get("campus", "NB")  # Default to "NB" if not provided
    level = request.args.get("level", "UG")  # Default to "UG" if not provided

    if term == "spring":
        term = "1"
    elif term == "fall":
        term = "9"
    elif term == "winter":
        term = "0"
    elif term == "summer":
        term = "7"
    else:
        return jsonify({"error": f"Invalid semester"})

    semester = term + year

    # Check if required parameters are missing
    if not subject or not semester or not course_number:
        return jsonify({"error": "Missing required parameters"}), 400
    try:
        api = RutgersCourseAPI(
            subject=subject, semester=semester, campus=campus, level=level
        )
        courses = api.get_courses()

        if len(courses) < 1:
            return jsonify({"error": "No courses exist"}), 404
        if not any(course["course_id"] == course_id for course in courses.values()):
            return jsonify({"error": "Course not found"}), 404

        section_info = [
            {"section_number": section["section_number"], "index": section.get("index")}
            for section in courses[course_id]["sections"].values()
        ]
        return jsonify({"sections": section_info})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# TODO: finish generating all schedules
@section_bp.route("/generate_schedules", methods=["POST"])
def generate_all_valid_schedules():
    data = request.json
    checked_sections = data.get("checkedSections")
    index_to_meeting_map = data.get("indexToMeetingTimesMap")

    # print(checked_sections)
    # print(index_to_meeting_map)
    return {}
