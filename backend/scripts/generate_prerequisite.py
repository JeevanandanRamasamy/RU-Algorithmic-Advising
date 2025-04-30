from db import db
from app import app
from models.course import Course
from services.requirement_service import RequirementService
import json


class Prerequisites:
    """
    This class is responsible for generating and saving course prerequisites
    in a JSON file. It uses the RequirementService to fetch the prerequisites
    for each course and formats them into a string representation.
    """

    @staticmethod
    def generate_course_requirement_string(course_id):
        """
        Generates a string representation of the course requirements for a given course ID.
        :param course_id: The ID of the course for which to generate the requirements string.
        :return: A string representation of the course requirements.
        """
        prerequisites = RequirementService.get_prerequisites_tree(course_id)
        if prerequisites:
            return prerequisites.requirement_str() if prerequisites != "" else ""
        return ""

    @staticmethod
    def generate_all_course_requirements():
        """
        Generates and saves the course requirements for all courses in the database
        to a JSON file. The JSON file will contain a mapping of course IDs to their
        respective requirement strings.
        """
        with app.app_context():
            all_courses = db.session.query(Course).all()
            course_requirements = {}

            for course in all_courses:
                course_id = course.course_id
                course_requirements_string = (
                    Prerequisites.generate_course_requirement_string(course_id)
                )
                if course_requirements_string:
                    course_requirements[course_id] = course_requirements_string
            with open("data/prerequisites.json", "w") as json_file:
                json.dump(course_requirements, json_file, indent=4)
            print("Requirements have been generated and saved to prerequisites.json")


if __name__ == "__main__":
    Prerequisites.generate_all_course_requirements()
