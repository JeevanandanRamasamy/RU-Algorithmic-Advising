import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

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
						path="/home"
						element={<Home />}
					/>
					<Route
						path="/questionnaire"
						element={<Questionnaire />}
					/>
				</Routes>
			</main>
		</div>
	);
}

export default App;
