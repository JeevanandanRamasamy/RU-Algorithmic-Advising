import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { showErrorToast, showSuccessToast, showWarningToast } from "../toast/Toast"; // adjust the path as needed
import SectionsTable from "./sectionsTable";
import NoPlaceholderDropdown from "../generic/NoPlaceholderDropdown";
import SemesterSelector from "./semesterSelector"; 
import { useAuth } from "../../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ToRequest = () => {
    const { user, token } = useAuth();
    const [droppedCourse, setDroppedCourse] = useState(null); // Store dropped course info
    const [sections, setSections] = useState([]); // Store sections related to the course
    const [isLoading, setIsLoading] = useState(false); // Track loading state
    const [selectedSections, setSelectedSections] = useState([]); // Track selected sections
    const [semester, setSemester] = useState({ year: "", season: "" });
    const [courseId, setCourseId] = useState(null); // Added courseId state for handling course fetching
    const [reason, setReason] = useState('');

    const handleSemesterSelection = (year, season) => {
        // Only update if the values change
        if (year !== semester.year || season !== semester.season) {
        setSemester({ year, season });
        }
    };

    // Handle course drop: When a course is dropped, fetch its details and sections.
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: "COURSE",
        drop: (item) => {
        setIsLoading(true); // Start loading
        setCourseId(item.id); // Set course_id state
        },
        collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        }),
    }));

    // Function to fetch course details
    const fetchCourseDetails = async (course_id) => {
        try {
        const response = await fetch(`${backendUrl}/api/courses/${course_id}`);
        if (!response.ok) {
            showErrorToast("Failed to fetch course details.");
            return;
        }
        const data = await response.json();
        if (data.course) {
            setDroppedCourse(data.course); // Update the state with the course data
        } else {
            showErrorToast("Course not found!");
        }
        } catch (error) {
        console.error("Error fetching course details:", error);
        showErrorToast("Failed to fetch course details.");
        } finally {
        setIsLoading(false); // End loading
        }
    };

    // Function to fetch sections based on course_id and semester
    const fetchSections = async () => {
        if (courseId && semester.year && semester.season) {
        try {
            const sectionResponse = await fetch(
            `${backendUrl}/api/sections?course_id=${courseId}&semester=${semester.season}&year=${semester.year}`
            );
            if (sectionResponse.ok) {
            const sectionData = await sectionResponse.json();
            if (sectionData.sections) {
                setSections(sectionData.sections); // Update the state with section data
            } else {
                showErrorToast("No sections exist for this course.");
            }
            } else {
            showErrorToast("Failed to fetch sections.");
            }
        } catch (error) {
            console.error("Error fetching sections:", error);
            showErrorToast("Failed to fetch sections.");
        }
        }
    };

    // Fetch course details when course_id changes (for drop action)
    useEffect(() => {
        if (courseId) {
        fetchCourseDetails(courseId);
        }
    }, [courseId]); // Only re-run when courseId changes

    // Fetch sections when course_id, semester.year, or semester.season changes
    useEffect(() => {
        fetchSections(); // Only run when courseId and semester are both available
    }, [courseId, semester.year, semester.season]); // Re-run when any of these dependencies change


    // Function to clear the dropped course and section info
    const clearDroppedCourse = () => {
        setDroppedCourse(null); // Reset dropped course
        setSections([]); // Clear sections data
        setSelectedSections([]); // Clear selected sections
        setReason("");
    };

    // Function to handle checkbox selection
    const handleCheckboxChange = (sectionObj) => {
    setSelectedSections((prevSelectedSections) => {
        const isSelected = prevSelectedSections.some(
            (section) =>
                section.section_number === sectionObj.section_number &&
                section.index === sectionObj.index
        );

        return isSelected
            ? prevSelectedSections.filter(
                  (section) =>
                      section.section_number !== sectionObj.section_number ||
                      section.index !== sectionObj.index
              )
            : [...prevSelectedSections, sectionObj];
    });
};


    const handleSubmit = async () => {
        if (selectedSections.length > 0) {
            try {
                const response = await fetch(`${backendUrl}/api/spn/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ 
                        username: user, 
                        course_id: courseId, 
                        semester: semester, 
                        sections: selectedSections,
                        reason: reason }),
                }); // semester has year & season, sections has section_number & index
                
                const data = await response.json();

                if (response.ok) {
                    // Handle success (e.g., show a success message)
                    setSelectedSections([]); // Clear selected sections
                    setReason("");
                    if (data.inserted != 0){
                        showSuccessToast(`${data.inserted} section(s) were added!`)
                    }
                    if (data.skipped != 0) {
                        showWarningToast(`${data.skipped} section(s) were skipped.`)
                    }
                } else {
                    // Handle error
                    console.error("Error adding course to the plan:", data.message);
                    showErrorToast('Failed to submit sections.');
                }
            } catch (error) {
                console.error('Error submitting sections:', error);
                showErrorToast('Error submitting sections.');
            }
        } else {
            showWarningToast('No sections selected.'); // This should not appear
        }
    }

    const isActive = isOver && canDrop;

    return (
        <div
        ref={drop}
        className={`border-2 rounded p-4 min-h-[200px] transition-all ${
            isActive ? "border-green-500 bg-green-100" : "border-gray-400 bg-white"
        }`}
        >
        <h3 className="text-lg font-bold">Drop Courses Here</h3>
        <SemesterSelector onSemesterSelect={handleSemesterSelection} />
        {isLoading && <p>Loading course details...</p>}
        {droppedCourse ? (
            <div className="mt-2">
            <p>Course Name: {droppedCourse.course_name}</p>
            <p>Course ID: {droppedCourse.course_id}</p>
            <p>Credits: {droppedCourse.credits}</p>
            </div>
        ) : (
            <p className="text-gray-500 italic">No courses dropped yet.</p>
        )}

        {/* Clear Button */}
        {droppedCourse && (
            <button
            className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 cursor-pointer"
            onClick={clearDroppedCourse}
            >
            Clear
            </button>
        )}

        {/* Scrollable Table for Sections */}
        {/* Pass sections and selectedSections to the SectionTable */}
        {sections.length > 0 ? (
            <SectionsTable
                sections={sections}  // Pass the entire sections array here
                selectedSections={selectedSections}
                onCheckboxChange={handleCheckboxChange}
            />
        ) : (
            <p className="text-gray-500 italic mt-4">No sections available for this course.</p>
        )}
            {/* Optionally: Display the selected sections */}
            {selectedSections.length > 0 && (
            <div className="mt-4">
                <h4 className="font-semibold">Selected Sections:</h4>
                <div className="flex flex-wrap gap-2">
                {selectedSections.map((section) => (
                    <span
                    key={`${section.section_number}-${section.index}`}
                    className="inline-block bg-blue-500 text-white py-1 px-3 rounded-full"
                    >
                    Section {section.section_number} ({section.index})
                    </span>
                ))}
                </div>
                <div className="mt-4 w-full max-w-md">
                <label htmlFor="reason" className="block font-medium mb-1">
                    Why are you making this request?:
                </label>
                <textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border rounded px-3 py-2 resize-none"
                    placeholder="Enter your reason here"
                    maxLength={255}
                    rows={4} // You can adjust this as needed
                />
                </div>
                {/* Submit Button */}
                <button
                onClick={handleSubmit}
                className={`mt-4 py-2 px-4 rounded cursor-pointer ${
                    reason.trim() ? 'bg-blue-500 text-white hover:bg-blue-700' : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                }`}
                disabled={!reason.trim()} // Disable the button if reason is empty
                >
                Submit Selected Sections
                </button>
            </div>
            )}
        </div>
    );
};

export default ToRequest;
