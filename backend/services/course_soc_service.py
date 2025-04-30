import requests
from services.time_service import TimeService
from services.course_service import CourseService


class RutgersCourseAPI:
    """
    A class to interact with the Rutgers University Schedule of Classes (SOC) API.
    This class fetches course data based on subject, semester, campus, and level.
    """

    BASE_URL = "https://sis.rutgers.edu/oldsoc/courses.json"

    def __init__(self, subject, semester, campus, level):
        """
        Initialize the RutgersCourseAPI with the required parameters.
        :param subject: The subject code for the courses (e.g., "198").
        :param semester: The semester code (e.g., "12025" for Fall 2023).
        :param campus: The campus code (e.g., "NB" for New Brunswick).
        :param level: The level of the courses (e.g., "UG" for undergraduate).
        """
        self.subject = subject
        self.semester = semester
        self.campus = campus
        self.level = level

    def fetch_courses(self):
        """
        Fetch courses from the Rutgers SOC API.
        """
        params = {
            "subject": self.subject,
            "semester": self.semester,
            "campus": self.campus,
            "level": self.level,
        }
        try:
            response = requests.get(self.BASE_URL, params=params)
            response.raise_for_status()  # Raises HTTPError for bad responses
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching data: {e}")
            return []

    def parse_course(self, course, res_dict):
        """
        Parse a single course dictionary into a structured format.
        """

        school = CourseService.get_course_prefix_from_subject(
            f'{course.get("subject")}'
        )
        if not school: # Skip if school is not found
            print(course)
        course_id = (
            school + ":" + course.get("subject") + ":" + course.get("courseNumber")
        )
        c = CourseService.get_course_by_id(course_id)
        link = c.course_link if c else None

        sections = {}
        for section in course.get("sections", []): # Iterate through sections
            index = section.get("index")
            if index is None:
                continue # Skip if index is None
            if section.get("printed") != "Y":
                continue # Skip if printed is not "Y"

            meeting_times = []

            for meeting in section.get("meetingTimes", []): # Iterate through meeting times
                formattedTime = TimeService.formatTime(
                    meeting.get("startTime"),
                    meeting.get("endTime"),
                    meeting.get("pmCode"),
                ) # Format time using TimeService
                startTime = None
                endTime = None

                if formattedTime != "Asynchronous Content": # Format time if not asynchronous
                    start_time_str, end_time_str = formattedTime.split(" - ")
                    startTime = TimeService.format_24_hour(start_time_str)
                    endTime = TimeService.format_24_hour(end_time_str)

                meeting_data = {
                    "day": meeting.get("meetingDay"),
                    "start_time": startTime,
                    "end_time": endTime,
                    "pm_code": meeting.get("pmCode"),
                    "formatted_time": formattedTime,
                    "meeting_mode_desc": meeting.get("meetingModeDesc"),
                    "campus": (
                        "ONLINE"
                        if meeting.get("campusName") == "** INVALID **"
                        or meeting.get("campusName") == None
                        else meeting.get("campusName")
                    ),
                    "building": meeting.get("buildingCode"),
                    "room": meeting.get("roomNumber"),
                    "course_id": course_id,
                    "section_number": section.get("number"),
                    "open_status": section.get("openStatus"),
                    "course_name": course.get("expandedTitle")
                    or course.get("title")
                    or "",
                } # Create meeting data dictionary
                meeting_times.append(meeting_data) # Append to meeting_times list

                sections[index] = {
                    "section_number": section.get("number"),
                    "instructors": [
                        instructor.get("name")
                        for instructor in section.get("instructors", [])
                    ],
                    "meeting_times": meeting_times,
                    "index": index,
                    "section_eligibility": section.get("sectionEligibility"),
                    "exam_code": section.get("examCode"),
                    "section_notes": section.get("sectionNotes"),
                    "open_status": section.get("openStatus"),
                } # Create sections dictionary

        if not sections:
            return  # Don't add this course if it has no valid sections

        if course_id in res_dict:
            res_dict[course_id]["sections"].update(sections)
        else:
            res_dict[course_id] = {
                "course_link": link,
                "course_id": course_id,
                "course_name": course.get("expandedTitle") or course.get("title") or "",
                "credits": f"{float(course.get('credits') or 0):.1f}",
                "description": course.get("courseDescription"),
                "course_link": link,
                "sections": sections,
                "subject_notes": course.get("subjectNotes"),
            }

    def get_courses(self):
        """
        Retrieve and parse courses from the API.
        """
        res_dict = {}
        raw_courses = self.fetch_courses()
        for course in raw_courses:
            self.parse_course(course, res_dict)
        return res_dict

        # return [self.parse_course(course, subject, res_dict) for course in raw_courses]


# Example usage for testing
if __name__ == "__main__":
    api = RutgersCourseAPI(subject="198", semester="12025", campus="NB", level="UG")
    courses = api.get_courses()
    for course in courses[:5]:  # Print only the first 5 courses for readability
        print(course)
