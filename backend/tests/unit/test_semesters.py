from freezegun import freeze_time


from backend.services.semesters_service import Semesters


def test_encode_semester():
    assert Semesters.encode_semester("fall", 2024) == (2024 * 4) + 2
    assert Semesters.encode_semester("spring", 2022) == (2022 * 4)


def test_decode_semester():
    encoded = 2024 * 4 + 2
    decoded = Semesters.decode_semester(encoded)
    assert decoded == {"term": "fall", "year": 2024}

    encoded = 2022 * 4
    decoded = Semesters.decode_semester(encoded)
    assert decoded == {"term": "spring", "year": 2022}


def test_generate_semesters():
    semesters = Semesters.generate_semesters(2023, 2024)
    assert semesters == [
        {"term": "fall", "year": 2023},
        {"term": "winter", "year": 2023},
        {"term": "spring", "year": 2024},
        {"term": "summer", "year": 2024},
    ]


@freeze_time("2025-07-15")
def test_get_current_semester_summer():
    result = Semesters.get_current_semester()
    assert result == {"term": "summer", "year": 2025}


@freeze_time("2025-10-01")
def test_get_current_semester_fall():
    result = Semesters.get_current_semester()
    assert result == {"term": "fall", "year": 2025}


@freeze_time("2025-12-25")
def test_get_current_semester_winter():
    result = Semesters.get_current_semester()
    assert result == {"term": "winter", "year": 2025}


@freeze_time("2025-03-15")
def test_get_current_semester_spring():
    result = Semesters.get_current_semester()
    assert result == {"term": "spring", "year": 2025}


@freeze_time("2025-03-15")
def test_generate_semesters_till_now():
    semesters = Semesters.generate_semesters_till_now(2023)
    print(semesters)
    assert semesters == [
        {"term": "fall", "year": 2023},
        {"term": "winter", "year": 2023},
        {"term": "spring", "year": 2024},
        {"term": "summer", "year": 2024},
        {"term": "fall", "year": 2024},
        {"term": "winter", "year": 2024},
        {"term": "spring", "year": 2025},
    ]


def test_contains_semester():
    semesters = [
        {"term": "fall", "year": 2023},
        {"term": "spring", "year": 2024},
        {"term": "summer", "year": 2024},
    ]
    assert Semesters.contains_semester(semesters, 2024, "spring") is True
    assert Semesters.contains_semester(semesters, 2023, "winter") is False
