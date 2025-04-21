// frontend/src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import DataTable from "../components/generic/DataTable";
import { Link, useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
	const { user, token, role } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate("/"); // Redirect to login if not authenticated
		}
		if (role === "student") {
			navigate("/student/home"); // Redirect to student dashboard if user is student
		}
	}, [user, role, navigate]); // Runs whenever user changes

	// SPN state
	const [spnApi] = useState(`${backendUrl}/api/admin/spn?pending=true`);
	const [spnUpdateApi] = useState(`${backendUrl}/api/admin/spn`);
	const spnColumns = [
		{ header: "NetID", accessor: "student_id" },
		{ header: "Course", accessor: "course_id" },
		{ header: "Section", accessor: "section_num" },
		{ header: "Term", accessor: "term" },
		{ header: "Year", accessor: "year" },
		{ header: "Reason", accessor: "reason" },
		{ header: "Status", accessor: "status" } // editable
	];

	// Popularity
	const [popular, setPopular] = useState({ most_popular: [], least_popular: [] });

	// Students list
	const [query, setQuery] = useState("");
	const [students, setStudents] = useState([]);

	// Fetch popularity once
	useEffect(() => {
		fetch(`${backendUrl}/api/admin/courses/popular`, {
			headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
		})
			.then(r => r.json())
			.then(setPopular)
			.catch(console.error);
	}, [token]);

	// Fetch students on query change
	useEffect(() => {
		fetch(`${backendUrl}/api/admin/students?q=${query}`, {
			headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
		})
			.then(r => r.json())
			.then(setStudents)
			.catch(console.error);
	}, [query, token]);

	return (
		<div className="p-5 mx-auto ml-[130px] h-auto overflow-x-hidden">
			<Navbar />
			<h1 className="text-2xl mb-4">Admin Dashboard</h1>

			{/* SPN Requests */}
			<section className="mb-8">
				<h2 className="text-xl mb-2">Pending SPN Requests</h2>
				<DataTable
					apiUrl={spnApi}
					updateApiUrl={spnUpdateApi}
					columns={spnColumns}
					noDataMessage="No pending SPN requests."
				/>
			</section>

			{/* Popularity */}
			<section className="mb-8">
				<h2 className="text-xl mb-2">Course Popularity</h2>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<h3 className="font-semibold">Top 3 Most Popular</h3>
						<ul className="list-disc list-inside">
							{popular.most_popular.map(c => (
								<li key={c.course_id}>
									{c.course_id} ({c.count} students)
								</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="font-semibold">Top 3 Least Popular</h3>
						<ul className="list-disc list-inside">
							{popular.least_popular.map(c => (
								<li key={c.course_id}>
									{c.course_id} ({c.count} students)
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			{/* Student Directory */}
			<section className="mb-8">
				<h2 className="text-xl mb-2">Student Directory</h2>
				<input
					type="text"
					placeholder="Search NetID…"
					value={query}
					onChange={e => setQuery(e.target.value)}
					className="border px-2 py-1 mb-4"
				/>
				<ul className="divide-y">
					{students.map(s => (
						<li
							key={s.username}
							className="py-2 hover:underline cursor-pointer"
							onClick={() => navigate(`/admin/student/${s.username}`)}>
							{s.username} — {s.first_name} {s.last_name}
						</li>
					))}
					{students.length === 0 && <li>No students found.</li>}
				</ul>
			</section>
		</div>
	);
}
