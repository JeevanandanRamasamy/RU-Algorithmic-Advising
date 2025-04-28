import React, { useMemo, useState, useEffect } from "react";

import useFilterCourses from "../../hooks/useFilterCourses";

import DropdownItem from "../generic/DropdownItem";
import ListItem from "../generic/ListItem";

import { schools, subjects } from "../../data/sas";
import { useCourseRecords } from "../../context/CourseRecordsContext";
import { useCourseRequirements } from "../../context/CourseRequirementContext";
import DropdownTable from "../generic/DropdownTable";
import { useTakenCourses } from "../../context/TakenCoursesContext";
import { showInfoToast, clearToast } from "../toast/Toast";

import { useAuth } from "../../context/AuthContext";

const SelectCourses = ({
  courseRecords,
  handleOnAddCourse,
  fetchSectionsBySubject,
  term,
  year,
  searchedCourses,
  setSearchedCourses,
}) => {
  const { handleRemoveCourseRecord } = useCourseRecords();
  const [subjectSearchQuery, setSubjectSearchQuery] = useState("");
  const { takenCourses } = useTakenCourses();

  //Add suggested courses
  const [suggestedCourses, setSuggestedCourses] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const { user } = useAuth();

  const addedCourseIds = useMemo(() => {
    const courseRecordIds =
      courseRecords?.map((course) => course.course_id) || [];
    const takenCourseIds =
      takenCourses?.map((course) => course.course_id) || [];
    return [...new Set([...courseRecordIds, ...takenCourseIds])];
  }, [courseRecords, takenCourses]);

  //Fetch suggested courses
  useEffect(() => {
    const fetchSuggestedCourses = async () => {
      setLoadingSuggestions(true);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const username = user;

        const response = await fetch(
          `${backendUrl}/api/suggested-courses?username=${username}`
        );
        const data = await response.json();

        if (data.courses) {
          setSuggestedCourses(data.courses);
        }
      } catch (error) {
        console.error("Error fetching suggested courses:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestedCourses();
  }, [term, year]);

  useEffect(() => {
    setSubjectSearchQuery("");
    setSearchedCourses({});
  }, [term, year]);

  useEffect(() => {
    showInfoToast("Loading", "search");
    const match = subjectSearchQuery?.match(/\((\d+)\)/);
    const subjectCode = match ? match[1] : "";
    if (subjectSearchQuery && subjectCode) {
      fetchSectionsBySubject(subjectCode, term, year);
    } else {
      setSearchedCourses({});
    }
    clearToast("search");
  }, [subjectSearchQuery]);

  return (
    <>
      <div className="flex flex-wrap gap-4 pb-2 justify-end">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-dashed border-black rounded-sm bg-white" />
          <span className="text-sm text-black">Open Section</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-dashed border-[#cc0033] rounded-sm bg-white" />
          <span className="text-sm text-[#cc0033]">Closed Section</span>
        </div>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-[35%] h-[650px] p-2 border border-gray-200 rounded-md bg-white flex flex-col gap-2">
          <DropdownItem
            placeholder="Search by subject code"
            selectedValue={subjectSearchQuery}
            onChange={(e) => setSubjectSearchQuery(e.target.value)}
            options={subjects}
          />

          <div className="p-2 border border-gray-200 rounded-md bg-white flex flex-col flex-1">
            <h2 className="m-0 text-center">
              Selected Courses
              {
                <>
                  {" "}
                  (
                  {courseRecords.reduce(
                    (sum, course) => sum + parseInt(course?.credits || 0, 10),
                    0
                  )}
                  )
                </>
              }
            </h2>
            <div className="flex-1 overflow-y-auto p-2 border border-gray-200 rounded-2xl">
              {courseRecords &&
                courseRecords.map((courseRecord) => (
                  <ListItem
                    key={courseRecord["course_id"]}
                    id={courseRecord["course_id"]}
                    value={`${courseRecord["course_id"]} ${courseRecord["course_name"]}`}
                    onClick={handleRemoveCourseRecord}
                    buttonType="-"
                  />
                ))}
            </div>
          </div>

          <div className="p-2 border border-gray-200 rounded-md bg-white flex flex-col flex-1 mt-4">
            <h2 className="m-0 text-center">Suggested Courses</h2>
            {loadingSuggestions ? ( //Spinner while loading
              <div className="flex justify-center items-center mt-4">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-2 border border-gray-200 rounded-2xl">
                {suggestedCourses.length > 0 ? (
                  suggestedCourses.map((course) => (
                    <ListItem
                      key={course.course_id}
                      id={course.course_id}
                      value={`${course.course_id} - ${course.course_name} (${course.credits} credits)`}
                      onClick={() => handleOnAddCourse(course.course_id)} // <-- ONLY pass course_id
                      buttonType="+"
                    />
                  ))
                ) : (
                  <div className="text-center">No suggestions available.</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <DropdownTable
            courses={searchedCourses}
            handleOnAddCourse={handleOnAddCourse}
            handleOnRemoveCourse={handleRemoveCourseRecord}
            addedCourseIds={addedCourseIds}
          />
        </div>
      </div>
    </>
  );
};

export default SelectCourses;
