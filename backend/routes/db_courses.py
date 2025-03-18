from flask import Blueprint, jsonify, request
from services.course_service import DBCourseService
from models import Course  # Import the Course model
from sqlalchemy import or_
from services.db_service import DBService

# //TODO: remove
# Define a Blueprint for database-related course routes
db_course_bp = Blueprint("db_courses", __name__)


@db_course_bp.route("/api/db_courses", methods=["GET"])
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

        course_list = [
            {
                "course_id": course.course_id,
                "course_name": course.course_name,
                "credits": course.credits,
                "course_link": course.course_link,
            }
            for course in courses
        ]
        return jsonify(course_list), 200
    except Exception as e:
        return jsonify({"message": f"Error fetching courses: {e}"}), 500


@db_course_bp.route("/api/db_courses/id", methods=["GET"])
def get_course_by_id():
    try:
        # Extract the course ID from the query parameters
        course_id = request.args.get("id")

        print(f"Received course_id: {course_id}")  # Log the course_id to the console

        if not course_id:
            return jsonify({"message": "Course ID is required"}), 400

        # Call the service to get the course by ID
        course = DBCourseService.get_course_by_id(course_id)

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
