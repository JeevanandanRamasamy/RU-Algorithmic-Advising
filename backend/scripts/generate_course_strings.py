from services.course_service import CourseService
from db import db
from app import app
from models.course import Course
import json


class CourseStrings:
    @staticmethod
    def generate_all_course_requirements():

        with app.app_context():
            all_courses = db.session.query(Course).all()
            course_strings = {}

            for course in all_courses:
                course_id = course.course_id
                course_string = CourseService.get_course_string(course_id)
                if course_string:
                    course_strings[course_id] = course_string
            with open("data/course_strings.json", "w") as json_file:
                json.dump(course_strings, json_file, indent=4)
            print("Requirements have been generated and saved to course_strings.json")


if __name__ == "__main__":
    CourseStrings.generate_all_course_requirements()
