import { useEffect, useState } from "react";
const classes = ["freshman", "sophomore", "junior", "senior", "graduate"];
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";

const useStudentDetails = () => {
	const { user, token } = useAuth();
	const [gradYear, setGradYear] = useState("");
	const [enrolledYear, setEnrolledYear] = useState("");
	const [gpa, setGpa] = useState(0);
	const [classYear, setClassYear] = useState("");

	const navigate = useNavigate();

	const handleGpaChange = e => {
		const value = e.target.value;
		if (value === "" || /^(4(\.0{0,2})?|0?\.?\d{0,2}|[1-3](\.\d{0,2})?)$/.test(value)) {
			setGpa(value);
		}
	};
	const handleGradYearChange = event => {
		const value = event.target.value;

		if (/^\d{0,4}$/.test(value)) {
			setGradYear(value);
		}
	};
	const handleEnrolledYearChange = event => {
		const value = event.target.value;

		if (/^\d{0,4}$/.test(value)) {
			setEnrolledYear(value);
		}
	};

	useEffect(() => {
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
				const fields = {
					grad_date: setGradYear,
					enroll_date: setEnrolledYear,
					gpa: setGpa,
					class_year: setClassYear
				};
				Object.entries(fields).forEach(([key, setter]) => {
					if (data.user_details[key]) {
						setter(data.user_details[key]);
					}
				});
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};
		fetchUserDetails();
	}, [user]);

	const saveStudentDetails = async () => {
		const response = await fetch(`${backendUrl}/api/users/details`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify(
				Object.fromEntries(
					Object.entries({
						grad_date: gradYear,
						enroll_date: enrolledYear,
						gpa: gpa,
						class_year: classYear
					}).filter(([_, value]) => value !== "")
				)
			)
		});
		//TODO: redirect
		if (response.ok) {
			navigate("/home");
		} else {
		}
	};

	return {
		classes,
		gradYear,
		setGradYear,
		enrolledYear,
		setEnrolledYear,
		gpa,
		setGpa,
		classYear,
		setClassYear,
		saveStudentDetails,
		handleGpaChange,
		handleGradYearChange,
		handleEnrolledYearChange
	};
};

export default useStudentDetails;
