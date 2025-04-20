from datetime import datetime


class TimeService:
    @staticmethod
    def formatTime(starting_time, ending_time, pm_code):
        if not starting_time:
            return "online"

        def convert_to_12hr(time_str, period):
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
            end_period = "PM" if start_period == "AM" else "AM"
        else:
            end_period = start_period

        start_formatted = convert_to_12hr(starting_time, start_period)
        end_formatted = convert_to_12hr(ending_time, end_period)

        return f"{start_formatted} - {end_formatted}"

    @staticmethod
    def to_minutes(t):
        dt = datetime.strptime(t.strip().lower(), "%I:%M%p")
        return dt.hour * 60 + dt.minute

    @staticmethod
    def parse_time_range(time_range):
        start_str, end_str = time_range.split(" - ")
        return TimeService.to_minutes(start_str), TimeService.to_minutes(end_str)
