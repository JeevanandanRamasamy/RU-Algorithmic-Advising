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
    result = CourseRecordService.get_past_course_records(username)
    # print("Result from completed courses api (degree_navigator_route):", result)
    if isinstance(result, str):  # error message
        return jsonify({"error": result}), 500
    return jsonify(result), 200


def get_program_requirement_tree_structured(program_id, username=None):
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

        return {
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
        if group.parent_group_id is None:
            tree.append(build_group_node(group, str(i)))

    return tree


@degree_navigator_bp.route("/programs/<program_id>/requirement-tree-labeled")
def get_labeled_requirement_tree(program_id):
    username = request.args.get("username", default=None)
    print(f"Building requirement tree for program: {program_id}, user: {username}")

    tree = get_program_requirement_tree_structured(program_id, username)
    return jsonify(tree)


# http://127.0.0.1:8080/api/degree_navigator/programs/NB198SJ/requirement-tree-labeled
