import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import NotificationsButton from "../components/widgets/Notifications";
import Chatbot from "../components/widgets/Chatbot";
import Card, { CardContent } from "../components/generic/Card";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminStudentSchedule() {
	const { studentId } = useParams();
	const navigate = useNavigate();
	const { token } = useAuth();
	const [schedule, setSchedule] = useState([]);
	const [studentName, setStudentName] = useState("");

	useEffect(() => {
		// Fetch schedule
		fetch(`${backendUrl}/api/admin/students/${studentId}/schedule`, {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(setSchedule)
			.catch(console.error);

		// Fetch student name
		fetch(`${backendUrl}/api/admin/students/${studentId}`, {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => res.json())
			.then(data => setStudentName(`${data.first_name} ${data.last_name}`))
			.catch(console.error);
	}, [studentId]);

	// Capitalize first letter
	const formatTerm = term => (term ? term.charAt(0).toUpperCase() + term.slice(1) : term);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<NotificationsButton />
			<Chatbot />

			<div className="p-8 ml-[110px]">
				<button
					onClick={() => navigate("/admin/home")}
					className="mb-4 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100">
					← Back to Dashboard
				</button>

				<h1 className="text-3xl font-bold text-gray-800 mb-6">
					Schedule for {studentName ? `${studentName} (${studentId})` : studentId}
				</h1>

				<Card>
					<CardContent className="p-6 overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr>
									<th className="px-4 py-2 font-medium text-gray-700">Course</th>
									<th className="px-4 py-2 font-medium text-gray-700">Name</th>
									<th className="px-4 py-2 font-medium text-gray-700">Term</th>
									<th className="px-4 py-2 font-medium text-gray-700">Year</th>
								</tr>
							</thead>
							<tbody className="divide-y">
								{schedule.map((rec, idx) => (
									<tr key={idx}>
										<td className="px-4 py-2 text-gray-800">{rec.course_id}</td>
										<td className="px-4 py-2 text-gray-800">
											{rec.course_name}
										</td>
										<td className="px-4 py-2 text-gray-800">
											{formatTerm(rec.term)}
										</td>
										<td className="px-4 py-2 text-gray-800">{rec.year}</td>
									</tr>
								))}

								{schedule.length === 0 && (
									<tr>
										<td
											colSpan="4"
											className="px-4 py-6 text-center text-gray-600">
											No courses found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
