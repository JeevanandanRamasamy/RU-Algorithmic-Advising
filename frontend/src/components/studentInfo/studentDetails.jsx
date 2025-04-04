import React from "react";
import Dropdown from "../generic/Dropdown";

const studentDetails = ({
	enrollYear,
	handleEnrollYearChange,
	gradYear,
	handleGradYearChange,
	classes,
	gpa,
	handleGpaChange
}) => {
	console.log(enrollYear);
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-row gap-5 items-center">
				<label
					className="w-[180px]"
					htmlFor="enrolled-year">
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
			<div className="flex flex-row gap-5 items-center">
				<label
					className="w-[180px]"
					htmlFor="graduation-year">
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
			{/* <div className="flex flex-row gap-5 items-center">
				<Dropdown
					options={classes}
					selectedValue={classYear}
					onChange={event => setClassYear(event.target.value)}
					placeholder="Select Class Year"
				/>
			</div> */}
			<div className="flex flex-row gap-5 items-center">
				<label
					className=""
					htmlFor="GPA">
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
	);
};

export default studentDetails;
