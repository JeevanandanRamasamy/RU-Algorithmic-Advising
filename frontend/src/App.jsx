import React from "react";
import { Routes, Route } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";
import DragDrop from "./pages/DragDrop";
import Navbar from "./components/navbar/Navbar";

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
            path="/reset_password" 
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
							<DndProvider backend={HTML5Backend}>
								<Questionnaire />
							</DndProvider>
						}
					/>
					<Route
						path="/dragdrop"
						element={
							<DndProvider backend={HTML5Backend}>
								<DragDrop />
							</DndProvider>
						}
					/>
				</Routes>
			</main>
		</div>
	);
}

export default App;
