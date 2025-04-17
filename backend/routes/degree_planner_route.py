from flask import Blueprint, jsonify
from services.requirement_service import RequirementService

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
