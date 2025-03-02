import os
import re
import json
import requests
import pandas as pd
from dotenv import load_dotenv
from sympy import symbols
from sympy.logic.boolalg import Or, And, simplify_logic
from backend.services.db_service import DBService
from models import RequirementGroup, Course
from db import db
from app import app

load_dotenv()
BRAVE_API_KEY = os.getenv("BRAVE_API_KEY")
SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"


def get_json(url):
    response = requests.get(url)
    return response.json()


def search_course_url(courseID, course_name):
    """Searches for the first course URL using Brave Search API."""
    query = f"Rutgers {courseID} {course_name}"
    headers = {"Accept": "application/json", "X-Subscription-Token": BRAVE_API_KEY}
    params = {"q": query, "count": 1}

    response = requests.get(SEARCH_URL, headers=headers, params=params)
    response.raise_for_status()  # Raises an error for bad responses
    data = response.json()

    if "web" in data and "results" in data["web"]:
        return data["web"]["results"][0]["url"]  # Get first result URL
    return None


def parse_and_simplify_prereqs(subject, pre_reqs):
    if not pre_reqs:
        return None

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
    if prereq_str.find("course from the following:") != -1:
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

        course_name = (course.get("expandedTitle") or course.get("title") or "").strip()
        credits = course.get("credits", None)
        course_link = course.get("synopsisUrl", None)
        prerequisites = parse_and_simplify_prereqs(
            course["subject"], course.get("preReqNotes", None)
        )
        # print(f"{course_id} - {course_name} ({credits}): {course_link}\n{course['preReqNotes']}\n{prerequisites}")

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


def get_course_list():
    # Check if the courses.csv file already exists
    if os.path.exists("backend/courses.csv"):
        courses = pd.read_csv("backend/courses.csv").to_dict(orient="records")
        print(f"Loaded {len(courses)} courses from existing file.")
    else:
        courses = []
        print("No existing course file found. Starting fresh.")

    course_list = "https://sis.rutgers.edu/oldsoc/init.json"
    courses_json = get_json(course_list)
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
        for subject in courses_json["subjects"]:
            subject_code = subject["code"]
            subject_url = f"https://sis.rutgers.edu/oldsoc/courses.json?subject={subject_code}&semester={semester}&campus=NB&level=UG"
            json_data = get_json(subject_url)
            courses = parse_courses(json_data, courses)
        print(f"Parsed {semester}")

    # Save the courses to a CSV file
    print(f"Total courses parsed: {len(courses)}")
    df = pd.DataFrame(courses)
    df.to_csv("backend/courses.csv", index=False)


def add_prerequisites_to_database(courseID, prerequisites, parent_group_id=None):
    """
    Recursively add prerequisites to the RequirementGroup table.
    """
    # Check if format ##:###:###
    if re.fullmatch(r"\d{2}:\d{3}:\d{3}", prerequisites):
        # If we are processing a single course
        group = {
            "course_id": courseID,
            "min_required": 1,
            "list": [prerequisites],
            "parent_group_id": parent_group_id,
        }
        result = DBService.insert_requirement_group(group)
        if isinstance(result, RequirementGroup):
            print(f"Added course: {group}")
    else:
        # If we are processing a group of prerequisites (AND/OR)
        prerequisites = json.loads(prerequisites.replace("'", '"'))
        logic = prerequisites.get("logic")
        requirements = prerequisites.get("requirements")

        group = {
            "course_id": courseID,
            "logic": logic,
            "parent_group_id": parent_group_id,
        }
        group_result = DBService.insert_requirement_group(group)
        if not isinstance(group_result, RequirementGroup):
            return
        print(f"Adding group: {group_result}")

        same_group = []
        for requirement in requirements:
            if isinstance(requirement, dict):
                # Recursive call for nested groups
                add_prerequisites_to_database(
                    courseID=None,
                    prerequisites=str(requirement),
                    parent_group_id=group.group_id,
                )
            else:
                same_group.append(requirement)

        if same_group:
            sub_group = {"parent_group_id": group.group_id, "list": same_group}
            if logic == "AND":
                sub_group["min_required"] = 0
            elif logic == "OR":
                sub_group["min_required"] = 1
            elif logic.startswith("ATLEAST"):
                sub_group["min_required"] = int(logic.split(" ")[1])

            sub_group_result = DBService.insert_requirement_group(sub_group)
            if isinstance(sub_group_result, RequirementGroup):
                print(f"Adding sub-group: {sub_group_result}")


def add_courses_to_database(filename):
    with app.app_context():
        db.create_all()
        df = pd.read_csv(filename)
        for _, row in df.iterrows():
            course = {
                "course_id": row["course_id"],
                "course_name": row["course_name"],
                "credits": row["credits"],
                "course_link": row["course_link"],
            }
            course_result = DBService.insert_course(course)
            if isinstance(course_result, Course):
                print(f"Added course: {course_result}")
                if pd.notna(row["prerequisites"]):
                    add_prerequisites_to_database(
                        row["course_id"], row["prerequisites"]
                    )
        print("Courses added to database successfully!")


def compare_files(file1, file2):
    df1 = pd.read_csv(file1)
    df2 = pd.read_csv(file2)
    merged_df = pd.merge(df1, df2, on="course_id", how="outer", indicator=True)

    # Courses in file1 but not in file2
    only_in_file1 = merged_df[merged_df["_merge"] == "left_only"]
    missing_courses = df1[df1["course_id"].isin(only_in_file1["course_id"])]
    print(f"Courses in {file1} but not in {file2}:")
    print(missing_courses)

    # Courses in file1 with prereqs but missing prereqs in file2
    prereq_missing = df1.merge(df2, on="course_id", suffixes=("_file1", "_file2"))
    prereq_missing = prereq_missing[
        (prereq_missing["prerequisites_file1"].notna())
        & (prereq_missing["prerequisites_file2"].isna())
    ]
    print(f"Courses in {file1} with prereqs but missing prereqs in {file2}:")
    print(prereq_missing)

    # Update missing prerequisites in df1
    for _, row in prereq_missing.iterrows():
        df2.loc[df2["course_id"] == row["course_id"], "prerequisites"] = row[
            "prerequisites_file1"
        ]
    df2 = pd.concat([df2, missing_courses], ignore_index=True)
    df2.to_csv(file2, index=False)


def add_course_urls(filename, row_range=(0, 1900)):
    df = pd.read_csv(filename)
    start, end = row_range

    for i, row in df.iloc[start:end].iterrows():
        course_id = row["course_id"]
        course_name = row["course_name"]
        course_link = search_course_url(course_id, course_name)
        if course_link:
            df.at[i, "course_link"] = course_link
    df.to_csv(filename, index=False)
    print(f"Updated {filename} with course URLs.")


if __name__ == "__main__":
    # get_course_list()
    # compare_files("backend/courses.csv", "backend/course_list.csv")
    add_courses_to_database("backend/course_list.csv")
    # add_course_urls("backend/course_list.csv", row_range=(0, 10))
