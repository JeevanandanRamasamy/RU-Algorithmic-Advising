from flask import Blueprint, jsonify, request
from services.course_soc_service import RutgersCourseAPI

# Define a Blueprint for section-related routes
section_bp = Blueprint("sections", __name__, url_prefix="/api/sections")

def binary_search_course(courses, target_course_number):
    left = 0
    right = len(courses) - 1
    while left <= right:
        mid = (left + right) // 2
        mid_course_number = str(courses[mid]["course_number"])
        if mid_course_number == target_course_number:
            return courses[mid]
        elif mid_course_number < target_course_number:
            left = mid + 1
        else:
            right = mid - 1
    return None  # Not found

@section_bp.route("/", methods=["GET"])
def get_course_sections():
    course_id = request.args.get("course_id").split(":")
    subject = course_id[1]
    course_number = course_id[2]
    semester = request.args.get("semester").lower()
    year = request.args.get("year")
    campus = request.args.get("campus", "NB")  # Default to "NB" if not provided
    level = request.args.get("level", "UG")  # Default to "UG" if not provided
    
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

    # Check if required parameters are missing
    if not subject or not semester or not course_number:
        return jsonify({"error": "Missing required parameters"}), 400
    try:
        api = RutgersCourseAPI(subject=subject, semester=semester, campus=campus, level=level)
        courses = api.get_courses()
        if len(courses) < 1:
            return jsonify({"error": "No courses exist"}), 404
        # Use binary search to find the course
        course = binary_search_course(courses, course_number)
        if not course:
            return jsonify({"error": "Course not found"}), 404
        
        section_info = [
            {"section_number": section["section_number"], 
             "index": section.get("index")}
            for section in course["sections"]
        ]
        print(course)
        # Return the desired information, such as the course title
        return jsonify({"sections": section_info})

    except Exception as e:
        # Handle any other exceptions
        return jsonify({"error": str(e)}), 500
