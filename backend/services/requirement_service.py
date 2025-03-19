from services.db_service import DBService

class RequirementService:
    @staticmethod
    def get_all_prerequisites(course_id, visited=None):
        """Retrieve all prerequisite courses for a given course."""
        if visited is None:
            visited = set()  # Keep track of visited courses to avoid infinite loops
        course = DBService.get_course_by_id(course_id)
        if not course or course_id in visited:
            return set()  # Return an empty set if the course does not exist or has been visited
        visited.add(course_id)  # Mark this course as visited

        requirement_groups = DBService.get_requirement_group_by_course(course_id)
        if not requirement_groups:
            return set()
        prerequisites = set()
        
        for group in requirement_groups:
            if group.list:
                prerequisites.update(group.list)
            
            # Recursively get prerequisites from child groups
            child_groups = DBService.get_child_requirement_groups(group.group_id)
            for child in child_groups:
                if child.list:
                    prerequisites.update(child.list)
                prerequisites.update(RequirementService.get_all_prerequisites(child.group_id, visited))

        return prerequisites

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

        math_courses = {course for course in courses_taken if course.startswith("01:640:")}
        # Collect all prerequisites first to avoid modifying set during iteration
        math_prereqs = set()
        for course in math_courses:
            math_prereqs.update(RequirementService.get_all_prerequisites(course))
        courses_taken.update(math_prereqs)

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

    @staticmethod
    def get_missing_requirements(username, program_id=None, course_id=None):
        """Return a list of courses the student still needs to complete."""
        if program_id:
            # Fetch program requirement groups
            program = DBService.get_program(program_id)
            if not program:
                raise ValueError(f"Program {program_id} not found")
            requirement_groups = DBService.get_requirement_group_by_program(program_id)
        elif course_id:
            # Fetch requirement groups for a specific course
            course = DBService.get_course_by_id(course_id)
            if not course:
                raise ValueError(f"Course {course_id} not found")
            requirement_groups = DBService.get_requirement_group_by_course(course_id)
        else:
            raise ValueError("Either program_id or course_id must be provided")

        if not requirement_groups:
            return []  # No requirements to check

        # Fetch student's completed courses
        courses_taken = DBService.get_courses_taken_by_student(username)
        if not courses_taken:
            courses_taken = set()
        else:
            courses_taken = {course.course_id for course in courses_taken}  # Extract course_ids
        
        missing_courses = set() # To track missing courses
        
        def check_missing_courses(group_id):
            """Recursive helper function to find missing courses."""
            group = DBService.get_requirement_group_by_id(group_id)
            if not group:
                return
            
            required_courses = set(group.list) if group.list else set()
            num_required = group.num_required
            print(f"Checking group {group_id}: required_courses={required_courses}, num_required={num_required}")

            # Find missing courses
            if num_required == 0:
                # All courses in the list must be taken
                options = required_courses - courses_taken
                for course in options:
                    if not DBService.get_course_by_id(course):
                        return  # Course not found, skip it
                missing_courses.update(options)
            elif num_required > 0 and required_courses:
                # Need at least `num_required` courses from the list
                taken_in_group = required_courses.intersection(courses_taken)
                needed = num_required - len(taken_in_group)
                print(f"Courses taken in group: {taken_in_group}, needed: {needed}, missing_courses: {missing_courses}, required_courses: {required_courses}")
                while needed > 0:
                    options = required_courses - taken_in_group
                    valid_courses = [course for course in options
                        if RequirementService.check_requirements_met(username, course_id=course, extra_courses=missing_courses)]
                    if not valid_courses:
                        for course in options:
                            if DBService.get_course_by_id(course):
                                missing_courses.add(course)
                                needed -= 1
                                if needed <= 0:
                                    break
                    print(valid_courses, needed, missing_courses, required_courses)
                    missing_courses.update(valid_courses[:needed])
                    needed -= len(valid_courses)

            # Recursively check child groups
            child_groups = DBService.get_child_requirement_groups(group_id)
            if not child_groups:
                return
            
            if num_required == 0:
                # If num_required = 0, ALL child groups must be satisfied
                for child in child_groups:
                    check_missing_courses(child.group_id)
            else:
                # If num_required > 0, at least `num_required` child groups must be satisfied
                satisfied_groups = [
                    child.group_id for child in child_groups
                    if RequirementService.check_requirements_met(username, program_id=child.group_id)
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
        programs = DBService.get_student_programs(username)
        if not programs:
            return "No programs found for the student"
        program_ids = [program.program_id for program in programs]

        # Fetch missing requirements for each program
        missing_courses = set()
        for program_id in program_ids:
            missing_courses.update(RequirementService.get_missing_requirements(username, program_id=program_id))

        suggested_courses = set()
        total_credits = 0
        priority = set()

        # Step 1: Identify missing prerequisites for the courses
        for course in missing_courses:
            if not RequirementService.check_requirements_met(username, course_id=course):
                missing_prereqs = RequirementService.get_missing_requirements(username, course_id=course)
                priority.update(missing_prereqs)
        
        # Step 2: Add the missing prerequisites to the suggested courses
        print("Priority courses (missing prerequisites):", priority)
        for prereq in priority:
            if RequirementService.check_requirements_met(username, course_id=prereq):
                total_credits += DBService.get_course_by_id(prereq).credits
                if total_credits <= max_credits:
                    suggested_courses.add(prereq)
                else:
                    break
        
        # Step 3: If there's still space for more credits, suggest remaining courses
        if total_credits < max_credits:
            remaining_courses = missing_courses - priority
            for course in remaining_courses:
                if RequirementService.check_requirements_met(username, course_id=course):
                    total_credits += DBService.get_course_by_id(course).credits
                    if total_credits <= max_credits:
                        suggested_courses.add(course)
                    else:
                        break
                
        return suggested_courses
