from flask import Blueprint, jsonify, request
from services.program_service import ProgramService
from services.requirement_group_service import RequirementGroupService
from services.course_record_service import CourseRecordService
from services.course_service import CourseService

degree_navigator_bp = Blueprint(
    "degree_navigator", __name__, url_prefix="/api/degree_navigator"
)


@degree_navigator_bp.route("/programs/with-requirements", methods=["GET"])
def get_programs_with_requirements():
    """
    API endpoint to fetch all programs that have associated requirement groups.
    Returns a list of programs with their IDs and names.
    """
    all_programs = ProgramService.get_programs()
    programs_with_requirements = []

    for program in all_programs:

        req_groups = RequirementGroupService.get_requirement_group_by_program(
            program.program_id
        )
        if req_groups:
            programs_with_requirements.append(
                {"program_id": program.program_id, "program_name": program.program_name}
            )

    return jsonify(programs_with_requirements)


@degree_navigator_bp.route(
    "/users/<string:username>/completed-courses", methods=["GET"]
)
def get_completed_courses(username):
    """
    API endpoint to fetch completed courses for a specific user.
    Returns a list of completed courses.
    """
    result = CourseRecordService.get_past_course_records(username)
    if isinstance(result, str):  # error message
        return jsonify({"error": result}), 500
    return jsonify(result), 200


def get_program_requirement_tree_structured(program_id, username=None):
    """
    Build a structured requirement tree for a given program.
    Each node in the tree represents a requirement group, and its children represent sub-groups or courses.
    """
    top_groups = RequirementGroupService.get_requirement_group_by_program(program_id)

    taken_set = set()
    if username:
        taken_result = CourseRecordService.get_past_course_records(username)
        if isinstance(taken_result, list):
            taken_set = {
                course["course_info"]["course_id"]
                for course in taken_result
                if "course_info" in course and course["course_info"].get("course_id")
            }

    def build_group_node(group, prefix, depth=0):
        """
        Recursively build the tree structure for each requirement group.
        Each group can have child groups and a list of courses.
        """
        children = RequirementGroupService.get_child_requirement_groups(group.group_id)

        course_objs = []
        if group.list:
            for course_id in group.list:
                course = CourseService.get_course_by_id(course_id)
                if course:
                    course_objs.append(
                        {
                            "course_id": course.course_id,
                            "course_name": course.course_name,
                            "course_credits": course.credits,
                            "taken": course.course_id in taken_set,
                        }
                    )

        return { # Create a dictionary for the group node
            "label": f"R{prefix}" if depth == 0 else prefix,
            "group_id": group.group_id,
            "group_name": group.group_name,
            "num_required": group.num_required,
            "courses": course_objs if course_objs else None,
            "children": [
                build_group_node(child, f"{prefix}.{i+1}", depth + 1)
                for i, child in enumerate(children)
            ],
        }

    tree = []
    for i, group in enumerate(top_groups, start=1):
        if group.parent_group_id is None: # Only include top-level groups
            tree.append(build_group_node(group, str(i)))

    return tree


@degree_navigator_bp.route("/programs/<program_id>/requirement-tree-labeled")
def get_labeled_requirement_tree(program_id):
    """
    API endpoint to fetch a labeled requirement tree for a specific program.
    The tree structure includes requirement groups, sub-groups, and courses.
    """
    username = request.args.get("username", default=None)
    print(f"Building requirement tree for program: {program_id}, user: {username}")

    tree = get_program_requirement_tree_structured(program_id, username)
    return jsonify(tree)
<<<<<<< HEAD


# http://127.0.0.1:8080/api/degree_navigator/programs/NB198SJ/requirement-tree-labeled
=======
>>>>>>> main
