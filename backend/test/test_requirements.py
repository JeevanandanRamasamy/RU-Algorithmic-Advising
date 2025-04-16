#This is just a test file to test the requirement group service

# Run with: python -m backend.test.test_requirements
import sys
import os

# Add the project root (RU-Algorithmic-Advising) to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app  # import your Flask app
from services.requirement_group_service import RequirementGroupService

# Function to show all requirements for a given program
def show_all_requirements(program_id):  
    top_groups = RequirementGroupService.get_requirement_group_by_program(program_id)
    print(len(top_groups), "Top Level Groups")
    for group in top_groups:
        print(f"{group.group_id} - {group.group_name} (Num Required: {group.num_required})")
        children = RequirementGroupService.get_child_requirement_groups(group.group_id)
        print(f"  {len(children)} Child Groups")
        for child in children:
            print(f"  Child {child.group_id} - {child.group_name} (List: {child.list})")

# Function to test get_requirement_group_by_id
def test_get_group_by_id(group_id):
    group = RequirementGroupService.get_requirement_group_by_id(group_id)
    if group:
        print(f"✅ Found group: {group.group_id} - {group.group_name}")
        print(f"   Program ID: {group.program_id}")
        print(f"   Num Required: {group.num_required}")
        print(f"   Course List: {group.list}")
    else:
        print(f"❌ No group found with ID {group_id}")

if __name__ == "__main__":
    with app.app_context():
        # Show all requirements for the CS program
        show_all_requirements("NB198SJ")

        print("\n--- Testing get_requirement_group_by_id ---")
        test_get_group_by_id(1)  # Replace 1 with any valid group_id in your DB
