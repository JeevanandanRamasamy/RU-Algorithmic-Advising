import {
	showSuccessToast,
	showWarningToast,
	showErrorToast,
	showInfoToast
} from "../components/toast/Toast";
import { useState, useEffect, useCallback, useRef } from "react";
import { useCourses } from "../context/CoursesContext";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import NotificationsButton from "../components/widgets/notifications";
import AvailableCourses from "../components/courses/AvailableCourses";
import CourseListContainer from "../components/courses/CourseListContainer";
import ToRequest from "../components/SPNcomponents/toRequest";
import DraggableCourseList from "../components/courses/draggableCourseList";
import Button from "../components/generic/Button";
import { useCourseRecords } from "../context/CourseRecordsContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/generic/DataTable"; // Adjust the import path
import { useCourseRequirements } from "../context/CourseRequirementContext";
import HorizontalAvailableCourses from "../components/courses/HorizontalAvailableCourses";

function SPN() {
	const { user, role } = useAuth();
	const columns = [
		{ header: "Status", accessor: "status" },
		{ header: "Student ID", accessor: "student_id" },
		{ header: "Course ID", accessor: "course_id" },
		{ header: "Section Number", accessor: "section_num" },
		{ header: "Index", accessor: "index_num" },
		{ header: "Term", accessor: "term" },
		{ header: "Year", accessor: "year" },
		{ header: "Reason", accessor: "reason" },
		{ header: "Time Requested", accessor: "timestamp" },
		{ header: "Admin ID", accessor: "admin_id" }
	];
	const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/spn`;

	if (role === "student") {
		const { courses } = useCourses();
		const { courseRecords } = useCourseRecords();
		const [isOpen, setIsOpen] = useState(false);
		let url = apiUrl + `?student_id=${encodeURIComponent(user)}`;
		let deleteUrl = apiUrl + `/drop`;
		const [reloadFlag, setReloadFlag] = useState(false);
		const triggerReload = () => {
			setReloadFlag(prev => !prev); // toggles the flag to trigger useEffect in child
		};

		const { requirementStrings } = useCourseRequirements();
		return (
			<>
				{/* <div className="fixed"> */}
				<DraggableCourseList
					title="Available Courses"
					courses={courses}
					excludedCourseIds={[
						...(courseRecords?.length > 0
							? courseRecords.map(course => course?.course_info.course_id)
							: [])
					]}
					CourseComponent={HorizontalAvailableCourses}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					requirementStrings={requirementStrings}
				/>
				<div className="app h-auto overflow-x-hidden">
					<Navbar />
					<NotificationsButton />
					<header className="app-header">
						<h1>My Requests</h1>
					</header>
					<main className="gap-8 flex flex-col z-5">
						<DataTable
							apiUrl={url}
							deleteApiUrl={deleteUrl}
							columns={columns}
							allowDelete={true}
							deleteRoles={"student"}
							reloadFlag={reloadFlag} // new prop
						/>
					</main>
					<header className="app-header">
						<h1>Request SPN</h1>
					</header>
					<div className="pb-2 flex justify-end">
						<Button
							onClick={() => setIsOpen(!isOpen)}
							className="p-2 flex items-center justify-center rounded bg-blue-500 hover:bg-blue-600 text-white border border-black"
							label={isOpen ? "Close Available Courses" : "Open Available Courses"}
						/>
					</div>
					<main className="gap-8 flex flex-col">
					< ToRequest triggerReload={triggerReload} />
					</main>
				</div>
			</>
		);
	} else if (role === "admin"){ {/* Needed because will try to run this after logout without the check */}
		const [reloadAllTables, setReloadAllTables] = useState(false);

		const triggerReload = () => {
			setReloadAllTables(prev => !prev);
		};

		let pendingUrl = apiUrl + `?pending_param=true`;
		let notPendingUrl = apiUrl + `?pending_param=false`;
		let updateUrl = apiUrl + "/update";
		return (
			<div className="app h-auto overflow-x-hidden">
				<Navbar />
				<NotificationsButton />
				<header className="app-header">
					<h1>Outstanding Requests</h1>
				</header>
				<main className="gap-8 flex flex-col">
					<DataTable
						apiUrl={pendingUrl}
						updateApiUrl={updateUrl}
						columns={columns}
						reloadFlag={reloadAllTables}
						onDataUpdate={triggerReload}
					/>
				</main>
				<header className="app-header">
					<h1>Closed Requests</h1>
				</header>
				<main className="gap-8 flex flex-col">
					<DataTable
						apiUrl={notPendingUrl}
						updateApiUrl={updateUrl}
						columns={columns}
						reloadFlag={reloadAllTables}
						onDataUpdate={triggerReload}
					/>
				</main>
			</div>
		);
	}
}

export default SPN;
