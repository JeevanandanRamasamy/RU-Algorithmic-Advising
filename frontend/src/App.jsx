import React from "react";
import { Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";
import DegreePlanner from "./pages/DegreePlanner";
import Navbar from "./components/navbar/Navbar";

import ToastDemo from "./pages/ToastDemo";
import { ToastWrapper } from "./components/toast/Toast";

import AdminDashboard from "./pages/AdminDashboard";

import "./css/index.css";

function App() {
	return (
		<div>
			<main className="main-content">
				<Routes>
					<Route
						path="/"
						element={<Login />}
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
						path="/home"
						element={<Home />}
					/>
					<Route
						path="/navbar"
						element={<Navbar />}
					/>
					<Route
						path="/questionnaire"
						element={
							<DndProvider
								backend={HTML5Backend}
								// autoScroll={true}
							>
								<Questionnaire />
							</DndProvider>
						}
					/>
					<Route
						path="/degree-planner"
						element={
							<DndProvider
								backend={HTML5Backend}
								// autoScroll={true}
							>
								<DegreePlanner />
							</DndProvider>
						}
					/>
					<Route
						path="/toast"
						element={<ToastDemo />}
					/>

					<Route
						path="/admin/home"
						element={<AdminDashboard />}
					/>
				</Routes>
			</main>
			<ToastWrapper />
		</div>
	);
}

export default App;
