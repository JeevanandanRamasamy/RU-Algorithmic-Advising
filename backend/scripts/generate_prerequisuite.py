from db import db
from app import app
from models.course import Course
from services.requirement_service import RequirementService
import json


class Prerequisuites:
    @staticmethod
    def generate_course_requirement_string(course_id):
        prerequisuites = RequirementService.get_prerequisites_tree(course_id)
        if prerequisuites:
            return prerequisuites.requirement_str() if prerequisuites != "" else ""
        return ""

    @staticmethod
    def generate_all_course_requirements():

        with app.app_context():
            all_courses = db.session.query(Course).all()
            course_requirements = {}

            for course in all_courses:
                course_id = course.course_id
                course_requirements_string = (
                    Prerequisuites.generate_course_requirement_string(course_id)
                )
                if course_requirements_string:
                    course_requirements[course_id] = course_requirements_string
            with open("data/prerequisites.json", "w") as json_file:
                json.dump(course_requirements, json_file, indent=4)
            print("Requirements have been generated and saved to prerequisites.json")


if __name__ == "__main__":
    Prerequisuites.generate_all_course_requirements()
