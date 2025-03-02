from flask import Blueprint, jsonify, request
from models import Course  # Import the Course model
from sqlalchemy import or_ 

# Define a Blueprint for database-related course routes
db_course_bp = Blueprint('db_courses', __name__)

@db_course_bp.route('/api/db_courses', methods=['GET'])
def get_db_courses():
    """
    API endpoint to fetch course information from the database.
    Supports search functionality based on course name.
    """
    search = request.args.get('search', '').strip()  # Get the search query, default to an empty string if not provided

    try:
        if search:
            # If search query is provided, filter courses based on course name
            courses = Course.query.filter(
                or_(
                    Course.course_name.ilike(f"%{search}%"),
                    Course.course_id.ilike(f"%{search}%")
                )
            ).all()
        else:
            # If no search query, return all courses
            courses = Course.query.all()
        
        course_list = [
            {
                'course_id': course.course_id,
                'course_name': course.course_name,
                'credits': course.credits,
                'course_link': course.course_link
            }
            for course in courses
        ]
        return jsonify(course_list), 200
    except Exception as e:
        return jsonify({'message': f"Error fetching courses: {e}"}), 500
