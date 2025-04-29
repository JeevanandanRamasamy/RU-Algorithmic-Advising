from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint, jsonify, request
from services.AI_chat_service import AIChatService
from services.user_service import UserService
from services.user_program_service import UserProgramService
from services.course_record_service import CourseRecordService
from services.requirement_service import RequirementService

AI_chat_bp = Blueprint("AI_chat", __name__, url_prefix="/api/AI_chat")


@AI_chat_bp.route("/set_user_info", methods=["POST"])
@jwt_required()
def set_user_info():
    """
    API endpoint to set user information for the AI chat session.
    """
    try:
        # Retrieve the username from the JWT identity
        username = get_jwt_identity()

        # Fetch user details from various services based on the username
        user = UserService.get_account_by_username(username)
        details = UserService.get_student_details(username)
        programs = UserProgramService.get_student_programs(username)
        taken_courses = CourseRecordService.get_past_course_records(username)

        # Determine missing requirements and suggested courses for the user
        missing_requirements = []
        for program in programs:
            reqs = RequirementService.get_missing_requirements(username, program.program_id)
            missing_requirements.append(program.program_name + ": [" + ", ".join(reqs) + "]")
        suggested_courses = RequirementService.get_suggested_courses(username)

        # Construct the user_info dictionary
        user_info = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "enroll_year": details.enroll_year,
            "grad_year": details.grad_year,
            "credits_earned": details.credits_earned,
            "gpa": details.gpa,
            "program": ", ".join([program.program_name for program in programs]),
            "taken_courses": ", ".join([course["course_info"]["course_id"] for course in taken_courses]),
            "missing_requirements": ", ".join([req for req in missing_requirements]),
            "suggested_courses": ", ".join([course for course in suggested_courses["courses"]]),
        }

        # Log user information for debugging
        print(f"[AIChatService] User info: {user_info}")

        # Cache or process the user info for the AI chat service
        AIChatService.set_user_info(user_info)

        # Return a success message
        return jsonify({"message": "User information successfully set"}), 200

    except Exception as e:
        # Handle any errors and log them
        print(f"[AIChatService Error] {str(e)}")
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500


@AI_chat_bp.route("", methods=["POST"])
@jwt_required()
def get_chat_response():
    """
    API endpoint to get a chat response from the AI model.
    """
    try:
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"message": "Missing 'message' in request body"}), 400
        
        response = AIChatService.get_chat_response(data["message"])
        return (
            jsonify(
                {
                    "message": "Chat response successfully retrieved",
                    "response": response.text if hasattr(response, "text") else response,
                }
            ),
            200,
        )
    except Exception as e:
        print(f"[AIChatService Error] {str(e)}")
        return jsonify({"message": f"Internal server error: {str(e)}"}), 500