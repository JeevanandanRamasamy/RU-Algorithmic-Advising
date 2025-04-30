import React, { createContext, useContext, useState, useEffect } from "react";
import isEqual from "lodash/isEqual";
import { showInfoToast, showErrorToast, clearToast } from "../components/toast/Toast";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";

const SectionsContext = createContext();

export const useSections = () => useContext(SectionsContext);

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const campusToColorMap = {
	"LIVINGSTON": "#ffcc99",
	"BUSCH": "#cceeff",
	"DOUGLAS/COOK": "#ddffdd",
	"COLLEGE AVENUE": "#ffffcc",
	"DOWNTOWN": "#ffd7ef",
	"ONLINE": "#ff8080"
};

export const SectionsProvider = ({ children }) => {
	const { token } = useAuth();
	const [searchedCourses, setSearchedCourses] = useState({});
	const [selectedCourses, setSelectedCourses] = useState({});
	const [checkedSections, setCheckedSections] = useState({});
	// const [indexToMeetingTimesMap, setIndexToMeetingTimesMap] = useState({});
	const [validSchedules, setValidSchedules] = useState([]);
	const [scheduleIndex, setScheduleIndex] = useState(0);
	const [schedulesMap, setSchedulesMap] = useState({});
	const [asyncCourses, setAsyncCourses] = useState({});
	const [scheduleName, setScheduleName] = useState("");
	const [savedSchedulesMap, setSavedSchedulesMap] = useState({});
	const [selectedScheduleName, setSelectedScheduleName] = useState("");
	const [savedAsyncCourses, setSavedAsyncCourses] = useState({});
	const indexToMeetingTimesMapRef = useRef({});
	const [savedScheduleNames, setSavedScheduleNames] = useState({});
	const indexToCourseMapRef = useRef({});

	const validSemesters = [
		{ term: "summer", year: 2025 },
		{ term: "fall", year: 2025 }
	];

	const getSemesterNumber = (term, year) => {
		if (term === "spring") return "1" + year;
		if (term === "fall") return "9" + year;
		if (term === "winter") return "0" + year;
		if (term === "summer") return "7" + year;
	};

	const fetchSectionsByCourse = async (courseId, term, year) => {
		const sectionResponse = await fetch(
			`${backendUrl}/api/sections?course_id=${courseId}&term=${term}&year=${year}`
		);
		const sectionData = await sectionResponse.json();
		return sectionData.sections;
	};

	const getSectionsDataByCourses = async (courseIds, term, year) => {
		const allSections = {};
		const indexToMeetingMap = {};
		const indexToCourseMap = {};

		await Promise.all(
			courseIds.map(async courseId => {
				const sectionResponse = await fetch(
					`${backendUrl}/api/sections/expanded?course_id=${courseId}&term=${term}&year=${year}`
				);
				const sectionData = await sectionResponse.json();
				const courseSections = sectionData?.sections?.sections || [];

				Object.values(courseSections).forEach(section => {
					const sectionIndex = section.index;
					const meetingTimes = section.meeting_times || [];
					indexToCourseMap[sectionIndex] = {
						course_name: sectionData?.sections?.course_name || "",
						section_number:
							sectionData?.sections?.sections[sectionIndex].section_number,
						course_id: sectionData?.sections?.course_id || "",
						index: sectionIndex,
						meeting_times: section.meeting_times,
						exam_code: section.exam_code,
						open_status: section.open_status,
						instructors: section.instructors,
						course_link: sectionData?.sections?.course_link
					};
					indexToMeetingMap[sectionIndex] = meetingTimes;
				});
				allSections[courseId] = sectionData.sections;
			})
		);

		return { allSections, indexToMeetingMap, indexToCourseMap };
	};

	const updateSelectedCourseSections = async (courseIds, term, year) => {
		const { allSections, indexToMeetingMap, indexToCourseMap } = await getSectionsDataByCourses(
			courseIds,
			term,
			year
		);

		setSelectedCourses(prev => {
			return isEqual(prev, allSections) ? prev : allSections;
		});

		const updatedCourseMap = { ...indexToCourseMapRef.current };
		Object.entries(indexToCourseMap).forEach(([key, value]) => {
			if (!updatedCourseMap[key]) {
				updatedCourseMap[key] = value;
			}
		});
		indexToCourseMapRef.current = updatedCourseMap;

		const updatedMap = { ...indexToMeetingTimesMapRef.current };
		Object.entries(indexToMeetingMap).forEach(([key, value]) => {
			if (!updatedMap[key]) {
				updatedMap[key] = value;
			}
		});
		indexToMeetingTimesMapRef.current = updatedMap;
	};

	const courseAvailableThisSemester = async (courseId, term, year) => {
		if (!validSemesters.some(sem => sem.term === term && sem.year === year)) {
			return true;
		}

		showInfoToast(`Processing ${courseId}`, `checking-${courseId}-${term}-${year}`);
		const sectionResponse = await fetch(
			`${backendUrl}/api/sections?course_id=${courseId}&term=${term}&year=${year}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			}
		);

		if (!sectionResponse.ok) {
			console.error("Error fetching sections:", sectionResponse.status);
			return false;
		}

		const sectionData = await sectionResponse.json();
		if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
			return false;
		}

		return true;
	};

	const fetchSectionsBySubject = async (subject, term, year) => {
		if (subject === "") {
			setSearchedCourses({});
			return;
		}
		try {
			const sectionResponse = await fetch(
				`${backendUrl}/api/sections/subject?subject=${subject}&term=${term}&year=${year}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				}
			);
			const sectionData = await sectionResponse.json();
			setSearchedCourses(sectionData.sections || {});
			if (sectionData.error === "No courses exist") {
				showErrorToast(`No courses found`, "courses-not-found");
			}
		} catch (error) {
			console.error("Error fetching sections:", error);
			showErrorToast("Failed to fetch sections.");
		}
	};

	const generateValidSchedules = async () => {
		try {
			const serializableCheckedSections = Object.fromEntries(
				Object.entries(checkedSections).map(([courseId, sectionSet]) => [
					courseId,
					Array.from(sectionSet)
				])
			);
			const sectionResponse = await fetch(`${backendUrl}/api/sections/generate_schedules`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({
					checkedSections: serializableCheckedSections,
					indexToMeetingTimesMap: indexToMeetingTimesMapRef.current
				})
			});
			const data = await sectionResponse.json();
			setValidSchedules(prev =>
				isEqual(prev, data.valid_schedules) ? prev : data.valid_schedules
			);
		} catch (error) {
			console.error("Error fetching sections:", error);
			showErrorToast("Failed to fetch sections.");
		}
	};

	const dayToIndex = {
		M: 0,
		T: 1,
		W: 2,
		TH: 3,
		F: 4
	};

	const getStartOfWeek = date => {
		const start = new Date(date);
		const day = start.getDay();
		const diff = day === 0 ? -6 : 1 - day;
		start.setDate(start.getDate() + diff);
		start.setHours(0, 0, 0, 0);
		return start;
	};

	const parseTime = (timeStr, pmCode) => {
		let hour = parseInt(timeStr.slice(0, 2), 10);
		const minute = parseInt(timeStr.slice(3, 5), 10);
		if (pmCode === "P" && hour < 12) {
			hour += 12;
		}
		return { hour, minute };
	};

	const generateEventsForSchedule = () => {
		if (validSchedules?.length === 0) {
			if (selectedCourses && Object.keys(selectedCourses).length !== 0) {
				showErrorToast("No valid schedules", "no-valid-schedules");
			}
			setSchedulesMap({});
			return;
		}

		const newScheduleMap = {};
		const asyncMap = {};

		for (let i = 0; i < validSchedules.length; i++) {
			const events = [];
			const async = [];

			for (let j = 0; j < validSchedules[i].length; j++) {
				const index = validSchedules[i][j];
				populateEvents(index, events, async);
			}

			newScheduleMap[i] = events;
			asyncMap[i] = async;
		}
		setAsyncCourses(asyncMap);
		setSchedulesMap(newScheduleMap);
	};

	const populateEvents = (index, events, async) => {
		const meetings = indexToMeetingTimesMapRef.current[index];
		for (let k = 0; k < meetings.length; k++) {
			const {
				formatted_time,
				start_time,
				end_time,
				day,
				course_id,
				course_name,
				open_status,
				section_number,
				campus
			} = meetings[k];

			if (formatted_time === "Asynchronous Content") {
				async.push({
					course_name: course_name,
					course_id: course_id,
					section_number: section_number,
					index: index,
					open_status: open_status
				});
				continue;
			}
			const weekStart = getStartOfWeek(new Date());
			const dayOffset = dayToIndex[day];

			const startDate = new Date(weekStart);
			const endDate = new Date(weekStart);
			startDate.setDate(startDate.getDate() + dayOffset);
			endDate.setDate(endDate.getDate() + dayOffset);
			const startTimeArray = start_time.split(":");
			const endTimeArray = end_time.split(":");

			startDate.setHours(parseInt(startTimeArray[0]), parseInt(startTimeArray[1]), 0, 0);
			endDate.setHours(parseInt(endTimeArray[0]), parseInt(endTimeArray[1]), 0, 0);

			events.push({
				title: `${course_id} - ${course_name.trim()}`,
				tooltip: `\nCourse ID: ${course_id} \nCourse Name: ${course_name.trim()} \nSection: ${section_number} \nIndex: ${index}\nStatus: ${open_status}`,
				course_id: course_id,
				index: index,
				start: startDate,
				end: endDate,
				open_status: open_status,
				background_color: campusToColorMap[campus]
			});
		}
	};

	const saveSchedule = async (term, year) => {
		if (
			(!schedulesMap && !asyncCourses) ||
			(schedulesMap &&
				Object.keys(schedulesMap[scheduleIndex]).length === 0 &&
				asyncCourses &&
				Object.keys(asyncCourses[scheduleIndex]).length === 0)
		) {
			showErrorToast("Must include at least one course before registering");
			return;
		}
		if (scheduleName === "" || scheduleName.length == 0) {
			showErrorToast("Schedule name can not be empty", "empty-schedule-name");
			return;
		}
		if (
			`${term}-${year}` in savedScheduleNames &&
			savedScheduleNames[`${term}-${year}`]?.includes(scheduleName)
		) {
			showErrorToast("Schedule name has already been taken", "taken-schedule-name");
			return;
		}

		if (
			savedSchedulesMap &&
			savedSchedulesMap[`${term}-${year}`] &&
			Object.keys(savedSchedulesMap[`${term}-${year}`]).length >= 10
		) {
			showErrorToast("Can only save up to 10 schedules", "save-schedule-limit");
			return;
		}

		showInfoToast("Saving schedule", "save-schedule");
		const allSections = [
			...(schedulesMap[scheduleIndex] || []),
			...(asyncCourses[scheduleIndex] || [])
		];

		const uniqueSections = Array.from(
			new Map(
				allSections.map(section => [
					`${section.index}-${section.course_id}`,
					{ index_num: section.index, course_id: section.course_id }
				])
			).values()
		);

		const sectionResponse = await fetch(`${backendUrl}/api/sections/schedule`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},

			body: JSON.stringify({
				scheduleName: scheduleName,
				term: term,
				year: year,
				sections: uniqueSections
			})
		});
		if (sectionResponse.ok) {
			setScheduleName("");
			setSavedScheduleNames(prev => {
				const updated = { ...prev };
				const key = `${term}-${year}`;
				if (!updated[key]) {
					updated[key] = [];
				}
				if (!updated[key].includes(scheduleName)) {
					updated[key].push(scheduleName);
				}

				return updated;
			});
			setSavedSchedulesMap(prev => {
				const updated = { ...prev };
				const key = `${term}-${year}`;
				const newScheduleSections = schedulesMap[scheduleIndex] || [];
				if (!updated[key]) {
					updated[key] = [];
				}
				updated[key][scheduleName] = newScheduleSections;
				return updated;
			});

			setSavedAsyncCourses(prev => {
				const updated = { ...prev };
				const key = `${term}-${year}`;
				const newAsyncSections = asyncCourses[scheduleIndex] || [];
				if (!updated[key]) {
					updated[key] = [];
				}
				updated[key][scheduleName] = newAsyncSections;
				return updated;
			});
		} else {
			showErrorToast("Error saving schedule", "save-schedule-error");
		}
		clearToast("save-schedule");
	};

	const fetchSavedSchedules = async () => {
		const sectionResponse = await fetch(`${backendUrl}/api/sections/schedules`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			}
		});
		const data = await sectionResponse.json();

		const savedScheduleMap = {};
		const savedAsyncMap = {};
		const savedScheduleNamesMap = {};

		for (const [semester, schedulesArray] of Object.entries(data.schedules)) {
			const [term, year] = semester.split("-");
			const courseIds = schedulesArray.flatMap(schedule =>
				schedule.sections.map(section => section.course_id)
			);

			const newCourseIds = courseIds.filter(
				courseId =>
					!indexToCourseMapRef.current[courseId] &&
					!indexToMeetingTimesMapRef.current[courseId]
			);

			if (newCourseIds.length > 0) {
				const { indexToMeetingMap, indexToCourseMap } = await getSectionsDataByCourses(
					newCourseIds,
					term,
					year
				);

				indexToCourseMapRef.current = {
					...indexToCourseMapRef.current,
					...indexToCourseMap
				};

				indexToMeetingTimesMapRef.current = {
					...indexToMeetingTimesMapRef.current,
					...indexToMeetingMap
				};
			}

			const newSavedSchedule = {};
			const savedAsync = {};
			const newScheduleNames = [];

			for (const schedule of schedulesArray) {
				let scheduleName = schedule.schedule_name;
				const events = [];
				const async = [];

				for (const section of schedule.sections) {
					populateEvents(section.index_num, events, async);
				}

				newScheduleNames.push(scheduleName);
				newSavedSchedule[scheduleName] = events;
				savedAsync[scheduleName] = async;
			}

			savedScheduleMap[semester] = newSavedSchedule;
			savedAsyncMap[semester] = savedAsync;
			savedScheduleNamesMap[semester] = newScheduleNames;
		}

		setSavedScheduleNames(savedScheduleNamesMap);
		setSavedAsyncCourses(savedAsyncMap);
		setSavedSchedulesMap(savedScheduleMap);
	};

	const deleteSchedule = async (term, year, scheduleName) => {
		showInfoToast("Deleting schedule", "delete-schedule");

		const semester = `${term}-${year}`;
		setSavedScheduleNames(prev => {
			const oldList = prev[semester] || [];
			const newList = oldList.filter(name => name !== scheduleName);
			if (selectedScheduleName === scheduleName) {
				setSelectedScheduleName(newList[0] || "");
			}

			return {
				...prev,
				[semester]: newList
			};
		});
		const sectionResponse = await fetch(`${backendUrl}/api/sections/schedule`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},

			body: JSON.stringify({
				scheduleName: scheduleName,
				term: term,
				year: year
			})
		});

		setSavedScheduleNames(prev => {
			const oldList = prev[semester] || [];
			const newList = oldList.filter(name => name !== scheduleName);
			if (selectedScheduleName === scheduleName) {
				setSelectedScheduleName(newList[0] || "");
			}
			return {
				...prev,
				[semester]: newList
			};
		});

		setSavedSchedulesMap(prev => {
			const updated = { ...prev };
			if (updated[semester] && updated[semester][scheduleName]) {
				delete updated[semester][scheduleName];
			}
			return updated;
		});

		setSavedAsyncCourses(prev => {
			const updated = { ...prev };
			if (updated[semester] && updated[semester][scheduleName]) {
				delete updated[semester][scheduleName];
			}
			return updated;
		});
		clearToast("delete-schedule");
	};

	const value = {
		getSemesterNumber,
		fetchSectionsByCourse,
		updateSelectedCourseSections,
		courseAvailableThisSemester,
		fetchSectionsBySubject,
		searchedCourses,
		setSearchedCourses,
		selectedCourses,
		setSelectedCourses,
		checkedSections,
		setCheckedSections,
		generateValidSchedules,
		validSchedules,
		setValidSchedules,
		scheduleIndex,
		setScheduleIndex,
		generateEventsForSchedule,
		schedulesMap,
		setSchedulesMap,
		asyncCourses,
		saveSchedule,
		scheduleName,
		setScheduleName,
		savedSchedulesMap,
		setSavedSchedulesMap,
		selectedScheduleName,
		setSelectedScheduleName,
		savedAsyncCourses,
		setSavedAsyncCourses,
		fetchSavedSchedules,
		savedScheduleNames,
		setSavedScheduleNames,
		deleteSchedule,
		indexToCourseMapRef
	};

	return <SectionsContext.Provider value={value}>{children}</SectionsContext.Provider>;
};
