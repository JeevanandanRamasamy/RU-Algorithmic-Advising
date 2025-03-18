from services.db_service import DBService

class RequirementService:
    @staticmethod
    def check_requirements_met(username, program_id=None, course_id=None, extra_courses=None):
        """Check if a student has met the requirements for a given program."""
        if program_id:
            # Fetch program requirement groups
            program = DBService.get_program(program_id)
            if not program:
                return False
            requirement_groups = DBService.get_requirement_group_by_program(program_id)
        elif course_id:
            # Fetch requirement groups for a specific course
            course = DBService.get_course_by_id(course_id)
            if not course:
                return False
            requirement_groups = DBService.get_requirement_group_by_course(course_id)
        else:
            raise ValueError("Either program_id or course_id must be provided")

        if not requirement_groups:
            return True  # No requirements to check

        # Fetch student's completed courses
        courses_taken = DBService.get_courses_taken_by_student(username)
        courses_taken = {course.course_id for course in courses_taken} # Extract course_ids
        if extra_courses:
            courses_taken.update(extra_courses)
        if not courses_taken:
            return False  # No courses taken means requirements are not met

        def check_group_fulfillment(group_id, courses_taken):
            """Recursively check if a student meets the requirements for a requirement group."""
            group = DBService.get_requirement_group_by_id(group_id)
            if not group:
                return True  # No requirements to fulfill
                
            required_courses = set(group.list) if group.list else set()
            num_required = group.num_required

            # If num_required = 0, all courses in the list must be taken
            if num_required == 0 and not required_courses.issubset(courses_taken):
                return False

            # If num_required > 0, at least num_required courses from the list must be taken
            if num_required > 0 and len(required_courses.intersection(courses_taken)) < num_required:
                return False

            # Recursively check child groups
            child_groups = DBService.get_child_requirement_groups(group_id)
            if not child_groups:
                return True # No child groups to check
            
            if num_required == 0:
                # If num_required = 0, ALL child groups must be satisfied
                return all(check_group_fulfillment(child.group_id, courses_taken) for child in child_groups)
            else:
                # If num_required > 0, at least num_required child groups must be satisfied
                satisfied_count = sum(check_group_fulfillment(child.group_id, courses_taken) for child in child_groups)
                if satisfied_count < num_required:
                    return False # Not enough child groups satisfied
            return True # All requirements for this group are met

        # Check all top-level groups
        for group in requirement_groups:
            if not check_group_fulfillment(group.group_id, courses_taken):
                return False
        
        return True  # All requirements met
