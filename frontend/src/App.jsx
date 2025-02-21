import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Questionnaire from "./pages/Questionnaire.jsx";

function App() {
	return (
		<>
			<Router>
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
						path="/questionnaire"
						element={<Questionnaire />}
					/>
				</Routes>
			</Router>
		</>
	);
}

export default App;
