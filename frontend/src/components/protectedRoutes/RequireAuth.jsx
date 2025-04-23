import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RequireAuth = ({ children }) => {
	const { token, role } = useAuth();
	const location = useLocation();

	if (!token && role != "student") {
		return (
			<Navigate
				to="/"
				state={{ from: location }}
				replace
			/>
		);
	}

	return children;
};

export default RequireAuth;
