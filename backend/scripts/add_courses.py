import os
import sys

# Add backend/ to sys.path so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import re
import json
import requests
import pandas as pd
from services.requirement_group_service import RequirementGroupService
from sympy import symbols
from sympy.logic.boolalg import Or, And, simplify_logic
from services.requirement_group_service import RequirementGroupService
from models.requirement_group import RequirementGroup
from models.course import Course
from db import db
from app import create_app
from services.course_service import CourseService

def get_json(url):
    """
    Fetches JSON data from a URL.
    """
    response = requests.get(url)
    return response.json()


def parse_and_simplify_prereqs(subject, pre_reqs):
    """
    Parses and simplifies the course prerequisites string into a logical structure.
    Args:
        subject (str): The subject code of the course.
        pre_reqs (str): The prerequisites string to parse.
    Returns:
        dict: A dictionary representing the logical structure of the prerequisites.
    """
    if not pre_reqs:
        return None

    # Remove any tokens outside of the format
    prereq_str = re.sub(r"<[^>]+>", "", pre_reqs).lower()
    prereq_str = re.sub("any course equal or greater than:", "", prereq_str)
    if prereq_str.endswith("course within the subject area:"):
        prereq_str = prereq_str.split(" ")[0]  # Get the first token
        # convert from word to number
        prereq_str = (
            prereq_str.replace("one", "1")
            .replace("two", "2")
            .replace("three", "3")
            .replace("four", "4")
            .replace("five", "5")
            .replace("six", "6")
            .replace("seven", "7")
            .replace("eight", "8")
            .replace("nine", "9")
            .replace("ten", "10")
        )
        return {"logic": f"ATLEAST {prereq_str}", "courses": [f"XX:{subject}:XXX"]}
    if (
        prereq_str.find("course from the following:") != -1
    ):  # if the prereq is a list of courses
        number = prereq_str.split(" ")[1]
        number = (
            number.replace("one", "1")
            .replace("two", "2")
            .replace("three", "3")
            .replace("four", "4")
            .replace("five", "5")
            .replace("six", "6")
            .replace("seven", "7")
            .replace("eight", "8")
            .replace("nine", "9")
            .replace("ten", "10")
        )
        matches = re.findall(r"\b\d{2}:\d{3}:\d{3}\b", prereq_str)
        return {"logic": f"ATLEAST {number}", "courses": matches}

    # Extract all unique course IDs using regex
    course_ids = sorted(set(re.findall(r"\d{2}:\d{3}:\d{3}", prereq_str)))

    # Create symbolic variables for each course
    course_symbols = {
        course: symbols(f"C{idx}") for idx, course in enumerate(course_ids)
    }

    # Replace 'and' and 'or' with Python logical operators for parsing
    temp_expr = prereq_str
    for course, sym in course_symbols.items():
        temp_expr = temp_expr.replace(course, str(sym))

    temp_expr = temp_expr.replace(" and ", " & ").replace(" or ", " | ")

    # Use sympy's parsing method to evaluate the Boolean expression
    boolean_expr = parse_logic(temp_expr, course_symbols)

    # Simplify the Boolean expression
    simplified_expr = simplify_logic(
        boolean_expr, form="dnf"
    )  # Disjunctive Normal Form

    # Convert back to human-readable structure
    def expr_to_dict(expr):
        if isinstance(expr, And):
            return {"logic": "AND", "courses": [expr_to_dict(arg) for arg in expr.args]}
        elif isinstance(expr, Or):
            return {"logic": "OR", "courses": [expr_to_dict(arg) for arg in expr.args]}
        else:
            # Convert symbolic variable back to course ID
            return next(course for course, sym in course_symbols.items() if sym == expr)

    return expr_to_dict(simplified_expr)


def parse_logic(temp_expr, course_symbols):
    """
    Converts a string logic expression into sympy Boolean operations.

    Args:
        temp_expr (str): The expression string to parse.
        course_symbols (dict): A mapping of course IDs to sympy symbols.

    Returns:
        sympy expression: The Boolean expression.
    """
    # Replace course symbols and operators with sympy logic
    for course, sym in reversed(course_symbols.items()):
        temp_expr = temp_expr.replace(str(sym), f"course_symbols['{course}']")
    return eval(temp_expr)  # Using the course symbols directly in eval


def parse_courses(json_data, courses):
    """Parses the JSON data and updates the courses list."""
    # Convert list of courses to a dictionary for faster lookups
    course_dict = {course["course_id"]: course for course in courses}

    for course in json_data:
        course_id = (
            course["offeringUnitCode"]
            + ":"
            + course["subject"]
            + ":"
            + course["courseNumber"]
        )
        existing = course_id in course_dict

        # Extract course data
        course_name = (course.get("expandedTitle") or course.get("title") or "").strip()
        credits = course.get("credits", None)
        course_link = course.get("synopsisUrl", None)
        prerequisites = parse_and_simplify_prereqs(
            course["subject"], course.get("preReqNotes", None)
        )

        if existing:
            if prerequisites and course_dict[course_id]["prerequisites"] is None:
                # If course exists but prerequisites are missing, update them
                course_dict[course_id]["prerequisites"] = prerequisites
        else:  # Add new course
            course_dict[course_id] = {
                "course_id": course_id,
                "course_name": course_name,
                "credits": credits,
                "course_link": course_link,
                "prerequisites": prerequisites,
            }
    # Convert the dictionary back to a list
    return list(course_dict.values())


