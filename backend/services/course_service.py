import requests

class RutgersCourseAPI:
    BASE_URL = "https://sis.rutgers.edu/oldsoc/courses.json"

    def __init__(self, subject, semester, campus, level):
        self.subject = subject
        self.semester = semester
        self.campus = campus
        self.level = level

    def fetch_courses(self):
        """
        Fetch courses from the Rutgers SOC API.
        """
        params = {
            'subject': self.subject,
            'semester': self.semester,
            'campus': self.campus,
            'level': self.level
        }
        try:
            response = requests.get(self.BASE_URL, params=params)
            response.raise_for_status()  # Raises HTTPError for bad responses
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            return []

    def parse_course(self, course):
        """
        Parse a single course dictionary into a structured format.
        """
        return {
            'course_number': course.get('courseNumber'),
            'title': course.get('title'),
            'credits': course.get('credits'),
            'description': course.get('courseDescription'),
            'prerequisites': course.get('preReqNotes'),
            'sections': [
                {
                    'section_number': section.get('number'),
                    'instructors': [instructor.get('name') for instructor in section.get('instructors', [])],
                    'meeting_times': [
                        {
                            'day': meeting.get('meetingDay'),
                            'start_time': meeting.get('startTime'),
                            'end_time': meeting.get('endTime'),
                            'campus': meeting.get('campusName'),
                            'building': meeting.get('buildingCode'),
                            'room': meeting.get('roomNumber')
                        }
                        for meeting in section.get('meetingTimes', [])
                    ],
                    'open_status': section.get('openStatus')
                }
                for section in course.get('sections', [])
            ]
        }

    def get_courses(self):
        """
        Retrieve and parse courses from the API.
        """
        raw_courses = self.fetch_courses()
        return [self.parse_course(course) for course in raw_courses]

# Example usage for testing
if __name__ == "__main__":
    api = RutgersCourseAPI(subject='198', semester='12025', campus='NB', level='UG')
    courses = api.get_courses()
    for course in courses[:5]:  # Print only the first 5 courses for readability
        print(course)
