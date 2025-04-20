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


# def binary_search_course(courses, course_id):
#     left = 0
#     right = len(courses) - 1
#     while left <= right:
#         mid = (left + right) // 2
#         mid_course_number = str(courses[mid]["course_number"])
#         if mid_course_number == target_course_number:
#             return courses[mid]
#         elif mid_course_number < target_course_number:
#             left = mid + 1
#         else:
#             right = mid - 1
#     return None


# @section_bp.route("/all", methods=["GET"])
# def get_all_courses_with_sections_for_semester():

#     term = request.args.get("term")
#     year = request.args.get("year")

#     if not term or not year:
#         return jsonify({"message": "Missing term or year"}), 400
#     term = term.lower()

#     if term == "spring":
#         term = "1"
#     elif term == "fall":
#         term = "9"
#     elif term == "winter":
#         term = "0"
#     elif term == "summer":
#         term = "7"
#     else:
#         return jsonify({"error": f"Invalid semester: {term}"})
#     semester = term + year

#     SECTIONS_FILE_PATH = os.path.join(
#         os.path.dirname(__file__), "..", "data", f"sections{semester}.json"
#     )
#     with open(SECTIONS_FILE_PATH, "r") as json_file:
#         course_sections = json.load(json_file)

#     return jsonify(
#         {
#             "message": "retrieved all courses with sections",
#             "courses_with_sections": course_sections,
#         }
#     )
#     print(f"Parsed {semester}")


# # Save the courses to a CSV file
# print(f"Total courses parsed: {len(course_list)}")
# df = pd.DataFrame(course_list)
# df.to_csv(file_name, index=False)
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


@section_bp.route("/", methods=["GET"])
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
        return jsonify({"error": f"Invalid semester: {semester}"})

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
        # print(course)
        # Return the desired information, such as the course title
        return jsonify({"sections": section_info})

    except Exception as e:
        # Handle any other exceptions
        return jsonify({"error": str(e)}), 500


@section_bp.route("/generate_schedules", methods=["GET"])
def generate_all_valid_schedules():
    pass
