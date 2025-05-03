import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { showErrorToast, showSuccessToast } from "../components/toast/Toast";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const StudentDetailsContext = createContext();

/**
 * Provides student details management functions to children components.
 *
 * @param {React.ReactNode} children - The child components that need access to student details context.
 */
export const StudentDetailsProvider = ({ children }) => {
	const { user, token } = useAuth();
	const currentYear = new Date().getFullYear();

	const [gradYear, setGradYear] = useState("");
	const [enrollYear, setEnrollYear] = useState("");
	const [gpa, setGpa] = useState(0);
	const [creditsEarned, setCreditsEarned] = useState(0);

	/**
	 * Fetches user details from the backend API and updates the state.
	 *
	 * @returns {void}
	 */
	const fetchUserDetails = async () => {
		try {
			if (!user) return;
			const response = await fetch(`${backendUrl}/api/users/details`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				}
			});
			const data = await response.json();
			const userDetails = data.user_details || {};
			setGradYear(userDetails.grad_year ?? currentYear + 4);
			setEnrollYear(userDetails.enroll_year ?? currentYear);
			setGpa(userDetails.gpa ?? "");
			setCreditsEarned(userDetails.credits_earned ?? 0);
		} catch (error) {
			console.error("Error fetching student details:", error);
		}
	};

	// Fetch user details when the component mounts or when user data changes
	useEffect(() => {
		fetchUserDetails();
	}, [user]);

	/**
	 * Handles changes to the GPA input field and validates the input.
	 *
	 * @param {React.ChangeEvent} e - The input change event.
	 */
	const handleGpaChange = e => {
		let value = e.target.value;
		if (/^(4(\.0{0,2})?|0?\.?\d{0,2}|[1-3](\.\d{0,2})?)$/.test(value)) {
			setGpa(parseFloat(value));
		}
	};

	/**
	 * Handles changes to the Graduation Year input field and validates the input.
	 *
	 * @param {React.ChangeEvent} e - The input change event.
	 */
	const handleGradYearChange = e => {
		let value = e.target.value;
		if (/^\d{0,4}$/.test(value)) {
			setGradYear(parseInt(value, 10));
		}
	};

	/**
	 * Handles changes to the Enrollment Year input field and validates the input.
	 *
	 * @param {React.ChangeEvent} e - The input change event.
	 */
	const handleEnrollYearChange = e => {
		let value = e.target.value;
		if (/^\d{0,4}$/.test(value)) {
			setEnrollYear(parseInt(value, 10));
		}
	};

	/**
	 * Saves the updated student details to the backend API after validation.
	 *
	 * @returns {void}
	 */
	const saveStudentDetails = async () => {
		if (enrollYear > gradYear) {
			showErrorToast("Enrollment year must be before grad year");
			return;
		}
		const response = await fetch(`${backendUrl}/api/users/details`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify({
				grad_year: gradYear,
				enroll_year: enrollYear,
				gpa: gpa
			})
		});
		const data = await response.json();
		if (response.ok) {
			showSuccessToast("Successfully saved student details");
			// navigate("/home");
		} else {
			showErrorToast("Failed to save student details.");
			console.error(data);
		}
	};

	return (
		<StudentDetailsContext.Provider
			value={{
				gradYear,
				setGradYear,
				enrollYear,
				setEnrollYear,
				gpa,
				setGpa,
				saveStudentDetails,
				handleGpaChange,
				handleGradYearChange,
				handleEnrollYearChange,
				creditsEarned,
				setCreditsEarned,
				fetchUserDetails
			}}>
			{children}
		</StudentDetailsContext.Provider>
	);
};

export const useStudentDetails = () => useContext(StudentDetailsContext);
