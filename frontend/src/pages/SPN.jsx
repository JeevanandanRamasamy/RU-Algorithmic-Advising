import {
  showSuccessToast,
  showWarningToast,
  showErrorToast,
  showInfoToast,
} from "../components/toast/Toast";
import { useState, useEffect, useCallback, useRef } from "react";
import useCourses from "../hooks/useCourses";
import "../css/DragDrop.css";
import Navbar from "../components/navbar/Navbar";
import AvailableCourses from "../components/courses/AvailableCourses";
import CourseListContainer from "../components/courses/CourseListContainer";
import ToRequest from "../components/SPNcomponents/toRequest";
import DraggableCourseList from "../components/draggableCourseList";
import Button from "../components/generic/Button";
import useCourseRecords from "../hooks/useCourseRecords";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";
import DataTable from "../components/generic/DataTable"; // Adjust the import path

function SPN() {
    const { user, role } = useAuth();
    const columns = [
        { header: "Student ID", accessor: "student_id" },
        { header: "Course ID", accessor: "course_id" },
        { header: "Section Number", accessor: "section_num" },
        { header: "Index", accessor: "index_num" },
        { header: "Semester", accessor: "term" },
        { header: "Year", accessor: "year" },
        { header: "Reason", accessor: "reason" },
        { header: "Status", accessor: "status" },
        { header: "Time Requested", accessor: "timestamp" },
        { header: "Admin ID", accessor: "admin_id" },
    ];
    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/spn/`;

    if (role === "student") {
        const { courses } = useCourses();
        const { courseRecords } = useCourseRecords();
        const [isOpen, setIsOpen] = useState(false);
        let url = apiUrl + `?student_id=${encodeURIComponent(user)}`;

        return (
            <>
                {/* <div className="fixed"> */}
                <DraggableCourseList
                    title="Available Courses"
                    courses={courses}
                    excludedCourseIds={
                        courseRecords?.length > 0
                            ? courseRecords.map(course => course?.course_info.course_id)
                            : []
                    }
                    CourseComponent={AvailableCourses}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
                <div className="app h-auto overflow-x-hidden">
                    <Navbar />
                    <header className="app-header">
                        <h1>My Requests</h1>
                    </header>
                    <main className="gap8 flex flex-col">
                        <DataTable apiUrl={url} columns={columns} />
                    </main>
                    <header className="app-header">
                        <h1>Request SPN</h1>
                    </header>
                    <div className="pb-2 flex justify-end">
                        <Button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 flex items-center justify-center rounded bg-blue-500 text-white  border border-black"
                            label={isOpen ? "Close Available Courses" : "Open Available Courses"}
                        />
                    </div>
                    <main className="gap-8 flex flex-col">
                        <ToRequest/>
                    </main>
                </div>
            </>
        );
    } else {
        let pendingUrl = apiUrl + `?pending_param=true`;
        let notPendingUrl = apiUrl + `?pending_param=false`;
        let updateUrl = apiUrl + '/update';
        return (
            <div className="app h-auto overflow-x-hidden">
                    <Navbar />
                    <header className="app-header">
                        <h1>Outstanding Requests</h1>
                    </header>
                    <main className="gap-8 flex flex-col">
                        <DataTable apiUrl={pendingUrl} updateApiUrl={updateUrl} columns={columns} />
                    </main>
                    <header className="app-header">
                        <h1>Closed Requests</h1>
                    </header>
                    <main className="gap-8 flex flex-col">
                        <DataTable apiUrl={notPendingUrl} updateApiUrl={updateUrl} columns={columns} />
                    </main>
                </div>
        );
    }
}

export default SPN;
