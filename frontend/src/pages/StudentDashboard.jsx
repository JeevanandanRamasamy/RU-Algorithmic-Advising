import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import NotificationsButton from "../components/widgets/notifications";
import { useAuth } from "../context/AuthContext";
import useAccount from "../hooks/useAccount";
import useStudentDetails from "../hooks/useStudentDetails";
import usePrograms from "../hooks/usePrograms";
import useProgramRequirements from "../hooks/useProgramRequirements";
import useTakenCourses from "../hooks/useTakenCourses";
import usePlannedCourses from "../hooks/usePlannedCourses";
import Card, { CardContent } from "../components/generic/card";
import Progress from "../components/generic/progress";
import { Circle } from "rc-progress";
import { Pencil, X } from "lucide-react";
import "../css/home.css";

function StudentDashboard() {
	const { user, role } = useAuth();
	const navigate = useNavigate();
	const {
		firstName,
		lastName,
	} = useAccount();
	const {
		enrollYear,
		gradYear,
		gpa,
		creditsEarned,
	} = useStudentDetails();
	const { selectedPrograms } = usePrograms();
	const {
		fetchProgramRequirements,
		fetchTakenCourses
	} = useProgramRequirements();
	const [programStats, setProgramStats] = useState({});
	const { takenCourses } = useTakenCourses();
	const { plannedCourses } = usePlannedCourses();

	const totalCredits = 120;
	const semestersLeft = Math.ceil((totalCredits - creditsEarned) / 15);

	useEffect(() => {
		if (!user) {
			navigate("/"); // Redirect to login if not authenticated
		}
		if (role === "admin") {
			navigate("/admin/home"); // Redirect to admin dashboard if user is admin
		}

		const loadProgramData = async () => {
			const stats = {};
			for (const program of selectedPrograms) {
				const total = await fetchProgramRequirements(program.program_id);
				const taken = await fetchTakenCourses(program.program_id);
				stats[program.program_id] = {
					total,
					taken,
					needed: total - taken,
				};
			}
			setProgramStats(stats);
		};

		if (selectedPrograms.length) loadProgramData();
	}, [user, role, navigate, selectedPrograms]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />
			<NotificationsButton />
			<div className="p-8 ml-[110px]">
				<h1 className="text-3xl font-bold mb-6 text-gray-800">
					Welcome back, <span className="text-primary">{firstName} {lastName}</span> 👋
				</h1>

				<div className={`grid gap-6 grid-cols-1 md:grid-cols-3`}>
					{/* GPA & Years Card */}
					<Card>
						<CardContent className="p-6">
							<div className="flex justify-between items-center">
								<p className="text-xl font-semibold">Academic Overview</p>
								<Link to="/questionnaire">
									<div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white hover:bg-blue-500 transition-colors group">
										<Pencil className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
									</div>
								</Link>
							</div>
							<p className="mt-2 text-sm text-gray-600">
								Current GPA: <span className="font-medium">{gpa}</span>
							</p>
							<p className="text-sm text-gray-600">
								Enrolled: <span className="font-medium">{enrollYear}</span>
							</p>
							<p className="text-sm text-gray-600">
								Expected Graduation: <span className="font-medium">{gradYear}</span>
							</p>
							<p className="text-sm text-gray-600">
								Number of Courses Taken: <span className="font-medium">{takenCourses.length}</span>
							</p>
							<p className="text-sm text-gray-600">
								Number of Courses Planned: <span className="font-medium">{plannedCourses.length}</span>
							</p>
						</CardContent>
					</Card>

					{/* Credit Progress */}
					<Card>
						<CardContent className="p-6 flex flex-col items-center justify-center text-center">
							<p className="text-xl font-semibold mb-2">Credits Progress</p>
							<Circle
								percent={(creditsEarned / totalCredits) * 100}
								strokeWidth={6}
								strokeColor="#3b82f6"
								trailColor="#d1d5db"
								className="w-32 h-32 mx-auto"
							/>
							<p className="mt-4 text-gray-700">
								{creditsEarned} / {totalCredits} credits
							</p>
						</CardContent>
					</Card>

					{/* Graduation Progress */}
					<Card>
						<CardContent className="p-6 flex flex-col items-center justify-center text-center">
							<p className="text-xl font-semibold mb-2"> 
								Graduation Forecast 
							</p>
							<p className="text-me text-gray-700 mb-1"> 
								You’re on track to graduate in 
							</p>
							<p className="text-5xl font-bold text-primary leading-none tracking-tight m-4">
								{semestersLeft}
							</p>
							<p className="text-me font-medium text-gray-700">
								semester{semestersLeft > 1 ? "s" : ""}
							</p>
							<p className="mt-3 text-sm text-gray-500"> 
								Keep it up! You're making solid progress. 🎓
							</p>
						</CardContent>
					</Card>

					{/* Enrolled Programs */}
					<Card className="col-span-1 md:col-span-3">
						<CardContent className="p-6">
							<p className="text-xl font-semibold mb-4">
								Your Programs
							</p>
							{selectedPrograms.map((program) => {
								const stats = programStats[program.program_id];
								const percent =
									stats && stats.total > 0 ? ((stats.taken) / stats.total) * 100 : 0;

								return (
									<div key={program.program_id} className="mb-4">
										<p className="text-sm font-medium text-gray-700 mb-1">
											{program.program_name}
										</p>
										<Progress value={percent} />
										<p className="text-xs text-gray-500 mt-1">
											{stats ? `${stats.needed} courses remaining` : "Loading..."}
										</p>
									</div>
								);
							})}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

export default StudentDashboard;