from backend.app import create_app
from backend.services.user_service import UserService
import pytest
from unittest.mock import patch, MagicMock


# @pytest.fixture
# def client():
#     app = create_app()
#     with app.test_client() as client:
#         with app.app_context():
#             yield client


@patch("services.user_service.db.session.commit")
@patch("services.user_service.CourseRecord.query")
@patch("services.user_service.SemestersService.generate_semesters")
@patch("services.user_service.StudentDetails.query")
def test_update_student_details_success(
    mock_student_query,
    mock_generate_semesters,
    mock_course_record_query,
    mock_commit,
):

    app = create_app()
    with app.app_context():
        mock_student = MagicMock()
        mock_student.username = "test_user"
        mock_student.enroll_year = 2019
        mock_student.grad_year = 2023
        mock_student.gpa = 3.5

        mock_student_query.filter_by.return_value.first.return_value = mock_student
        mock_generate_semesters.return_value = [
            {"term": "Fall", "year": 2020},
            {"term": "Spring", "year": 2021},
            {"term": "Fall", "year": 2021},
        ]
        mock_course_record_query.filter.return_value.delete.return_value = 1

        updated_student = UserService.update_student_details(
            username="test_user",
            enroll_year=2020,
            grad_year=2024,
            gpa=3.9,
        )

        assert updated_student.enroll_year == 2020
        assert updated_student.grad_year == 2024
        assert updated_student.gpa == 3.9
        mock_commit.assert_called_once()
