from db import db
from datetime import datetime
from models import (
    Account,
    StudentDetails,
    Course,
    CourseTaken,
    Program,
    StudentProgram,
    RequirementGroup,
    DegreePlan,
    PlannedCourse,
    SchedulePlan,
    Section,
)
from sqlalchemy.exc import SQLAlchemyError


class DBService:
    # ------------------ ACCOUNT OPERATIONS ------------------
    @staticmethod
    def get_account_by_username(username):
        try:
            return Account.query.filter_by(username=username).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving account: {str(e)}"

    @staticmethod
    def check_account_exists(username):
        print("this")
        try:
            return db.session.query(
                db.exists().where(Account.username == username)
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking account existence: {str(e)}"

    @staticmethod
    def insert_new_account(account_data):
        try:
            new_account = Account(**account_data)
            db.session.add(new_account)
            db.session.commit()
            return new_account
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting account: {str(e)}"

    @staticmethod
    def update_account(username, new_data):
        try:
            account = Account.query.filter_by(username=username).first()
            if account:
                for key, value in new_data.items():
                    setattr(account, key, value)
                db.session.commit()
                return account
            else:
                return "Account not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating account: {str(e)}"

    @staticmethod
    def delete_account(username):
        try:
            account = Account.query.filter_by(username=username).first()
            if account:
                db.session.delete(account)
                db.session.commit()
                return f"Account {username} deleted successfully"
            else:
                return "Account not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting account: {str(e)}"

    @staticmethod
    def delete_all_accounts():
        try:
            Account.query.delete()
            db.session.commit()
            return "All accounts deleted successfully"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting all accounts: {str(e)}"

    # ------------------ STUDENT OPERATIONS ------------------
    @staticmethod
    def add_student_details(student_data):
        try:
            new_student = StudentDetails(**student_data)
            db.session.add(new_student)
            db.session.commit()
            return new_student
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error adding student details: {str(e)}"

    @staticmethod
    def delete_student_details(username):
        try:
            student = StudentDetails.query.filter_by(username=username).first()
            if student:
                db.session.delete(student)
                db.session.commit()
                return f"Student {username} deleted successfully"
            else:
                return "Student not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting student details: {str(e)}"

    @staticmethod
    def update_student_details(username, new_data):
        try:
            student = StudentDetails.query.filter_by(username=username).first()
            if student:
                for key, value in new_data.items():
                    setattr(student, key, value)
                db.session.commit()
                return student
            else:
                return "Student not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating student details: {str(e)}"

    @staticmethod
    def get_student_details(username):
        try:
            return StudentDetails.query.filter_by(username=username).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving student details: {str(e)}"

    @staticmethod
    def update_student_details(username, new_data):
        try:
            student_details = StudentDetails.query.filter_by(username=username).first()
            if student_details:
                for key, value in new_data.items():
                    setattr(student_details, key, value)
                db.session.commit()
                return student_details
            else:
                return "StudentDetails not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating account: {str(e)}"

    @staticmethod
    def get_student_programs(username):
        try:
            return (
                Program.query.join(
                    StudentProgram, Program.program_id == StudentProgram.program_id
                )
                .filter(StudentProgram.username == username)
                .all()
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving student programs: {str(e)}"

    @staticmethod
    def get_students_in_program(program_id):
        try:
            return (
                StudentDetails.query.join(
                    StudentProgram, StudentDetails.username == StudentProgram.username
                )
                .filter(StudentProgram.program_id == program_id)
                .all()
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving students in program: {str(e)}"

    @staticmethod
    def insert_program_for_student(username, program_id):

        try:
            if not DBService.check_account_exists(username):
                return f"User account not found"

            program = DBService.get_program(program_id)

            if not program:
                return f"Program not found"

            if DBService.check_program_exists_for_student(username, program_id):
                return f"Student has already added program"

            student_program = StudentProgram(username=username, program_id=program_id)

            db.session.add(student_program)
            db.session.commit()

            return program

        except SQLAlchemyError as e:

            db.session.rollback()

            return f"Error inserting program for student: {str(e)}"

    @staticmethod
    def delete_program_for_student(username, program_id):
        try:
            if not DBService.check_account_exists(username):
                return f"User account not found"

            program = DBService.get_program(program_id)
            if not program:
                return f"Program not found"

            student_program = (
                db.session.query(StudentProgram)
                .filter_by(username=username, program_id=program_id)
                .first()
            )
            if not student_program:
                return "Program not found for the student."

            db.session.delete(student_program)
            db.session.commit()
            return program
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting inserting program for student: {str(e)}"

    @staticmethod
    def get_courses_taken_by_student(username):
        try:
            return (
                Course.query.join(
                    CourseTaken, Course.course_id == CourseTaken.course_id
                )
                .filter(CourseTaken.username == username)
                .all()
            )
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving courses taken: {str(e)}"

    # ------------------ COURSE OPERATIONS ------------------
    @staticmethod
    def get_course_by_id(course_id):
        """Retrieve a course by its course_id."""
        try:
            return Course.query.filter_by(course_id=course_id).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving course: {str(e)}"

    @staticmethod
    def insert_course(course_data):
        """Insert a new course into the database."""
        try:
            new_course = Course(**course_data)
            db.session.add(new_course)
            db.session.commit()
            return new_course
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting course: {str(e)}"

    @staticmethod
    def delete_course(course_id):
        """Delete a course by its course_id."""
        try:
            course = Course.query.filter_by(course_id=course_id).first()
            if course:
                db.session.delete(course)
                db.session.commit()
                return f"Course {course_id} deleted successfully"
            else:
                return "Course not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting course: {str(e)}"

    # ------------------ PROGRAM OPERATIONS ------------------
    @staticmethod
    def get_programs(program_type):
        try:
            return Program.query.filter(program_type=program_type).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error getting programs: {str(e)}"

    @staticmethod
    def get_programs():
        try:
            return Program.query.all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error getting programs: {str(e)}"

    @staticmethod
    def get_program(program_id):
        try:
            return Program.query.filter(Program.program_id == program_id).first()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking program existence: {str(e)}"

    @staticmethod
    def check_program_exists(program_id):
        try:
            return db.session.query(
                db.exists().where(Program.program_id == program_id)
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking program existence: {str(e)}"

    @staticmethod
    def check_program_exists_for_student(username, program_id):
        try:
            return StudentProgram.query.filter(
                StudentProgram.username == username,
                StudentProgram.program_id == program_id,
            ).scalar()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error checking program for student: {str(e)}"

    @staticmethod
    def insert_program(program_data):
        """Insert a new program into the database."""
        try:
            new_program = Program(**program_data)
            db.session.add(new_program)
            db.session.commit()
            return new_program
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting program: {str(e)}"

    @staticmethod
    def delete_program(program_id):
        """Delete a program by its program_id."""
        try:
            program = Program.query.filter_by(program_id=program_id).first()
            if program:
                db.session.delete(program)
                db.session.commit()
                return f"Program {program_id} deleted successfully"
            else:
                return "Program not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting program: {str(e)}"

    # ------------------ REQUIREMENT GROUP OPERATIONS ------------------
    @staticmethod
    def get_requirement_groups(program_id):
        try:
            return RequirementGroup.query.filter_by(program_id=program_id).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving requirement groups: {str(e)}"

    @staticmethod
    def insert_requirement_group(requirement_data):
        """Insert a new requirement group."""
        try:
            new_requirement = RequirementGroup(**requirement_data)
            db.session.add(new_requirement)
            db.session.commit()
            return new_requirement
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting requirement group: {str(e)}"

    @staticmethod
    def delete_requirement_group(group_id):
        """Delete a requirement group by its group_id."""
        try:
            requirement = RequirementGroup.query.filter_by(group_id=group_id).first()
            if requirement:
                db.session.delete(requirement)
                db.session.commit()
                return f"Requirement group {group_id} deleted successfully"
            else:
                return "Requirement group not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting requirement group: {str(e)}"

    # ------------------ DEGREE PLAN OPERATIONS ------------------
    @staticmethod
    def get_degree_plans(username):
        try:
            return DegreePlan.query.filter_by(username=username).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving degree plans: {str(e)}"

    @staticmethod
    def insert_degree_plan(plan_data):
        """Insert a new degree plan into the database."""
        try:
            new_plan = DegreePlan(**plan_data)
            db.session.add(new_plan)
            db.session.commit()
            return new_plan
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting degree plan: {str(e)}"

    @staticmethod
    def delete_degree_plan(plan_id):
        """Delete a degree plan by its ID."""
        try:
            plan = DegreePlan.query.filter_by(plan_id=plan_id).first()
            if plan:
                db.session.delete(plan)
                db.session.commit()
                return f"Degree plan {plan_id} deleted successfully"
            else:
                return "Degree plan not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting degree plan: {str(e)}"

    # ------------------ PLANNED COURSE OPERATIONS ------------------
    @staticmethod
    def get_planned_courses(plan_id):
        try:
            return PlannedCourse.query.filter_by(plan_id=plan_id).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving planned courses: {str(e)}"

    @staticmethod
    def insert_planned_course(planned_course_data):
        """Insert a planned course into a degree plan."""
        try:
            new_course = PlannedCourse(**planned_course_data)
            db.session.add(new_course)
            plan_id = planned_course_data.get("plan_id")
            degree_plan = DegreePlan.query.filter_by(plan_id=plan_id).first()
            if degree_plan:
                degree_plan.last_updated = datetime.now()
                db.session.add(degree_plan)
            db.session.commit()
            return new_course
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting planned course: {str(e)}"

    @staticmethod
    def delete_planned_course(plan_id, course_id):
        """Delete a planned course from a degree plan and update the last_updated timestamp."""
        try:
            planned_course = PlannedCourse.query.filter_by(
                plan_id=plan_id, course_id=course_id
            ).first()
            if planned_course:
                db.session.delete(planned_course)
                degree_plan = DegreePlan.query.filter_by(plan_id=plan_id).first()
                if degree_plan:
                    degree_plan.last_updated = datetime.now()
                    db.session.add(degree_plan)
                db.session.commit()
                return f"Planned course {course_id} deleted successfully from plan {plan_id}"
            else:
                return "Planned course not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting planned course: {str(e)}"

    @staticmethod
    def update_planned_course(plan_id, course_id, new_data):
        """Update a planned course by its plan_id and course_id."""
        try:
            planned_course = PlannedCourse.query.filter_by(
                plan_id=plan_id, course_id=course_id
            ).first()
            if planned_course:
                for key, value in new_data.items():
                    setattr(planned_course, key, value)
                db.session.commit()
                return planned_course
            else:
                return "Planned course not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating planned course: {str(e)}"

    # ------------------ SCHEDULE PLAN OPERATIONS ------------------
    @staticmethod
    def get_schedule(username):
        """Retrieve all schedules associated with a student."""
        try:
            return SchedulePlan.query.filter_by(username=username).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving schedules: {str(e)}"

    @staticmethod
    def insert_schedule(schedule_data):
        """Insert a new schedule plan."""
        try:
            new_schedule = SchedulePlan(**schedule_data)
            db.session.add(new_schedule)
            db.session.commit()
            return new_schedule
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting schedule: {str(e)}"

    @staticmethod
    def delete_schedule(schedule_id):
        """Delete a schedule plan by its ID."""
        try:
            schedule = SchedulePlan.query.filter_by(schedule_id=schedule_id).first()
            if schedule:
                db.session.delete(schedule)
                db.session.commit()
                return f"Schedule {schedule_id} deleted successfully"
            else:
                return "Schedule not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting schedule: {str(e)}"

    # ------------------ SECTION OPERATIONS ------------------
    @staticmethod
    def get_sections_in_schedule(schedule_data):
        """Insert a new schedule plan."""
        try:
            new_schedule = SchedulePlan(**schedule_data)
            db.session.add(new_schedule)
            db.session.commit()
            return new_schedule
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving sections: {str(e)}"

    @staticmethod
    def insert_section(section_data):
        """Insert a new section into a schedule plan."""
        try:
            new_section = Section(**section_data)
            db.session.add(new_section)
            schedule_id = section_data.get("schedule_id")
            schedule_plan = SchedulePlan.query.filter_by(
                schedule_id=schedule_id
            ).first()
            if schedule_plan:
                schedule_plan.last_updated = datetime.now()
                db.session.add(schedule_plan)
            db.session.commit()
            return new_section
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting section: {str(e)}"

    @staticmethod
    def delete_section(schedule_id, course_id, section_num):
        """Delete a section from a schedule plan."""
        try:
            section = Section.query.filter_by(
                schedule_id=schedule_id, course_id=course_id, section_num=section_num
            ).first()
            if section:
                db.session.delete(section)
                schedule_plan = SchedulePlan.query.filter_by(
                    schedule_id=schedule_id
                ).first()
                if schedule_plan:
                    schedule_plan.last_updated = datetime.now()
                    db.session.add(schedule_plan)
                db.session.commit()
                return f"Section {section_num} of course {course_id} deleted successfully from schedule {schedule_id}"
            else:
                return "Section not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting section: {str(e)}"

    @staticmethod
    def update_section(schedule_id, course_id, section_num, new_data):
        """Update a section in a schedule plan."""
        try:
            section = Section.query.filter_by(
                schedule_id=schedule_id, course_id=course_id, section_num=section_num
            ).first()
            if section:
                for key, value in new_data.items():
                    setattr(section, key, value)
                db.session.commit()
                return section
            else:
                return "Section not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating section: {str(e)}"

    # ------------------ GENERAL OPERATIONS ------------------
    @staticmethod
    def execute_raw_sql(query):
        """Execute a raw SQL query and return the result."""
        try:
            result = db.session.execute(query)
            return result.fetchall()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error executing query: {str(e)}"

    @staticmethod
    def commit_session():
        """Commit the current database session."""
        try:
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error committing session: {str(e)}"
