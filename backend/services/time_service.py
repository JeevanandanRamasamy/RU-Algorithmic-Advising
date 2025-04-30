from datetime import datetime


class TimeService:
    """
    A service class for handling time-related operations.
    """

    @staticmethod
    def formatTime(starting_time, ending_time, pm_code):
        """
        Format time from 24-hour to 12-hour format.
        :param starting_time: Starting time in 24-hour format (HHMM)
        :param ending_time: Ending time in 24-hour format (HHMM)
        :param pm_code: 'A' for AM, 'P' for PM
        :return: Formatted time string in 12-hour format
        """
        if not starting_time:
            return "Asynchronous Content"

        def convert_to_12hr(time_str, period):
            """
            Convert 24-hour time string to 12-hour format with AM/PM.
            :param time_str: Time string in 24-hour format (HHMM)
            :param period: 'AM' or 'PM'
            :return: Formatted time string in 12-hour format
            """
            hour = int(time_str[:2])
            minute = time_str[2:]
            suffix = period

            if hour == 0:
                hour = 12
            elif hour > 12:
                hour -= 12

            return f"{hour}:{minute}{suffix}"

        start_hour = int(starting_time[:2])
        end_hour = int(ending_time[:2])
        start_period = "AM" if pm_code == "A" else "PM"
        if end_hour < start_hour or (
            end_hour == start_hour and ending_time[2:] < starting_time[2:]
        ):
            end_period = "PM" if start_period == "AM" else "AM" # Handle overnight case
        else:
            end_period = start_period # Keep the same period

        start_formatted = convert_to_12hr(starting_time, start_period)
        end_formatted = convert_to_12hr(ending_time, end_period)

        return f"{start_formatted} - {end_formatted}"

    @staticmethod
    def to_minutes(t):
        """
        Convert a time string in 12-hour format to minutes since midnight.
        :param t: Time string in 12-hour format (e.g., "2:30PM")
        :return: Total minutes since midnight
        """
        dt = datetime.strptime(t.strip().lower(), "%I:%M%p")
        return dt.hour * 60 + dt.minute

    @staticmethod
    def parse_time_range(time_range):
        """
        Parse a time range string in the format "HH:MMAM - HH:MMPM" into start and end times in minutes.
        :param time_range: Time range string (e.g., "2:30PM - 3:30PM")
        :return: Tuple of start and end times in minutes since midnight
        """
        start_str, end_str = time_range.split(" - ")
        return TimeService.to_minutes(start_str), TimeService.to_minutes(end_str)

    @staticmethod
    def format_24_hour(time_str):
        """
        Convert a 12-hour time string to 24-hour format.
        :param time_str: Time string in 12-hour format (e.g., "2:30PM")
        :return: Time string in 24-hour format (e.g., "14:30")
        """
        time_format = "%I:%M%p"
        try:
            time_obj = datetime.strptime(time_str, time_format)
            return time_obj.strftime("%H:%M")
        except ValueError:
            return None
