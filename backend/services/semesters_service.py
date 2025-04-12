from datetime import datetime


class Semesters:
    @staticmethod
    def encode_semester(term, year):
        term_offset = {"spring": 0, "summer": 1, "fall": 2, "winter": 3}
        return year * 4 + term_offset[term]

    @staticmethod
    def decode_semester(encoded):
        terms = ["spring", "summer", "fall", "winter"]
        year = encoded // 4
        term = terms[encoded % 4]
        return {"term": term, "year": year}

    @staticmethod
    def generate_semesters(enrolled_year, grad_year):
        semesters = []
        start_encoded = Semesters.encode_semester("fall", enrolled_year)
        end_encoded = Semesters.encode_semester("summer", grad_year)

        for encoded in range(start_encoded, end_encoded + 1):
            semesters.append(Semesters.decode_semester(encoded))

        return semesters

    from datetime import datetime

    @staticmethod
    def get_current_semester():
        month = datetime.now().month
        year = datetime.now().year

        if month == 12:
            term = "winter"
        elif month >= 9:
            term = "fall"
        elif month >= 6:
            term = "summer"
        elif month < 6:
            term = "spring"

        return {"term": term, "year": year}

    @staticmethod
    def generate_semesters_till_now(start_year):
        semesters = []
        current_semester = Semesters.get_current_semester()
        start_encoded = Semesters.encode_semester("fall", start_year)
        end_encoded = Semesters.encode_semester(
            current_semester["term"], current_semester["year"]
        )

        for encoded in range(start_encoded, end_encoded + 1):
            semesters.append(Semesters.decode_semester(encoded))

        return semesters

    @staticmethod
    def contains_semester(semesters_till_now, year, term):
        return any(
            semester["year"] == year and semester["term"] == term
            for semester in semesters_till_now
        )
