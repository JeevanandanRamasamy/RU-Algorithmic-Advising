from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.user_plan_service import (
    UserPlanService,
)  # Import the service layer for planned course-related operations

# Define a Blueprint for planned courses
planned_courses_bp = Blueprint(
    "planned_courses", __name__, url_prefix="/api/users/planned_courses"
)

# Get all planned courses for the logged-in user
@planned_courses_bp.route("", methods=["GET"])
@jwt_required()  # Ensure the user is authenticated using JWT
def get_planned_courses():
    try:
        # Call the service to get the planned courses for the logged-in user
        username = get_jwt_identity()
        planned_courses = UserPlanService.get_planned_courses_for_user(username)
        if isinstance(planned_courses, str):
            return jsonify({"message", planned_courses}), 500
        return (
            jsonify(
                {
                    "message": f"Planned Courses retrieved for user {username}",
                    "planned_courses": planned_courses,
                }
            ),
            200,
        )
        # if isinstance(
        #     planned_courses, list
        # ):  # Check if the return value is a valid list
        #     response_data = {
        #         "plan_id": (
        #             planned_courses[0].get("plan_id") if planned_courses else None
        #         ),
        #         "courses": planned_courses,
        #     }
        #     return jsonify(response_data), 200
        # else:
        #     return (
        #         jsonify({"message": planned_courses}),
        #         500,
        #     )  # Return error message if something went wrong
    except Exception as e:
        return jsonify({"message": f"Error fetching planned courses: {str(e)}"}), 500


# Add course to the user's planned courses
@planned_courses_bp.route("", methods=["POST"])
@jwt_required()  # Ensure the user is authenticated
def add_planned_course():
    data = request.get_json()
    course_id = data.get("course_id")
    term = data.get("term")
    year = data.get("year")
    plan_id = 1
    # term = "Summer"
    # year = 2025

    if not course_id or not term or not year:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        # Call the service function to add the course to the user's planned courses
        planned_course = UserPlanService.add_course_to_plan(
            course_id, plan_id, term, year
        )

        if isinstance(planned_course, str):
            return jsonify({"message", planned_course}), 500
        return jsonify(
            {"message": f"Planned Course inserted", "planned_course": planned_course}
        )
    except Exception as e:
        return jsonify({"message": f"Error adding planned course: {str(e)}"}), 500


@planned_courses_bp.route("", methods=["DELETE"])
@jwt_required()  # Ensure the user is authenticated
def drop_planned_course():
    print("dpc")
    data = request.get_json()
    course_id = data.get("course_id")
    # plan_id = data.get("plan_id")

    # if not course_id or not plan_id:
    if not course_id:
        return jsonify({"message": "Missing required fields"}), 400

    try:
        # Call the service function to remove the course from the user's planned courses
        response = UserPlanService.drop_course_from_plan(course_id)
        print(response)

        if isinstance(response, dict):
            return jsonify(response), 200  # Successfully removed
        else:
            return jsonify({"message": response}), 500  # Error message
    except Exception as e:
        return jsonify({"message": f"Error removing planned course: {str(e)}"}), 500
