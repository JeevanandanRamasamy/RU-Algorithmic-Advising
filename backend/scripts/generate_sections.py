import json
import requests

from app import create_app
from services.course_soc_service import RutgersCourseAPI


def get_json(url):
    """Fetches JSON data from a URL."""
    response = requests.get(url)
    return response.json()


def generate_all_courses_with_sections():
    departments_api = "https://sis.rutgers.edu/oldsoc/init.json"
    department_list = get_json(departments_api)
    semesters = ["72025", "92025"]
    # semesters = ["72025"]
    campus = "NB"
    level = "UG"
    course_with_sections = {}
    subject_codes = {subject["code"] for subject in department_list["subjects"]}
    for semester in semesters:
        for subject in subject_codes:
            api = RutgersCourseAPI(
                subject=subject, semester=semester, campus=campus, level=level
            )
            api.get_courses(course_with_sections)
            # print(courses)
            # course_list.extend(courses)

        with open(f"data/sections{semester}.json", "w") as json_file:
            json.dump(course_with_sections, json_file, indent=4)
        print(
            f"Sections for semester {semester} have been generated and saved to sections.json"
        )


if __name__ == "__main__":
    app = (
        create_app()
    )  # you might have a different function that initializes your Flask app
    with app.app_context():
        generate_all_courses_with_sections()
