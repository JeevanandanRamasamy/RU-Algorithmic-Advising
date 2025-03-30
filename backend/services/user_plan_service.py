from models import Course, db, DegreePlan, PlannedCourse
from flask_jwt_extended import get_jwt_identity  # To get user info from JWT
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from services.db_service import DBService

# TODO This whole file can and should be cleaned up / optimized


class UserPlanService:
    @staticmethod
    def get_planned_courses_for_user(username):
        """Retrieve planned courses for the logged-in user."""
        try:
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
                courses = (
                    db.session.query(PlannedCourse, Course)
                    .join(Course, Course.course_id == PlannedCourse.course_id)
                    .filter(PlannedCourse.plan_id == plan.plan_id)
                    .all()
                )
                for planned_course, course in courses:
                    planned_courses.append(
                        {
                            "plan_id": planned_course.plan_id,
                            "term": planned_course.term,
                            "year": planned_course.year,
                            "course_info": {
                                "course_id": course.course_id,
                                "course_name": course.course_name,
                                "credits": course.credits,
                                "course_link": course.course_link,
                            },
                        }
                    )
                # PlannedCourse.query.filter_by(
                #     plan_id=plan.plan_id
                # ).join(Course, Course.course_id == ).all()  # Get planned courses for each degree plan
                # for course in courses:
                #     planned_courses.append(
                #         {
                #             "plan_id": course.plan_id,
                #             "course_id": course.course_id,
                #             "term": course.term,
                #             "year": course.year,
                #         }
                #     )

            return planned_courses  # Return list of planned courses for the user
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving planned courses: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"

    @staticmethod
    def get_planned_course_for_user(course_id, plan_id):
        """Retrieve planned course for the logged-in user. by course_id and plan_d"""
        try:
            planned_course = (
                db.session.query(PlannedCourse, Course)
                .join(Course, Course.course_id == PlannedCourse.course_id)
                .filter(
                    PlannedCourse.course_id == course_id
                    and PlannedCourse.plan_id == plan_id
                )
                .first()
            )
            if not planned_course:
                return f"Planned course not found"

            planned, course = planned_course

            return {
                "plan_id": planned.plan_id,
                "term": planned.term,
                "year": planned.year,
                "course_info": {
                    "course_id": course.course_id,
                    "course_name": course.course_name,
                    "credits": course.credits,
                    "course_link": course.course_link,
                },
            }
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving planned course: {str(e)}"
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
            course_id=course_id,
            plan_id=degree_plan.plan_id,
        ).first()

        if existing_course:
            existing_course.term = term
            existing_course.year = int(year)
            db.session.commit()
        else:
            planned_course = PlannedCourse(
                plan_id=plan_id, course_id=course_id, term=term, year=int(year)
            )
            db.session.add(planned_course)
            db.session.commit()
        UserPlanService.get_planned_course_for_user(course_id, plan_id)

        return UserPlanService.get_planned_course_for_user(course_id, plan_id)

    @staticmethod
    def drop_course_from_plan(course_id):
        username = get_jwt_identity()  # Get the username from JWT

        degree_plans = DBService.get_degree_plans(username)

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

        # Get the degree plans for the user

        # If no degree plans exist, create a new one

        # Now that we are sure the degree plan exists, use the delete_planned_course method to remove the course
        response = DBService.delete_planned_course(degree_plan.plan_id, course_id)
        print(response)

        if "successfully" in response:
            # If the course was successfully deleted, update the degree plan's last updated timestamp
            degree_plan.last_updated = datetime.now()
            db.session.commit()

            return {
                "message": response,
                "plan_id": degree_plan.plan_id,
                "course_id": course_id,
            }
        else:
            # If there was an error, return the response as is
            return {"message": response}
