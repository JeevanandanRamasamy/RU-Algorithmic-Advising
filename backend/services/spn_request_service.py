from db import db
from sqlalchemy.exc import SQLAlchemyError
from models.spn_request import SPNRequest

class SPNRequestService:
    @staticmethod
    def get_spn_requests():
        """Retrieve all SPN requests."""
        try:
            return SPNRequest.query.all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving SPN requests: {str(e)}"
        
    @staticmethod
    def get_spn_requests_by_student_id(student_id):
        """Retrieve SPN requests by student_id."""
        try:
            return SPNRequest.query.filter_by(student_id=student_id).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving SPN requests: {str(e)}"
        
    @staticmethod
    def get_spn_pending(pending: bool):
        """Retrieve all pending requests if true; otherwise all non‑pending."""
        try:
            if pending:
                return SPNRequest.query.filter_by(status='Pending').all()
            return SPNRequest.query.filter(SPNRequest.status != 'Pending').all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving SPN requests: {str(e)}"

    @staticmethod
    def get_spn_request_by_course_id(course_id):
        """Retrieve SPN request by course_id."""
        try:
            return SPNRequest.query.filter_by(course_id=course_id).all()
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error retrieving SPN request: {str(e)}"
    
    @staticmethod
    def insert_spn_request(spn_request_data):
        """Insert a new SPN request into the database."""
        try:
            new_spn_request = SPNRequest(**spn_request_data)
            db.session.add(new_spn_request)
            db.session.commit()
            return new_spn_request
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error inserting SPN request: {str(e)}"
        
    @staticmethod
    def update_spn_request(identifier: dict, spn_request_data: dict):
        """Update an existing SPN request."""
        try:
            spn_request = SPNRequest.query.filter_by(**identifier).first()
            if spn_request:
                for key, value in spn_request_data.items():
                    setattr(spn_request, key, value)
                db.session.commit()
                return spn_request
            else:
                return "SPN request not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error updating SPN request: {str(e)}"
        
    @staticmethod
    def insert_spn_requests_best_effort(spn_request_list): # For inserting multiple at a time
        successful = []
        failed = []

        try:
            db.session.add_all(spn_request_list)
            db.session.commit()
            return {"success": spn_request_list, "failed": []}
        except SQLAlchemyError:
            db.session.rollback()
            # Retry individually
            for req in spn_request_list:
                try:
                    db.session.add(req)
                    db.session.commit()
                    successful.append(req)
                except SQLAlchemyError as e:
                    db.session.rollback()
                    failed.append({"request": req, "error": str(e)})
            return {"success": successful, "failed": failed}
        
    @staticmethod
    def delete_spn_request(spn_request_id):
        """Delete a SPN request by its spn_request_id."""
        try:
            spn_request = SPNRequest.query.filter_by(spn_request_id=spn_request_id).first()
            if spn_request:
                db.session.delete(spn_request)
                db.session.commit()
                return f"SPN request {spn_request_id} deleted successfully"
            else:
                return "SPN request not found"
        except SQLAlchemyError as e:
            db.session.rollback()
            return f"Error deleting SPN request: {str(e)}"
