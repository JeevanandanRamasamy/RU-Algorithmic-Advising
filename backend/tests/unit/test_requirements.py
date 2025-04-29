# This is just a test file to test the requirement group service

# Run with: python -m backend.test.test_requirements
import sys
import os

# Add the project root (RU-Algorithmic-Advising) to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app import create_app


from services.requirement_group_service import RequirementGroupService
from services.requirement_service import RequirementService
from services.course_service import CourseService

def show_all_requirements(program_id):
    top_groups = RequirementGroupService.get_requirement_group_by_program(program_id)

    def print_group_tree(group, prefix, indent=0):
        if indent == 0:
            # Top-level group with "R1." label
            print(f"R{prefix} {group.group_name} (Num Required: {group.num_required})")
        else:
            # Indented child group with "R1.1" label
            spacing = "  " * indent
            print(
                f"{spacing}{prefix} {group.group_name} (Num Required: {group.num_required})"
            )

        if group.list:
            spacing = "  " * (indent + 1)
            print(f"{spacing}Courses: {group.list}")

        children = RequirementGroupService.get_child_requirement_groups(group.group_id)
        for i, child in enumerate(children, 1):
            child_prefix = f"{prefix}.{i}" if indent == 0 else f"{prefix}.{i}"
            print_group_tree(child, child_prefix, indent + 1)

    top_level = [g for g in top_groups if g.parent_group_id is None]

    for i, group in enumerate(top_level, 1):
        print_group_tree(group, str(i))


# Function to test get_requirement_group_by_id
def get_group_by_id_test(group_id):
    group = RequirementGroupService.get_requirement_group_by_id(group_id)
    if group:
        print(f"✅ Found group: {group.group_id} - {group.group_name}")
        print(f"   Program ID: {group.program_id}")
        print(f"   Num Required: {group.num_required}")
        print(f"   Course List: {group.list}")
    else:
        print(f"❌ No group found with ID {group_id}")


# Function to test get_all_prerequisites
def show_prereq(course_id):
    prereqs = RequirementService.get_all_prerequisites(course_id)
    if not prereqs:
        print(f"ℹ️  No prerequisites found for course {course_id}")
    else:
        print(f"📘 Prerequisites for course {course_id}:")
        for c in prereqs:
            print(f"  - {c}")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        # Show all requirements for the CS program
        show_all_requirements("NB198SJ")


        course_id = "01:198:344"

        course = CourseService.get_course_by_id(course_id)
        print(course)  # Temporarily add this to confirm

        groups = RequirementGroupService.get_requirement_group_by_course(course_id)
        print(groups)

        # Show prerequisites for a specific course
        print("\n--- Testing get_all_prerequisites ---")
        show_prereq(course_id)  # replace with an actual course ID that exists in your DB