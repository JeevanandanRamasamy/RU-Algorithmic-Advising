from collections import deque
from models.requirement_group_node import RequirementGroupNode
from models.requirement_group import RequirementGroup
from services.requirement_group_service import RequirementGroupService
from services.program_service import ProgramService
from services.course_service import CourseService
from services.course_record_service import CourseRecordService
from services.user_program_service import UserProgramService


class RequirementService:

    @staticmethod
    def get_prerequisites_tree(course_id):
        requirement_groups = RequirementGroupService.get_requirement_group_by_course(
            course_id
        )
        if not requirement_groups:
            return ""
        group = requirement_groups[0]
        root = RequirementService.build_tree_from_group(group)
        return root

    @staticmethod
    def build_tree_from_group(group):
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
            for child_group in child_groups:
                child_node = RequirementService.build_tree_from_group(child_group)
                root.prerequisites.append(child_node)
        return root

    @staticmethod
    def get_all_prerequisites(course_id, visited=None):
        """Retrieve all prerequisite courses for a given course."""
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
            return set()
        prerequisites = set()

        for group in requirement_groups:
            if group.list:
                prerequisites.update(group.list)

            # Recursively get prerequisites from child groups
            child_groups = RequirementGroupService.get_child_requirement_groups(
                group.group_id
            )
            for child in child_groups:
                if child.list:
                    prerequisites.update(child.list)
                prerequisites.update(
                    RequirementService.get_all_prerequisites(child.group_id, visited)
                )

        return prerequisites

    @staticmethod
    def validate_course_requirements(courses_to_check, taken_courses):
        invalid_courses = set()
        math_courses = {
            course for course in taken_courses if course.startswith("01:640:")
        }
        math_prereqs = set()
        for course in math_courses:
            math_prereqs.update(RequirementService.get_all_prerequisites(course))
        taken_courses.update(math_prereqs)

        for course_id in courses_to_check:
            course = CourseService.get_course_by_id(course_id)
            if not course:
                return False
            requirement_groups = (
                RequirementGroupService.get_requirement_group_by_course(course_id)
            )

            for group in requirement_groups:
                if not RequirementService.check_group_fulfillment(
                    group.group_id, taken_courses
                ):
                    invalid_courses.add(course_id)
        return list(invalid_courses)

    @staticmethod
    def check_requirements_met(
        username, group_id=None, program_id=None, course_id=None, extra_courses=None
    ):
        """Check if a student has met the requirements for a given program."""
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
        if extra_courses:
            courses_taken.update(extra_courses)
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
        """Recursively check if a student meets the requirements for a requirement group."""
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
    def get_missing_requirements(username, program_id=None, course_id=None):
        """Return a list of courses the student still needs to complete."""
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

        missing_courses = set()  # To track missing courses

        def check_missing_courses(group_id):
            """Recursive helper function to find missing courses."""
            group = RequirementGroupService.get_requirement_group_by_id(group_id)
            if not group or RequirementService.check_requirements_met(
                username, group_id=group_id
            ):
                return  # No requirements to check or already met

            required_courses = set(group.list) if group.list else set()
            num_required = group.num_required
            print(
                f"Checking group {group_id}: required_courses={required_courses}, num_required={num_required}"
            )

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
                while needed > 0:
                    # Sort by first 2 digits then by last 3 digits
                    options = sorted(
                        required_courses - taken_in_group, key=lambda x: (x[:2], x[7:])
                    )
                    valid_courses = [
                        course
                        for course in options
                        if RequirementService.check_requirements_met(
                            username, course_id=course, extra_courses=missing_courses
                        )
                    ]
                    if not valid_courses:
                        for course in options:
                            if CourseService.get_course_by_id(course):
                                missing_courses.add(course)
                                needed -= 1
                                if needed <= 0:
                                    break
                    missing_courses.update(valid_courses[:needed])
                    needed -= len(valid_courses)

            # Recursively check child groups
            child_groups = RequirementGroupService.get_child_requirement_groups(
                group_id
            )
            if not child_groups:
                return

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

                if len(satisfied_groups) < num_required:
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
    def get_suggested_courses(username, max_credits=20.5):
        """Suggest courses for a student based on their current credits and requirements."""
        # Fetch programs associated with the student
        programs = UserProgramService.get_student_programs(username)
        if not programs:
            return "No programs found for the student"
        program_ids = [program.program_id for program in programs]

        # Fetch missing requirements for each program
        missing_courses = set()
        for program_id in program_ids:
            missing_courses.update(
                RequirementService.get_missing_requirements(
                    username, program_id=program_id
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
            ) and RequirementService.check_requirements_met(username, course_id=course):
                highest_math_course = course
        if highest_math_course:
            for course in math_courses:
                if course < highest_math_course:
                    missing_courses.discard(course)

        suggested_courses = set()
        total_credits = 0
        priority = set()

        # Step 1: Identify missing prerequisites for the courses
        for course in missing_courses:
            if not RequirementService.check_requirements_met(
                username, course_id=course
            ):
                missing_prereqs = RequirementService.get_missing_requirements(
                    username, course_id=course
                )
                priority.update(missing_prereqs)

        # Step 2: Add the missing prerequisites to the suggested courses
        print("Priority courses (missing prerequisites):", priority)
        for prereq in priority:
            if RequirementService.check_requirements_met(username, course_id=prereq):
                total_credits += CourseService.get_course_by_id(prereq).credits
                if total_credits <= max_credits:
                    suggested_courses.add(prereq)
                else:
                    break

        # Step 3: If there's still space for more credits, suggest remaining courses
        if total_credits < max_credits:
            remaining_courses = missing_courses - priority
            for course in remaining_courses:
                if RequirementService.check_requirements_met(
                    username, course_id=course
                ):
                    additional_credits = CourseService.get_course_by_id(course).credits
                    if additional_credits + total_credits <= max_credits:
                        suggested_courses.add(course)
                        total_credits += additional_credits
                    else:
                        # Stop suggesting courses if adding this one exceeds max credits
                        break

        return suggested_courses, total_credits
