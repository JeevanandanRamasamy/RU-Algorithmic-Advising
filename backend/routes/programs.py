from flask import request
from services.db_service import DBService
from flask import Blueprint, jsonify

programs_bp = Blueprint("programs", __name__, url_prefix="/api/programs")


@programs_bp.route("", methods=["GET"])
def get_all_programs():
    try:
        program_type = request.args.get("program_type")
        programs = (
            DBService.get_programs(program_type)
            if program_type in ["major", "minor", "certificate", "sas_core"]
            else DBService.get_programs()
        )
        if isinstance(programs, str):
            return jsonify({"error": programs}), 500
        return (
            jsonify(
                {
                    "message": (
                        f"Received All {program_type} Programs"
                        if program_type
                        else f"Received All Programs"
                    ),
                    "programs": programs,
                }
            ),
            200,
        )

    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