def get_course_list(file_name):
    """Fetches course data from the Rutgers API and saves it to a CSV file."""
    # Check if the CSV file already exists
    if os.path.exists(file_name):
        course_list = pd.read_csv(file_name).to_dict(orient="records")
        print(f"Loaded {len(course_list)} courses from existing file.")
    else:
        course_list = []
        print("No existing course file found. Starting fresh.")

    # Loop through all semesters and subjects to get course data
    departments_api = "https://sis.rutgers.edu/oldsoc/init.json"
    department_list = get_json(departments_api)
    semesters = [
        f"{month}{year}"
        for year in ["2025", "2024", "2023", "2022"]
        for month in [
            "9",
            "7",
            "1",
        ]
    ]
    for semester in semesters:
        for subject in department_list["subjects"]:
            subject_code = subject["code"]
            subject_url = f"https://sis.rutgers.edu/oldsoc/courses.json?subject={subject_code}&semester={semester}&campus=NB&level=UG"
            json_data = get_json(subject_url)
            course_list = parse_courses(json_data, course_list)
        print(f"Parsed {semester}")

    # Save the courses to a CSV file
    print(f"Total courses parsed: {len(course_list)}")
    df = pd.DataFrame(course_list)
    df.to_csv(file_name, index=False)


def add_prerequisites_to_database(courseID, prerequisites, parent_group_id=None):
    """
    Recursively add prerequisites to the RequirementGroup table.
    """
    # Check if format ##:###:###
    if re.fullmatch(r"\d{2}:\d{3}:\d{3}", prerequisites):
        # If we are processing a single course
        group = {
            "course_id": courseID,
            "num_required": 1,
            "list": [prerequisites],
            "parent_group_id": parent_group_id,
        }
        result = RequirementGroupService.insert_requirement_group(group)
        if isinstance(result, RequirementGroup): # Check if insertion was successful
            print(f"Added group: {result}")
    else:
        # If we are processing a group of prerequisites (AND/OR)
        prerequisites = json.loads(prerequisites.replace("'", '"'))
        logic = prerequisites.get("logic")
        requirements = prerequisites.get("requirements")

        group = {"course_id": courseID, "parent_group_id": parent_group_id}
        if logic == "AND":
            group["num_required"] = 0 # 0 means all are required
        elif logic == "OR":
            group["num_required"] = 1
        elif logic.startswith("ATLEAST"):
            group["num_required"] = int(logic.split(" ")[1])
        if "logic" not in str(requirements):
            # If there are no nested groups
            group["list"] = requirements
        group_result = RequirementGroupService.insert_requirement_group(group)
        if not isinstance(group_result, RequirementGroup): # Check if insertion was successful
            return
        print(f"Added group: {group_result}")

        if "logic" in str(requirements):
            # If there are nested groups
            same_group = []
            for requirement in requirements:
                if isinstance(requirement, dict):
                    # Recursive call for nested groups
                    add_prerequisites_to_database(
                        courseID=None,
                        prerequisites=str(requirement),
                        parent_group_id=group_result.group_id,
                    )
                else:
                    same_group.append(requirement)

            if same_group: # If there are courses in the same group
                sub_group = {
                    "parent_group_id": group_result.group_id,
                    "list": same_group,
                }
                if logic == "AND":
                    sub_group["num_required"] = 0 # 0 means all are required
                elif logic == "OR":
                    sub_group["num_required"] = 1
                elif logic.startswith("ATLEAST"):
                    sub_group["num_required"] = int(logic.split(" ")[1])

                sub_group_result = RequirementGroupService.insert_requirement_group(
                    sub_group
                )
                if isinstance(sub_group_result, RequirementGroup): # Check if insertion was successful
                    print(f"Added sub-group: {sub_group_result}")


def add_courses_to_database(filename):
    """Adds courses from a CSV file to the database."""
    app = create_app()
    with app.app_context():
        db.create_all() # Create tables if they don't exist
        df = pd.read_csv(filename)

        # Handle missing values for credits and course_link
        df["credits"] = df["credits"].fillna(0) # Default to 0 if NaN
        df["course_link"] = df["course_link"].where(pd.notna(df["course_link"]), None)

        # Add courses to the database
        for _, row in df.iterrows():
            course = {
                "course_id": row["course_id"],
                "course_name": row["course_name"],
                "credits": row["credits"],
                "course_link": row["course_link"],
            }
            course_result = CourseService.insert_course(course)
            if isinstance(course_result, Course):  # Check if insertion was successful
                print(f"Added course: {course_result}")
                if pd.notna(row["prerequisites"]):  # Add prerequisites if they exist
                    add_prerequisites_to_database(
                        row["course_id"], row["prerequisites"]
                    )
            else:
                print(course_result)
                print(f"Error adding course: {course}")
                break
        print("Courses added to database successfully!")


if __name__ == "__main__":
    file_name = "course_list.csv"
    # get_course_list(file_name) # Uncomment to fetch new data (this will take a while)
    add_courses_to_database(file_name)
