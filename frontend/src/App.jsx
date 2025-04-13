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

import ToastDemo from "./pages/ToastDemo";
import { ToastWrapper } from "./components/toast/Toast";

import AdminDashboard from "./pages/AdminDashboard";

import { AuthProvider } from "./context/AuthContext"; // <- 👈 import AuthProvider
import AuthWatcher from "./context/AuthWatcher"; // <- 👈 import the watcher
import "./css/index.css";

function App() {
	return (
		<AuthProvider>
			<AuthWatcher /> {/* 👈 Auto-logout when token expires */}

			<div>
				<main className="main-content">
					<Routes>
						<Route 
							path="/" 
							element={
								<Login />
							} 
						/>
						<Route 
							path="/register" 
							element={
								<Register />
							} 
						/>
						<Route 
							path="/reset-password" 
							element={
								<ResetPassword />
							} 
						/>
						<Route 
							path="/student/home" 
							element={
								<StudentDashboard />
							} 
						/>
						<Route 
							path="/navbar" 
							element={
								<Navbar />
							} 
						/>
						<Route
							path="/questionnaire"
							element={
								<DndProvider backend={HTML5Backend}>
									<Questionnaire />
								</DndProvider>
							}
						/>
						<Route
							path="/degree-planner"
							element={
								<DndProvider backend={HTML5Backend}>
									<DegreePlanner />
								</DndProvider>
							}
						/>
						<Route
							path="/request-spn"
							element={
								<DndProvider backend={HTML5Backend}>
									<SPN />
								</DndProvider>
							}
						/>
						<Route
							path="/toast"
							element={
								<ToastDemo />
							}
						/>
						<Route
							path="/admin/home"
							element={
								<AdminDashboard />
							}
						/>
					</Routes>
				</main>
				<ToastWrapper />
			</div>
		</AuthProvider>
	);
}

export default App;
