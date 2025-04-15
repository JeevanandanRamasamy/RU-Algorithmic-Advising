import { useEffect, useState } from "react";
const classes = ["freshman", "sophomore", "junior", "senior", "graduate"];
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";
import { showErrorToast, showSuccessToast } from "../components/toast/Toast";

const useStudentDetails = () => {
	const { user, token } = useAuth();
	const currentYear = new Date().getFullYear();
	const [gradYear, setGradYear] = useState("");
	const [enrollYear, setEnrollYear] = useState("");
	const [gpa, setGpa] = useState(0);

	const handleGpaChange = e => {
		let value = e.target.value;
		if (/^(4(\.0{0,2})?|0?\.?\d{0,2}|[1-3](\.\d{0,2})?)$/.test(value)) {
			setGpa(parseFloat(value));
		}
	};

	const handleGradYearChange = event => {
		let value = event.target.value;
		if (/^\d{0,4}$/.test(value)) {
			setGradYear(parseInt(value, 10));
		}
	};

	const handleEnrollYearChange = event => {
		let value = event.target.value;
		if (/^\d{0,4}$/.test(value)) {
			setEnrollYear(parseInt(value, 10));
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
				const userDetails = data.user_details || {};
				setGradYear(userDetails.grad_year ?? currentYear + 4);
				setEnrollYear(userDetails.enroll_year ?? currentYear);
				setGpa(userDetails.gpa ?? "");
			} catch (error) {
				console.error("Error fetching programs:", error);
			}
		};
		fetchUserDetails();
	}, [user]);

	const saveStudentDetails = async () => {
		if (enrollYear > gradYear) {
			showErrorToast("Enrollment year must be before grad year");
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
			// use toast to update
			// navigate("/home");
		} else {
		}
	};

	return {
		classes,
		gradYear,
		setGradYear,
		enrollYear,
		setEnrollYear,
		gpa,
		setGpa,
		saveStudentDetails,
		handleGpaChange,
		handleGradYearChange,
		handleEnrollYearChange
	};
};

export default useStudentDetails;
