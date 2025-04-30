/**
 * studentDetails Component
 *
 * This component displays a small form that collects academic information from the student:
 * - Enrollment year
 * - Expected graduation year
 * - Current GPA
 *
 * Props:
 * - enrollYear (string): The current value of the enrolled year input
 * - handleEnrollYearChange (function): Handler for updating the enrolled year
 * - gradYear (string): The current value of the graduation year input
 * - handleGradYearChange (function): Handler for updating the graduation year
 * - gpa (string or number): The current value of the GPA input
 * - handleGpaChange (function): Handler for updating the GPA
 *
 * All values are controlled inputs. The component is styled using Tailwind-style utility classes.
 */

import React from "react";
import Dropdown from "../generic/Dropdown";

const studentDetails = ({
  enrollYear,
  handleEnrollYearChange,
  gradYear,
  handleGradYearChange,
  gpa,
  handleGpaChange,
}) => {
  return (
    // <div className="gap-[20px] pt-[10x] pb-[10px]">
    <div className="flex flex-col justify-evenly p-2 border border-gray-200 rounded-md bg-white h-[204px] ">
      <div className="flex flex-row gap-5 items-center justify-between">
        <label className="w-[280px]" htmlFor="enroll-year">
          Enter Enrolled Year:
        </label>
        <input
          type="text"
          id="enrolled-year"
          value={enrollYear}
          onChange={handleEnrollYearChange}
          maxLength={4}
          className="border border-gray-300 p-2 rounded w-8"
        />
      </div>
      <div className="flex flex-row gap-5 items-center justify-between">
        <label className="w-[280px]" htmlFor="graduation-year">
          Enter Graduation Year:
        </label>
        <input
          type="text"
          id="graduation-year"
          value={gradYear}
          onChange={handleGradYearChange}
          maxLength={4}
          className="border border-gray-300 p-2 rounded w-8"
        />
      </div>
      <div className="flex flex-row gap-5 items-center">
        <label className="w-[280px]" htmlFor="GPA">
          GPA:
        </label>
        <input
          type="number"
          max="4.0"
          min="0"
          step="0.01"
          id="gpa-input"
          value={gpa}
          onChange={handleGpaChange}
          placeholder="Enter GPA (0.00 - 4.00)"
          className="border border-gray-300 p-2 rounded"
        />
      </div>
    </div>
    // </div>
  );
};

export default studentDetails;
