import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext";
import { showSuccessToast } from "../components/toast/Toast";

/**
 * Custom hook to manage user account details (fetch, update, delete).
 *
 * @returns {Object} The account details and methods to update or delete the account.
 */
const useAccount = () => {
	const { user, token, logout } = useAuth();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");

	/**
	 * Fetches the current user's account details from the backend API.
	 * This is triggered when the component mounts or when the user data changes.
	 */
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

	/**
	 * Updates the user's account details (first name, last name, and password).
	 *
	 * @param {Object} accountDetails - The account details to update.
	 * @param {string} accountDetails.first_name - The user's new first name.
	 * @param {string} accountDetails.last_name - The user's new last name.
	 * @param {string} accountDetails.password - The user's new password.
	 *
	 * @returns {Object} Result indicating success or failure of the update.
	 */
	const updateAccount = async ({ first_name, last_name, password }) => {
		try {
			const response = await fetch(`${backendUrl}/api/users/account`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify({ first_name, last_name, password })
			});

			if (!response.ok) throw new Error("Update failed");
			const updated = await response.json();

			if (first_name) setFirstName(first_name);
			if (last_name) setLastName(last_name);

			return { success: true, message: updated.message || "Updated!" };
		} catch (error) {
			console.error("Error updating account:", error);
			return { success: false, message: "Failed to update account" };
		}
	};

	/**
	 * Deletes the user's account.
	 *
	 * @returns {Object} Result indicating success or failure of the deletion.
	 */
	const deleteAccount = async () => {
		try {
			const response = await fetch(`${backendUrl}/api/users/account`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (!response.ok) {
				const err = await response.json();
				throw new Error(err.message || "Delete failed");
			}

			// Parse message if there is any
			const data = await response.json();

			await logout();
			showSuccessToast("Account deleted successfully!");
			return { success: true };
		} catch (error) {
			console.error("Error deleting account:", error);
			return { success: false, message: "Failed to delete account" };
		}
	};

	return {
		firstName,
		lastName,
		setFirstName,
		setLastName,
		updateAccount,
		deleteAccount
	};
};

export default useAccount;
