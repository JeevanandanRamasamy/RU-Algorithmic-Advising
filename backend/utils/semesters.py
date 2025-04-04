from datetime import datetime


def encode_semester(term, year):
    term_offset = {"winter": 0, "spring": 1, "summer": 2, "fall": 3}
    return year * 4 + term_offset[term]


def decode_semester(encoded):
    terms = ["winter", "spring", "summer", "fall"]
    year = encoded // 4
    term = terms[encoded % 4]
    return {"term": term, "year": year}


def generate_semesters(enrolled_year, grad_year):
    semesters = []
    start_encoded = encode_semester("fall", enrolled_year)
    end_encoded = encode_semester("summer", grad_year)

    for encoded in range(start_encoded, end_encoded + 1):
        semesters.append(decode_semester(encoded))

    return semesters


from datetime import datetime


def get_current_semester():
    month = datetime.now().month
    year = datetime.now().year

    if month >= 9:
        term = "fall"
    elif month >= 6:
        term = "summer"
    else:
        term = "spring"

    return {"term": term, "year": year}


def generate_semesters_till_now(start_year):
    semesters = []
    current_semester = get_current_semester()
    start_encoded = encode_semester("fall", start_year)
    end_encoded = encode_semester(current_semester["term"], current_semester["year"])

    for encoded in range(start_encoded, end_encoded + 1):
        semesters.append(decode_semester(encoded))

    return semesters


def contains_semester(semesters_till_now, year, term):
    return any(
        semester["year"] == year and semester["term"] == term
        for semester in semesters_till_now
    )
