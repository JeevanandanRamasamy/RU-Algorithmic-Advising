from datetime import datetime


class SemestersService:
    @staticmethod
    def encode_semester(term, year):
        """
        Encodes a semester into an integer representation.
        """
        term_offset = {"spring": 0, "summer": 1, "fall": 2, "winter": 3}
        return year * 4 + term_offset[term]

    @staticmethod
    def decode_semester(encoded):
        """
        Decodes an integer representation back into a semester.
        """
        terms = ["spring", "summer", "fall", "winter"]
        year = encoded // 4
        term = terms[encoded % 4]
        return {"term": term, "year": year}

    @staticmethod
    def generate_semesters(enroll_year, grad_year):
        """
        Generates a list of semesters between the enrollment year and graduation year.
        """
        semesters = []
        start_encoded = SemestersService.encode_semester("fall", enroll_year)
        end_encoded = SemestersService.encode_semester("summer", grad_year)

        for encoded in range(start_encoded, end_encoded + 1):
            semesters.append(SemestersService.decode_semester(encoded))

        return semesters

    @staticmethod
    def get_current_semester():
        """
        Returns the current semester based on the current date.
        """
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
        """
        Generates a list of semesters from the start year to the current semester.
        """
        semesters = []
        current_semester = SemestersService.get_current_semester()
        start_encoded = SemestersService.encode_semester("fall", start_year)
        end_encoded = SemestersService.encode_semester(
            current_semester["term"], current_semester["year"]
        )

        for encoded in range(start_encoded, end_encoded + 1):
            semesters.append(SemestersService.decode_semester(encoded))

        return semesters

    # @staticmethod
    # def generate_semesters_till_current_semester(current_semester):

    @staticmethod
    def generate_future_semesters(grad_year):
        """
        Generates a list of semesters from the current semester to the graduation year.
        """
        semesters = []
        current_semester = SemestersService.get_current_semester()
        start_encoded = SemestersService.encode_semester(
            current_semester["term"], current_semester["year"]
        )
        end_encoded = SemestersService.encode_semester("summer", grad_year)

        for encoded in range(start_encoded + 1, end_encoded + 1):
            semesters.append(SemestersService.decode_semester(encoded))

        return semesters

    @staticmethod
    def contains_semester(semesters_till_now, year, term):
        """
        Checks if a given semester (year and term) is present in the list of semesters.
        """
        return any(
            semester["year"] == year and semester["term"] == term
            for semester in semesters_till_now
        )
