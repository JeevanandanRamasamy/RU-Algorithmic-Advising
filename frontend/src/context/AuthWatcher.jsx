import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify"; // if you're using react-toastify or similar
import { showWarningToast } from "../components/toast/Toast";

const AuthWatcher = () => {
	const { token, logout } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!token) {
			return;
		}

		let logoutTimeoutId;
		let warningTimeoutId;

		try {
			const { exp } = jwtDecode(token);
			const expirationTime = exp * 1000;
			const currentTime = Date.now();
			const timeUntilExpiry = expirationTime - currentTime;

			const warningTime = 300 * 1000; // 5 minutes before expiry

			if (timeUntilExpiry <= 0) {
				logout();
				navigate("/");
			} else {
				// Show a warning 1 minute before expiry
				if (timeUntilExpiry > warningTime) {
					warningTimeoutId = setTimeout(() => {
						showWarningToast("Your session will expire in 5 minute!");
					}, timeUntilExpiry - warningTime);
				}

				// Logout on expiry
				logoutTimeoutId = setTimeout(() => {
					logout();
					navigate("/");
				}, timeUntilExpiry);
			}
		} catch (error) {
			console.error("Invalid token:", error);
			logout();
			navigate("/");
		}

		return () => {
			clearTimeout(logoutTimeoutId);
			clearTimeout(warningTimeoutId);
		};
	}, [token, logout, navigate]);

	return null;
};

export default AuthWatcher;
