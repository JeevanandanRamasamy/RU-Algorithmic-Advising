from flask import Blueprint, jsonify, request
from sqlalchemy import or_
from models.course import Course
from services.course_soc_service import RutgersCourseAPI
from services.course_service import CourseService

# Define a Blueprint for course-related routes
course_bp = Blueprint("courses", __name__, url_prefix="/api/courses")


@course_bp.route("/soc", methods=["GET"])
def get_courses():
    """
    API endpoint to fetch and return course information from the Rutgers SOC API.
    """
    api = RutgersCourseAPI(subject="198", semester="72025", campus="NB", level="UG")
    courses = api.get_courses("198")
    return jsonify(courses)


@course_bp.route("", methods=["GET"])
def get_db_courses():
    """
    API endpoint to fetch course information from the database.
    Supports search functionality based on course name.
    """
    search = request.args.get(
        "search", ""
    ).strip()  # Get the search query, default to an empty string if not provided

    try:
        if search:
            # If search query is provided, filter courses based on course name
            courses = Course.query.filter(
                or_(
                    Course.course_name.ilike(f"%{search}%"),
                    Course.course_id.ilike(f"%{search}%"),
                )
            ).all()
        else:
            # If no search query, return all courses
            courses = Course.query.all()

        course_list = [course.to_dict() for course in courses]
        return jsonify(course_list), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching courses: {e}"}), 500


@course_bp.route("/<course_id>", methods=["GET"])
def get_course_by_id(course_id):
    """
    API endpoint to fetch a specific course by its ID.
    """
    try:
        if not course_id:
            return jsonify({"message": "Course ID is required"}), 400

        # Call the service to get the course by ID
        course = CourseService.get_course_by_id(course_id)

        if isinstance(
            course, Course
        ):  # Ensure that the return value is a Course instance
            # Assuming the Course class has a method to serialize itself to a dict (e.g., to_dict)
            return jsonify({"course": course.to_dict()}), 200
        else:
            return (
                jsonify({"message": course}),
                500,
            )  # If DBService doesn't return a valid course object

    except Exception as e:
        return jsonify({"message": f"Error fetching course: {str(e)}"}), 500
