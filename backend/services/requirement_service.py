import os
import re
from services.semesters_service import SemestersService
from models.requirement_group_node import RequirementGroupNode
from services.requirement_group_service import RequirementGroupService
from services.program_service import ProgramService
from services.course_service import CourseService
from services.course_record_service import CourseRecordService
from services.user_program_service import UserProgramService
import json

ALWAYS_TAKEN_COURSES = {"01:640:112", "01:356:156"}  # Placement courses

PREREQUISITES_FILE_PATH = os.path.join(
    os.path.dirname(__file__), "..", "data", "prerequisites.json"
)


class RequirementService:
    """
    Service class for managing course requirements.
    This includes retrieving, validating, and checking requirements for courses and programs.
    """

    @staticmethod
    def get_prerequisites_tree(course_id):
        """
        Build a hierarchical tree of prerequisites for a course.
        Returns a RequirementGroupNode tree.
        """
        requirement_groups = RequirementGroupService.get_requirement_group_by_course(
            course_id
        )
        if not requirement_groups:
            return ""
        group = requirement_groups[0]
        root = RequirementService.build_tree_from_group(group)
        return root

    # Create a tree from a program
    @staticmethod
    def get_program_requirement_tree(program_id):
        """
        Build a hierarchical tree of requirements for a program.
        Returns a list of root RequirementGroupNode trees.
        """
        top_groups = RequirementGroupService.get_requirement_group_by_program(
            program_id
        )

        if not top_groups:
            return []  # No requirement groups found for the program

        root_nodes = []
        for group in top_groups:
            if group.parent_group_id is None:  # Only consider top-level groups
                root = RequirementService.build_tree_from_group(group)
                root_nodes.append(root)

        return root_nodes

    @staticmethod
    def build_tree_from_group(group):
        """
        Recursively build a tree of RequirementGroupNode from a given group.
        """
        root = RequirementGroupNode(
            course_id=group.course_id,
            num_required=group.num_required,
            group_id=group.group_id,
            parent_group_id=group.parent_group_id,
            lst=group.list,
        )
        child_groups = RequirementGroupService.get_child_requirement_groups(
            group.group_id
        )

        if child_groups:
            for child_group in child_groups:  # Recursively build child nodes
                child_node = RequirementService.build_tree_from_group(child_group)
                root.prerequisites.append(child_node)
        return root

    @staticmethod
    def get_all_prerequisites(course_id, visited=None):
        """
        Retrieve all prerequisite courses for a given course.
        """
        if visited is None:
            visited = set()  # Keep track of visited courses to avoid infinite loops
        course = CourseService.get_course_by_id(course_id)
        if not course or course_id in visited:
            return (
                set()
            )  # Return an empty set if the course does not exist or has been visited
        visited.add(course_id)  # Mark this course as visited

        requirement_groups = RequirementGroupService.get_requirement_group_by_course(
            course_id
        )
        if not requirement_groups:
            return set()  # No requirement groups found for the course
        prerequisites = set()

        for group in requirement_groups:
            if group.list:
                prerequisites.update(group.list)

            # Recursively get prerequisites from child groups
            child_groups = RequirementGroupService.get_child_requirement_groups(
                group.group_id
            )
            for child in child_groups:
                if child.list:  # Add child group courses to prerequisites
                    prerequisites.update(child.list)
                prerequisites.update(
                    RequirementService.get_all_prerequisites(child.group_id, visited)
                )

        return prerequisites

    @staticmethod
    def check_courses_missing_requirements(student_details, courses_to_check):
        """
        Fetch courses that a student is missing based on their current credits and requirements.
        """
        username, enroll_year, grad_year = (
            student_details.username,
            int(student_details.enroll_year),
            int(student_details.grad_year),
        )  # Extract username and years from student details
        print(enroll_year)
        semesters = SemestersService.generate_semesters_till_now(enroll_year)
        res = {}

        extra_courses = set()
        courses_taken = CourseRecordService.get_past_course_records(username)
        courses_taken = {course["course_info"]["course_id"] for course in courses_taken}
        courses_taken.update(extra_courses or set())  # Add extra courses to the set
        courses_taken.update(ALWAYS_TAKEN_COURSES)
        math_courses = {
            course for course in courses_taken if course.startswith("01:640:")
        }
        math_prereqs = set()
        for course in math_courses:  # Handle math courses separately
            math_prereqs.update(RequirementService.get_all_prerequisites(course))
        courses_taken.update(math_prereqs)

        with open(PREREQUISITES_FILE_PATH, "r") as json_file:
            course_requirements = json.load(
                json_file
            )  # Load course requirements from JSON file

        for semester in semesters:
            term, year = semester["term"], semester["year"]
            course_records = CourseRecordService.get_course_record_by_term(
                username=username, term=term, year=year
            )
            {course["course_info"]["course_id"] for course in course_records}
            courses_taken.update(extra_courses or set())

        for course_id in courses_to_check:
            prerequisite = RequirementService.get_all_prerequisites(
                course_id, visited=None
            )
            updated_string = (
                RequirementService.validate_prerequisite_string(
                    prerequisite_string=course_requirements[course_id],
                    prerequisite=prerequisite,
                    taken_courses=courses_taken,
                )
                if course_id in course_requirements
                else ""
            )

            requirements_fulfilled = RequirementService.check_requirements_met(
                username,
                course_id=course_id,
                extra_courses=extra_courses,
            )  # Check if requirements are met for the course
            res[course_id] = {
                "requirements_fulfilled": requirements_fulfilled,
                "requirement_string": updated_string,
            }  # Update the result dictionary with course info
        return res

    @staticmethod
    def fetch_courses_missing_requirements(student_details):
        """
        Fetch courses that a student is missing based on their current credits and requirements.
        """
        username, enroll_year, grad_year = (
            student_details.username,
            int(student_details.enroll_year),
            int(student_details.grad_year),
        )  # Extract username and years from student details
        semesters = SemestersService.generate_future_semesters(grad_year=grad_year)
        res = {}

        extra_courses = set()
        courses_taken = CourseRecordService.get_past_course_records(username)
        courses_taken = {course["course_info"]["course_id"] for course in courses_taken}
        courses_taken.update(extra_courses or set())  # Add extra courses to the set
        courses_taken.update(ALWAYS_TAKEN_COURSES)
        math_courses = {
            course for course in courses_taken if course.startswith("01:640:")
        }
        math_prereqs = set()
        for course in math_courses:  # Handle math courses separately
            math_prereqs.update(RequirementService.get_all_prerequisites(course))
        courses_taken.update(math_prereqs)

        with open(PREREQUISITES_FILE_PATH, "r") as json_file:
            course_requirements = json.load(
                json_file
            )  # Load course requirements from JSON file

        for semester in semesters:
            term, year = semester["term"], semester["year"]
            course_records = CourseRecordService.get_course_record_by_term(
                username=username, term=term, year=year
            )

            courses_taken.update(extra_courses or set())

            for course_record in course_records:
                course_id = course_record["course_info"]["course_id"]
                prerequisite = RequirementService.get_all_prerequisites(
                    course_id, visited=None
                )
                updated_string = (
                    RequirementService.validate_prerequisite_string(
                        prerequisite_string=course_requirements[course_id],
                        prerequisite=prerequisite,
                        taken_courses=courses_taken,
                    )
                    if course_id in course_requirements
                    else ""
                )  # Validate the prerequisite string for display

                courses_taken.update(extra_courses or set())

                requirements_fulfilled = RequirementService.check_requirements_met(
                    username,
                    course_id=course_id,
                    extra_courses=extra_courses,
                )  # Check if requirements are met for the course
                res[course_id] = {
                    "requirements_fulfilled": requirements_fulfilled,
                    "requirement_string": updated_string,
                }  # Update the result dictionary with course info
            extra_courses.update(
                {course["course_info"]["course_id"] for course in course_records}
            )
        return res

    @staticmethod
    def validate_prerequisite_string(prerequisite_string, prerequisite, taken_courses):
        """
        Validate and format the prerequisite string for display.
        Highlight courses that have been taken and those that are still required.
        """
        output = prerequisite_string
        for course_id in prerequisite:
            escaped_course = re.escape(CourseService.get_course_string(course_id))
            # Highlight taken courses in green and not taken in red
            color = "#32CD32" if course_id in taken_courses else "#FF6347"
            pattern = rf"\b({escaped_course})\b"
            output = re.sub(pattern, rf'<span style="color:{color};">\1</span>', output)
        return output

    @staticmethod
    def check_requirements_met(
        username, group_id=None, program_id=None, course_id=None, extra_courses=None
    ):
        """
        Check if a student has met the requirements for a given program.
        """
        if group_id:
            # Fetch requirement groups for a specific group_id
            requirement_groups = [
                RequirementGroupService.get_requirement_group_by_id(group_id)
            ]
        elif program_id:
            # Fetch program requirement groups
            program = ProgramService.get_program(program_id)
            if not program:
                return False
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_program(program_id)
            )
        elif course_id:
            # Fetch requirement groups for a specific course
            course = CourseService.get_course_by_id(course_id)
            if not course:
                return False
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_course(course_id)
            )
        else:
            raise ValueError("Either program_id or course_id must be provided")

        if not requirement_groups:
            return True  # No requirements to check

        # Fetch student's completed courses
        courses_taken = CourseRecordService.get_past_course_records(username)
        courses_taken = {
            course["course_info"]["course_id"] for course in courses_taken
        }  # Extract course_ids
        courses_taken.update(extra_courses or set())
        courses_taken.update(ALWAYS_TAKEN_COURSES)
        if not courses_taken:
            return False  # No courses taken means requirements are not met

        math_courses = {
            course for course in courses_taken if course.startswith("01:640:")
        }
        # Collect all prerequisites first to avoid modifying set during iteration
        math_prereqs = set()
        for course in math_courses:
            math_prereqs.update(RequirementService.get_all_prerequisites(course))
        courses_taken.update(math_prereqs)

        # Check all top-level groups
        for group in requirement_groups:
            if not RequirementService.check_group_fulfillment(
                group.group_id, courses_taken
            ):
                return False

        return True  # All requirements met

    def check_group_fulfillment(group_id, courses_taken):
        """
        Recursively check if a student meets the requirements for a requirement group.
        """
        group = RequirementGroupService.get_requirement_group_by_id(group_id)
        if not group:
            return True  # No requirements to fulfill

        num_required = group.num_required

        if group.list:
            required_courses = set(group.list)
            # If num_required = 0, all courses in the list must be taken
            if num_required == 0 and not required_courses.issubset(courses_taken):
                return False
            # If num_required > 0, at least num_required courses from the list must be taken
            if (
                num_required > 0
                and len(required_courses.intersection(courses_taken)) < num_required
            ):
                return False

        # Recursively check child groups
        child_groups = RequirementGroupService.get_child_requirement_groups(group_id)
        if not child_groups:
            return True  # No child groups to check

        if num_required == 0:
            # If num_required = 0, ALL child groups must be satisfied
            return all(
                RequirementService.check_group_fulfillment(
                    child.group_id, courses_taken
                )
                for child in child_groups
            )
        else:
            # If num_required > 0, at least num_required child groups must be satisfied
            satisfied_count = sum(
                RequirementService.check_group_fulfillment(
                    child.group_id, courses_taken
                )
                for child in child_groups
            )
            if satisfied_count < num_required:
                return False  # Not enough child groups satisfied
        return True  # All requirements for this group are met

    @staticmethod
    def get_num_requirements(program_id=None, course_id=None):
        """
        Return number of total courses needed to complete a program or course.
        """
        if program_id:
            # Fetch program requirement groups
            program = ProgramService.get_program(program_id)
            if not program:
                raise ValueError(f"Program {program_id} not found")
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_program(program_id)
            )
        elif course_id:
            # Fetch requirement groups for a specific course
            course = CourseService.get_course_by_id(course_id)
            if not course:
                raise ValueError(f"Course {course_id} not found")
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_course(course_id)
            )
        else:
            raise ValueError("Either program_id or course_id must be provided")

        if not requirement_groups:
            return 0  # No requirements to check

        total_requirements = 0  # To track the total number of requirements

        def count_requirements(group_id):
            """
            Recursively count the number of required courses in a group and its child groups.
            """
            group = RequirementGroupService.get_requirement_group_by_id(group_id)

            # Get the number of required courses in the current group
            required_courses = set(group.list) if group.list else set()
            num_required = group.num_required

            # If the group has child groups, handle child requirements recursively
            child_groups = RequirementGroupService.get_child_requirement_groups(
                group_id
            )

            total_count = 0
            if not child_groups:
                # If no child groups, count the required courses in this group
                if num_required == 0:
                    total_count = len(required_courses)
                else:
                    total_count = num_required

            else:
                # If there are child groups, count how many courses are needed from child groups
                child_count = 0
                for child in child_groups:
                    child_count += count_requirements(child.group_id)

                # Now check the parent group itself
                if num_required > 0:
                    # Parent group needs at least `num_required` courses
                    total_count = max(num_required, child_count)
                else:
                    # Parent group needs all courses from the list
                    total_count = len(required_courses) + child_count
            return total_count

        # Check all top-level groups
        for group in requirement_groups:
            total_requirements += count_requirements(group.group_id)

        return total_requirements

    @staticmethod
    def get_num_courses_taken(username, program_id=None, course_id=None):
        """
        Return number of courses taken by a student in a program or course.
        """
        if program_id:
            # Fetch program requirement groups
            program = ProgramService.get_program(program_id)
            if not program:
                raise ValueError(f"Program {program_id} not found")
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_program(program_id)
            )
        elif course_id:
            # Fetch requirement groups for a specific course
            course = CourseService.get_course_by_id(course_id)
            if not course:
                raise ValueError(f"Course {course_id} not found")
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_course(course_id)
            )
        else:
            raise ValueError("Either program_id or course_id must be provided")

        if not requirement_groups:
            return 0

        # Fetch student's completed courses
        courses_taken = CourseRecordService.get_past_course_records(username)
        if not courses_taken:
            return 0  # No courses taken means no requirements met
        else:
            courses_taken = {
                course["course_info"]["course_id"] for course in courses_taken
            }

        counted_courses = set()

        def count_courses_in_group(group_id):
            """
            Recursively count taken courses from this group.
            """
            group = RequirementGroupService.get_requirement_group_by_id(group_id)
            if not group:
                return 0

            count = 0

            # Count matching courses in the list
            if group.list:
                for course_id in group.list:
                    if course_id in courses_taken and course_id not in counted_courses:
                        counted_courses.add(course_id)
                        count += 1

            # Recurse into child groups
            child_groups = RequirementGroupService.get_child_requirement_groups(
                group_id
            )
            for child in child_groups:
                count += count_courses_in_group(child.group_id)

            return count

        total_count = 0
        for group in requirement_groups:  # Check all top-level groups
            total_count += count_courses_in_group(group.group_id)

        return total_count

    @staticmethod
    def get_missing_requirements(
        username, program_id=None, course_id=None, extra_courses=None
    ):
        """
        Return a list of courses the student still needs to complete.
        """
        if program_id:
            # Fetch program requirement groups
            program = ProgramService.get_program(program_id)
            if not program:
                raise ValueError(f"Program {program_id} not found")
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_program(program_id)
            )
        elif course_id:
            # Fetch requirement groups for a specific course
            course = CourseService.get_course_by_id(course_id)
            if not course:
                raise ValueError(f"Course {course_id} not found")
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_course(course_id)
            )
        else:
            raise ValueError("Either program_id or course_id must be provided")

        if not requirement_groups:
            return []  # No requirements to check

        # Fetch student's completed courses
        courses_taken = CourseRecordService.get_past_course_records(username)
        if not courses_taken:
            courses_taken = set()
        else:
            courses_taken = {
                course["course_info"]["course_id"] for course in courses_taken
            }  # Extract course_ids

        courses_taken.update(extra_courses or set())
        courses_taken.update(ALWAYS_TAKEN_COURSES)
        missing_courses = set()  # To track missing courses

        def check_missing_courses(group_id):
            """
            Recursive helper function to find missing courses.
            """
            group = RequirementGroupService.get_requirement_group_by_id(group_id)
            if not group or RequirementService.check_requirements_met(
                username, group_id=group_id
            ):
                return  # No requirements to check or already met

            required_courses = set(group.list) if group.list else set()
            num_required = group.num_required

            # Find missing courses
            if num_required == 0:
                # All courses in the list must be taken
                options = required_courses - courses_taken
                for course in options:
                    if not CourseService.get_course_by_id(course):
                        return  # Course not found, skip it
                missing_courses.update(options)
            elif num_required > 0 and required_courses:
                # Need at least `num_required` courses from the list
                taken_in_group = required_courses.intersection(courses_taken)
                needed = num_required - len(taken_in_group)
                options = sorted(
                    list(required_courses - taken_in_group),
                    key=lambda x: (x[:2], x[7:]),  # Sort by subject and course number
                )
                while (
                    needed > 0 and options
                ):  # While we still need courses and have options
                    valid_courses = [
                        course
                        for course in options
                        if RequirementService.check_requirements_met(
                            username, course_id=course, extra_courses=missing_courses
                        )
                    ]

                    if valid_courses:
                        to_add = valid_courses[
                            :needed
                        ]  # Take the first `needed` valid courses
                        missing_courses.update(to_add)
                        needed -= len(to_add)
                        options = [
                            course for course in options if course not in to_add
                        ]  # Remove added courses from options
                    else:
                        # Fall back to blindly adding courses if no valid ones were found
                        for course in options:
                            if CourseService.get_course_by_id(course):
                                missing_courses.add(course)
                                needed -= 1
                                if needed <= 0:
                                    break

            # Recursively check child groups
            child_groups = RequirementGroupService.get_child_requirement_groups(
                group_id
            )
            if not child_groups:
                return  # No child groups to check

            if num_required == 0:
                # If num_required = 0, ALL child groups must be satisfied
                for child in child_groups:
                    check_missing_courses(child.group_id)
            else:
                # If num_required > 0, at least `num_required` child groups must be satisfied
                satisfied_groups = [
                    child.group_id
                    for child in child_groups
                    if RequirementService.check_requirements_met(
                        username, program_id=child.group_id
                    )
                ]

                if (
                    len(satisfied_groups) < num_required
                ):  # Not enough child groups satisfied
                    needed = num_required - len(satisfied_groups)
                    for child in child_groups:
                        check_missing_courses(child.group_id)
                        needed -= 1
                        if needed <= 0:
                            break

        # Check all top-level groups
        for group in requirement_groups:
            check_missing_courses(group.group_id)
        return list(missing_courses)

    @staticmethod
    def get_suggested_courses(username, max_credits=20.5, extra_courses=set()):
        """
        Suggest courses for a student based on their current credits and requirements.
        """
        # Fetch programs associated with the student
        programs = UserProgramService.get_student_programs(username)
        if not programs or isinstance(programs, str):
            return {"error": "No programs found for the student"}
        program_ids = [program.program_id for program in programs]

        # Fetch missing requirements for each program
        missing_courses = set()
        for program_id in program_ids:
            missing_courses.update(
                RequirementService.get_missing_requirements(
                    username, program_id=program_id, extra_courses=extra_courses
                )
            )

        # Remove redundant math courses if a higher-level math course is available
        math_courses = {
            course for course in missing_courses if course.startswith("01:640:")
        }
        highest_math_course = None
        for course in math_courses:
            if (
                not highest_math_course or course > highest_math_course
            ) and RequirementService.check_requirements_met(
                username, course_id=course, extra_courses=extra_courses
            ):
                highest_math_course = course
        if highest_math_course:  # Highest math course means we can remove lower ones
            for course in math_courses:
                if course < highest_math_course:
                    missing_courses.discard(course)

        suggested_courses = set()
        total_credits = 0
        priority = set()

        # Step 1: Identify missing prerequisites for the courses
        for course in missing_courses:
            if not RequirementService.check_requirements_met(
                username, course_id=course, extra_courses=extra_courses
            ):
                missing_prereqs = RequirementService.get_missing_requirements(
                    username, course_id=course, extra_courses=missing_courses
                )
                priority.update(missing_prereqs)
        priority.difference_update(extra_courses)

        # Remove redundant math courses in the priority list
        math_priority = {course for course in priority if course.startswith("01:640:")}
        highest_math_priority = None
        for course in extra_courses:
            if (
                not highest_math_priority or course > highest_math_priority
            ) and RequirementService.check_requirements_met(
                username, course_id=course, extra_courses=extra_courses
            ):
                highest_math_priority = course
        for (
            course
        ) in math_priority:  # Check if the course is a higher-level math course
            if (
                not highest_math_priority or course > highest_math_priority
            ) and RequirementService.check_requirements_met(
                username, course_id=course, extra_courses=extra_courses
            ):
                highest_math_priority = course
        if highest_math_priority:  # Highest math course means we can remove lower ones
            for course in math_priority:
                if course < highest_math_priority:
                    priority.discard(course)

        # Step 2: Add the missing prerequisites to the suggested courses
        for prereq in priority:
            if RequirementService.check_requirements_met(
                username, course_id=prereq, extra_courses=extra_courses
            ):  # Check if the course is valid
                additional_credits = CourseService.get_course_by_id(prereq).credits
                if additional_credits + total_credits <= max_credits:
                    suggested_courses.add(prereq)
                    total_credits += additional_credits
                else:
                    # Stop suggesting courses if adding this one exceeds max credits
                    break

        # Step 3: If there's still space for more credits, suggest remaining courses
        if total_credits < max_credits:
            remaining_courses = missing_courses - priority
            for course in remaining_courses:
                if RequirementService.check_requirements_met(
                    username, course_id=course, extra_courses=extra_courses
                ):  # Check if the course is valid
                    additional_credits = CourseService.get_course_by_id(course).credits
                    if additional_credits + total_credits <= max_credits:
                        suggested_courses.add(course)
                        total_credits += additional_credits
                    else:
                        # Stop suggesting courses if adding this one exceeds max credits
                        break

        # Return suggested courses and total credits
        return {"courses": suggested_courses, "credits": total_credits}

    @staticmethod
    def create_degree_plan(username, max_credits=20.5):
        """
        Create a degree plan for a student based on their current credits and requirements.
        """
        degree_plan = []
        taken = ALWAYS_TAKEN_COURSES.copy()
        while True:
            result = RequirementService.get_suggested_courses(
                username=username, max_credits=max_credits, extra_courses=taken
            )  # Get suggested courses for the student
            if "error" in result:  # Handle error case
                return result
            suggested_courses = result["courses"]
            if not suggested_courses:
                break  # No more courses to suggest

            degree_plan.append(suggested_courses)
            taken = taken.union(
                suggested_courses
            )  # Update taken courses with suggested ones

        return {"plan": degree_plan}  # Return the degree plan
