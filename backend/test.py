from services.user_service import UserService
from services.user_program_service import UserProgramService
from services.course_record_service import CourseRecordService
from services.requirement_service import RequirementService
from services.requirement_group_service import RequirementGroupService
import pandas as pd
from db import db
from app import create_app

def test_requirements():
    app = create_app(testing=False)
    with app.app_context():
        db.create_all()
        UserService.insert_new_account(
            {
                "username": "test",
                "password": "test",
                "first_name": "Test",
                "last_name": "User",
                "role": "student"
            }
        )
        UserService.add_student_details(
            {
                "username": "test",
                "grad_year": "2025",
                "enroll_year": "2021",
                "credits_earned": 90,
                "gpa": 3.5,
            }
        )
        UserProgramService.insert_program_for_student(username="test", program_id="NB198SJ")
        UserProgramService.insert_program_for_student(username="test", program_id="01")
        UserProgramService.insert_program_for_student(username="test", program_id="NB219SJ")

        # INSERT INTO RequirementGroup (program_id, course_id, num_required, list, parent_group_id)
        # VALUES (NULL, NULL, 5, '["01:198:210", "01:198:213", "01:198:214", "01:198:314",
        # 	"01:198:336", "01:198:439", "01:198:462"]', 4), -- 4: BSCS
        # 	(NULL, NULL, 7, '["01:198:210", "01:198:213", "01:198:214", "01:198:314",
        # 	"01:198:323", "01:198:324", "01:198:334", "01:198:336", "01:198:345", "01:198:352",
        # 	"01:198:411", "01:198:415", "01:198:416", "01:198:417", "01:198:419", "01:198:424",
        # 	"01:198:425", "01:198:428", "01:198:431", "01:198:437", "01:198:439", "01:198:440",
        # 	"01:198:442", "01:198:443", "01:198:444", "01:198:452", "01:198:460", "01:198:461",
        # 	"01:198:462", "01:198:463", "01:615:441", "01:640:338", "01:640:339", "01:640:348",
        # 	"01:640:354", "01:640:355", "01:640:424", "01:640:428", "01:640:453", "01:640:454",
        # 	"01:640:461", "01:730:315", "01:730:329", "01:730:407", "01:730:408", "01:730:424",
        # 	"01:960:384", "01:960:463", "01:960:476", "01:960:486", "14:332:376", "14:332:423",
        # 	"14:332:424", "14:332:451", "14:332:452", "14:332:476"]', 4);
        # INSERT INTO RequirementGroup (program_id, course_id, num_required, list, parent_group_id)
        # 	(NULL, NULL, 0, '["01:750:203", "01:750:204", "01:750:205", "01:750:206"]', 5),

        courses_taken = [
            # {"username": "test", "course_id": "01:050:210", "term": "fall", "year": 2022},
            # {"username": "test", "course_id": "01:198:142", "term": "spring", "year": 2022},
            # {"username": "test", "course_id": "01:750:203", "term": "spring", "year": 2021},
            # {"username": "test", "course_id": "01:750:204", "term": "spring", "year": 2022},
            # {"username": "test", "course_id": "01:750:205", "term": "spring", "year": 2021},
            # {"username": "test", "course_id": "01:750:206", "term": "spring", "year": 2022},
            # {"username": "test", "course_id": "01:830:101", "term": "fall", "year": 2021},
            # {"username": "test", "course_id": "37:575:202", "term": "fall", "year": 2022},
            # {"username": "test", "course_id": "01:730:101", "term": "fall", "year": 2021},
            # {"username": "test", "course_id": "01:355:101", "term": "spring", "year": 2021},
            # {"username": "test", "course_id": "01:355:202", "term": "spring", "year": 2022},
            # {"username": "test", "course_id": "01:960:212", "term": "fall", "year": 2021},
            # {"username": "test", "course_id": "01:198:111", "term": "spring", "year": 2021},
            # {"username": "test", "course_id": "01:198:112", "term": "fall", "year": 2021},
            # {"username": "test", "course_id": "01:198:205", "term": "spring", "year": 2022},
            # {"username": "test", "course_id": "01:198:206", "term": "fall", "year": 2022},
            # {"username": "test", "course_id": "01:198:211", "term": "spring", "year": 2022},
            # {"username": "test", "course_id": "01:198:344", "term": "fall", "year": 2023},
            {"username": "test", "course_id": "01:640:112", "term": "spring", "year": 2021},
            # {"username": "test", "course_id": "01:640:151", "term": "spring", "year": 2021},
            # {"username": "test", "course_id": "01:640:152", "term": "spring", "year": 2021},
            # {"username": "test", "course_id": "01:640:250", "term": "fall", "year": 2021},
            # {"username": "test", "course_id": "01:198:210", "term": "spring", "year": 2023},
            # {"username": "test", "course_id": "01:198:213", "term": "fall", "year": 2023},
            # {"username": "test", "course_id": "01:198:214", "term": "fall", "year": 2023},
            {"username": "test", "course_id": "01:356:156", "term": "spring", "year": 2021},
        ]
        CourseRecordService.delete_all_course_records(username="test")  # Clear any existing courses taken for the test user
        for course in courses_taken:
            CourseRecordService.insert_course_record(course)
            
        missing_courses = RequirementService.get_missing_requirements(username="test", program_id="01")
        print("Missing courses for test user:", missing_courses)
        print(RequirementService.get_all_prerequisites(course_id="01:640:151"))
        suggested_courses, total_credits = RequirementService.get_suggested_courses(username="test")
        print("Courses taken by test user:", [course['course_id'] for course in courses_taken])
        print("Suggested courses for test user:", suggested_courses, "Total credits:", total_credits)
        # course_plan = RequirementService.create_course_plan(username="test")
        # print("Course plan for test user:", course_plan)

def test_course_list():
    df = pd.read_csv("course_list.csv")
    longest_index = df['prerequisites'].fillna('').apply(len).idxmax()
    print("Index:", longest_index, ", Length:", len(df['prerequisites'][longest_index]), ", Course ID:", df['course_id'][longest_index])
    print("Longest prerequisites:", df['prerequisites'][longest_index])

if __name__ == "__main__":
    test_requirements()
    # test_course_list()