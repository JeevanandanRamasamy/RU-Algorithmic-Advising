from flask import Blueprint, jsonify
from services.course_service import RutgersCourseAPI

# Define a Blueprint for course-related routes
course_bp = Blueprint('courses', __name__)

@course_bp.route('/api/courses', methods=['GET'])
def get_courses():
    """
    API endpoint to fetch and return course information from the Rutgers SOC API.
    """
    api = RutgersCourseAPI(subject='198', semester='12025', campus='NB', level='UG')
    courses = api.get_courses()
    return jsonify(courses)

