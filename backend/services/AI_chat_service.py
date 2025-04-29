from google import genai
from google.genai import types
import os
import time
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY)

class AIChatService:
    """
    Service class to handle AI chat functionalities.
    """

    # Class-level variable to hold user information for the session
    user_info_cache = None
    conversation_history = ""

    @classmethod
    def set_user_info(cls, user_info):
        """
        Set user information for the session.
        This will be done only once per session.
        """
        cls.user_info_cache = user_info


    @staticmethod
    def get_chat_response(user_message):
        """
        Function to get a chat response from the AI model.
        Uses cached user information.
        """
        while not AIChatService.user_info_cache:
            print("User information is not cached. Waiting for cache...")
            time.sleep(1)
        
        user_info = AIChatService.user_info_cache

        # Start the conversation with a system message that provides context or instructions
        system_message = (
            "You are Algorithmic Advisor (part of the RU Super Scheduler website), an expert academic assistant specifically designed for Rutgers University students. "
            "Your role is to guide students through course scheduling, degree progress tracking, and SPN (Special Permission Number) request management. "
            "You have access to the student's academic background, including their programs, GPA, credits earned, taken courses, missing degree requirements, and suggested future courses. "
            "You do NOT have access to live course availability, semester offerings, or real-time enrollment data — make this clear if asked.\n\n"

            "Your communication style should be professional, friendly, supportive, and highly informative. "
            "Prioritize clarity, relevance, and actionable advice. Always tailor your answers to the specific student based on the provided user information. "
            "Focus on practical solutions, academic planning tips, and clear next steps wherever possible.\n\n"

            "If a student's question is ambiguous or incomplete, politely ask clarifying questions. "
            "If a student requests information outside your scope (such as course timings, instructor info, or live registration data), politely explain that you cannot provide that and guide them toward the appropriate university resource.\n\n"

            "Before replying, always verify that your answer is factually accurate, contextually appropriate, and specifically helpful to the student's academic journey. "
            "Stay concise but detailed enough to fully address the student's question. "
            "Encourage the student to ask follow-up questions if they need more help. "
            "Stay positive and solution-oriented at all times."
        )

        user_info_message = (
            "User Information:\n"
            f"Name: {user_info['first_name']} {user_info['last_name']}\n"
            f"Enrollment Year: {user_info['enroll_year']}\n"
            f"Graduation Year: {user_info['grad_year']}\n"
            f"Credits Earned: {user_info['credits_earned']}\n"
            f"GPA: {user_info['gpa']}\n"
            f"Current Program(s): {user_info['program']}\n"
            f"Courses Taken: {user_info['taken_courses']}\n"
            f"Missing Requirements for each program(s): {user_info['missing_requirements']}\n"
            f"Suggested Courses for upcoming semester: {user_info['suggested_courses']}\n"
        )

        conversation = (
            f"{user_info_message}\n\n"
            f"{AIChatService.conversation_history}\n"
            f"User: {user_message}"
        )

        # Append the user's message to the conversation history
        AIChatService.conversation_history += f"User: {user_message}\n"

        # Get AI response
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(system_instruction=system_message),
            contents=conversation,
        )

        # Append the AI's response to the conversation history
        AIChatService.conversation_history += f"AI: {response.text}\n"
        return response.text