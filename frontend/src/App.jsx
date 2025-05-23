import React from "react";
import { Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import StudentDashboard from "./pages/StudentDashboard";
import Questionnaire from "./pages/Questionnaire";
import DegreePlanner from "./pages/DegreePlanner";
import Navbar from "./components/navbar/Navbar";
import SPN from "./pages/SPN";
import DegreeNavigator from "./pages/DegreeNavigator";
import AccountSettings from "./pages/AccountSettings";

import { ToastWrapper } from "./components/toast/Toast";

import AdminDashboard from "./pages/AdminDashboard";
import AdminStudentSchedule from "./pages/AdminStudentSchedule";

import { AuthProvider } from "./context/AuthContext";
import "./css/index.css";
import CoursePlanner from "./pages/CoursePlanner";
import AuthLayout from "./components/protectedRoutes/AuthLayout";
import AuthWatcher from "./context/AuthWatcher";

// component to render the App and handles out routing
function App() {
	return (
		<AuthProvider>
			<AuthWatcher />
			<div>
				<main className="main-content">
					<Routes>
						<Route
							path="/"
							element={<Login />}
						/>
						<Route
							path="/admin/student/:studentId"
							element={<AdminStudentSchedule />}
						/>
						<Route
							path="/register"
							element={<Register />}
						/>
						<Route
							path="/reset-password"
							element={<ResetPassword />}
						/>

						<Route
							path="/admin/home"
							element={<AdminDashboard />}
						/>

						<Route
							path="/account-settings"
							element={<AccountSettings />}
						/>
						<Route
							path="/student"
							element={<AuthLayout />}>
							<Route
								path="home"
								element={<StudentDashboard />}
							/>
							<Route
								path="navbar"
								element={<Navbar />}
							/>

							<Route
								path="questionnaire"
								element={
									<DndProvider backend={HTML5Backend}>
										<Questionnaire />
									</DndProvider>
								}
							/>
							<Route
								path="degree-planner"
								element={
									<DndProvider backend={HTML5Backend}>
										<DegreePlanner />
									</DndProvider>
								}
							/>
							<Route
								path="request-spn"
								element={
									<DndProvider backend={HTML5Backend}>
										<SPN />
									</DndProvider>
								}
							/>

							<Route
								path="course-planner"
								element={
									<DndProvider backend={HTML5Backend}>
										<CoursePlanner />
									</DndProvider>
								}
							/>
							<Route
								path="degree-navigator"
								element={<DegreeNavigator />}
							/>
						</Route>
					</Routes>
				</main>
				<ToastWrapper />
			</div>
		</AuthProvider>
	);
}

export default App;
