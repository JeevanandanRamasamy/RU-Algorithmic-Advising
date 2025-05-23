from flask import Blueprint, request, jsonify
from services.requirement_service import RequirementService
from models.course import Course

suggested_courses_bp = Blueprint('suggested_courses', __name__)

@suggested_courses_bp.route('/api/suggested-courses', methods=['GET'])
def get_suggested_courses():
    """
    Endpoint to get suggested courses for a user based on their completed courses.
    Returns a JSON response with the suggested courses.
    """
    username = request.args.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    result = RequirementService.get_suggested_courses(username)
    
    if "courses" in result and isinstance(result["courses"], set):
        course_ids = list(result["courses"])

        # Query full course info
        courses = Course.query.filter(Course.course_id.in_(course_ids)).all()

        # Build list of full course info
        result["courses"] = [
            {
                "course_id": course.course_id,
                "course_name": course.course_name,
                "credits": course.credits
            }
            for course in courses
        ]

    return jsonify(result)