from models import db, DegreePlan, PlannedCourse
from flask_jwt_extended import get_jwt_identity  # To get user info from JWT
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from services.db_service import DBService

# TODO This whole file can and should be cleaned up / optimized


class UserPlanService:
    @staticmethod
    def get_planned_courses_for_user():
        """Retrieve planned courses for the logged-in user."""
        try:
            username = get_jwt_identity()  # Get the username from JWT
            degree_plans = DegreePlan.query.filter_by(
                username=username
            ).all()  # Get the user's degree plans

            if not degree_plans:
                plan_data = {
                    "username": username,
                    "plan_name": f"New Plan",  # Plan name will be generated upon commit
                    "last_updated": datetime.now(),
                }
                degree_plan = DBService.insert_degree_plan(plan_data)
                # Ensure degree_plan is returned correctly from insert_degree_plan
                if not isinstance(degree_plan, DegreePlan):
                    return {
                        "message": f"Error creating degree plan: {degree_plan}"
                    }, 500

            # List to store all planned courses
            planned_courses = []

            # Iterate through each degree plan to get associated planned courses
            for plan in degree_plans:
                courses = PlannedCourse.query.filter_by(
                    plan_id=plan.plan_id
                ).all()  # Get planned courses for each degree plan
                for course in courses:
                    planned_courses.append(
                        {
                            "plan_id": course.plan_id,
                            "course_id": course.course_id,
                            "term": course.term,
                            "year": course.year,
                        }
                    )

            return planned_courses  # Return list of planned courses for the user
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving planned courses: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def add_course_to_plan(course_id, plan_id, term, year):
        username = get_jwt_identity()  # Get the username from JWT

        # Get the degree plan(s) for the user
        degree_plans = DBService.get_degree_plans(username)

        # If no degree plans exist for the user, create a new one
        if not degree_plans:
            plan_data = {
                "username": username,
                "plan_name": f"New Plan",  # Plan name will be generated upon commit
                "last_updated": datetime.now(),
            }
            degree_plan = DBService.insert_degree_plan(plan_data)
            # Ensure degree_plan is returned correctly from insert_degree_plan
            if not isinstance(degree_plan, DegreePlan):
                return {"message": f"Error creating degree plan: {degree_plan}"}, 500
        else:
            degree_plan = degree_plans[
                0
            ]  # Assuming user can have multiple plans, select the first one.

        # Check if the course already exists in the planned courses
        existing_course = PlannedCourse.query.filter_by(
            plan_id=degree_plan.plan_id, course_id=course_id
        ).first()

        if existing_course:
            return f"Course {course_id} is already in the plan"

        # Prepare data for the planned course
        planned_course_data = {
            "plan_id": degree_plan.plan_id,
            "course_id": course_id,
            "term": term,
            "year": year,
        }

        # Insert the course using the insert_planned_course method
        response = DBService.insert_planned_course(planned_course_data)

        if isinstance(response, PlannedCourse):  # If course insertion was successful
            return {
                "message": f"Course {course_id} added to degree plan",
                "plan_id": degree_plan.plan_id,
                "course_id": course_id,
            }
        else:
            return {"message": response}  # Error message from insert_planned_course

    @staticmethod
    def drop_course_from_plan(plan_id, course_id):
        username = get_jwt_identity()  # Get the username from JWT

        # Get the degree plans for the user
        degree_plans = DBService.get_degree_plans(username)

        # If no degree plans exist, create a new one
        degree_plan = next(
            (plan for plan in degree_plans if plan.plan_id == plan_id), None
        )

        if not degree_plan:
            # Create a new degree plan for the user
            plan_data = {
                "username": username,
                "plan_name": f"New Plan {plan_id}",  # This will be assigned after commit, so don't worry about plan_id initially
                "last_updated": datetime.now(),
            }
            degree_plan = DBService.insert_degree_plan(plan_data)

        # Now that we are sure the degree plan exists, use the delete_planned_course method to remove the course
        response = DBService.delete_planned_course(plan_id, course_id)

        if "successfully" in response:
            # If the course was successfully deleted, update the degree plan's last updated timestamp
            degree_plan.last_updated = datetime.now()
            db.session.commit()

            return {"message": response, "plan_id": plan_id, "course_id": course_id}
        else:
            # If there was an error, return the response as is
            return {"message": response}
