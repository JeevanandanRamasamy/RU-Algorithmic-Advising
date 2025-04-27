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
            "You are an intelligent assistant for RU Super Scheduler, designed to help students "
            "manage and access all information related to course scheduling, degree progress, "
            "and SPN request management at Rutgers. You provide clear, informative, and helpful "
            "answers regarding degree requirements, progress tracking, and SPN requests. You do not "
            "have access to course availability or offering information. Your tone should be professional yet friendly, "
            "and your responses should always be practical, easy to understand, and directly relevant to the "
            "user’s needs.\n\n"
            
            "User Information:\n"
            f"Name: {user_info['first_name']} {user_info['last_name']}\n"
            f"Enrollment Year: {user_info['enroll_year']}\n"
            f"Graduation Year: {user_info['grad_year']}\n"
            f"Credits Earned: {user_info['credits_earned']}\n"
            f"GPA: {user_info['gpa']}\n"
            f"Current Program(s): {user_info['program']}\n"
            f"Courses Taken: {user_info['taken_courses']}\n"
            f"Missing Requirements for all programs: {user_info['missing_requirements']}\n"
            f"Suggested Courses for upcoming semester: {user_info['suggested_courses']}\n"
            
            "Please provide a detailed and accurate response to the user's query. Use the information "
            "provided to tailor your response to the user's academic situation. If the user asks for "
            "information outside your expertise, politely inform them that you cannot assist with that."

            "Always double-check your responses for accuracy and relevance before sending them to the user."
            "If you need to ask clarifying questions, do so in a friendly and professional manner."

            f"\n\nConversation History:\n {AIChatService.conversation_history}"
        )

        # Append the user's message to the conversation history
        AIChatService.conversation_history += f"User: {user_message}\n"

        # Get AI response
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            config=types.GenerateContentConfig(system_instruction=system_message),
            contents=user_message,
        )

        # Append the AI's response to the conversation history
        AIChatService.conversation_history += f"AI: {response.text}\n"
        return response.text