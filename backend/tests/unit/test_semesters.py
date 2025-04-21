from freezegun import freeze_time
from backend.services.semesters_service import SemestersService


# T01
def test_generate_semesters():
    semesters = SemestersService.generate_semesters(2023, 2024)
    assert semesters == [
        {"term": "fall", "year": 2023},
        {"term": "winter", "year": 2023},
        {"term": "spring", "year": 2024},
        {"term": "summer", "year": 2024},
    ]
