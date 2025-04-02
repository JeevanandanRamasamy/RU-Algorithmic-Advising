from datetime import datetime


def generate_semesters(enrolled_year, grad_year):
    semesters = [{"term": "fall", "year": enrolled_year}]
    for year in range(enrolled_year + 1, grad_year):
        semesters.append({"term": "spring", "year": year})
        semesters.append({"term": "fall", "year": year})
    semesters.append({"term": "spring", "year": grad_year})
    return semesters


def get_current_semester():
    month = datetime.now().month
    year = datetime.now().year
    term = "fall" if month >= 9 else "spring"
    return {"term": term, "year": year}


def generate_semesters_till_now(start_year):
    semesters = []
    current_semester = get_current_semester()
    year = start_year
    term = "fall"

    while year <= current_semester["year"]:
        semesters.append({"term": term, "year": year})
        if year == current_semester["year"] and term == current_semester["term"]:
            break
        if term == "fall":
            term = "spring"
            year += 1
        else:
            term = "fall"

    return semesters


def main():
    print(generate_semesters(2022, 2024))
    print(get_current_semester())
    print(generate_semesters)


if __name__ == "__main__":
    main()
