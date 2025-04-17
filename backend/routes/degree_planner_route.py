from flask import Blueprint, jsonify
from services.requirement_service import RequirementService
from services.program_service import ProgramService
from services.requirement_group_service import RequirementGroupService

degree_planner_bp = Blueprint("degree_planner", __name__, url_prefix="/api/degree_planner")

@degree_planner_bp.route('/programs/<program_id>/requirement-tree', methods=['GET'])
def get_program_requirement_tree(program_id):
    trees = RequirementService.get_program_requirement_tree(program_id)
    if not trees:
        print("Meow")
        return jsonify([])

    def serialize_tree(node):
        return {
            "group_id": node.group_id,
            "num_required": node.num_required,
            "lst": node.lst,
            "prerequisites": [serialize_tree(child) for child in node.prerequisites],
        }

    return jsonify([serialize_tree(tree) for tree in trees])

@degree_planner_bp.route("/programs/with-requirements", methods=["GET"])
def get_programs_with_requirements():
    all_programs = ProgramService.get_programs()
    programs_with_requirements = []

    
    for program in all_programs:

        req_groups = RequirementGroupService.get_requirement_group_by_program(program.program_id)
        if req_groups:
            programs_with_requirements.append({
                "program_id": program.program_id,
                "program_name": program.program_name  # adjust based on your schema
            })

    return jsonify(programs_with_requirements)
