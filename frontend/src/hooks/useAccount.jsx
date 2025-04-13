import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";

const useAccount = () => {
	const { user, token } = useAuth();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	useEffect(() => {
		const fetchAccountDetails = async () => {
			try {
				if (!user) return;
				const response = await fetch(`${backendUrl}/api/users/account`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": `Bearer ${token}`
					}
				});
				const data = await response.json();
				const account = data.account || {};
				setFirstName(account.first_name ?? "Unknown");
				setLastName(account.last_name ?? "User");
			} catch (error) {
				console.error("Error fetching account:", error);
			}
		};
		fetchAccountDetails();
	}, [user]);

	return {
		firstName,
		lastName,
		setFirstName,
		setLastName
	};
};

export default useAccount;
