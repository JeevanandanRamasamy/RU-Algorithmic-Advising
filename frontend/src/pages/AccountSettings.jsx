import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import useAccount from "../hooks/useAccount";
import { useAuth } from "../context/AuthContext";

const AccountSettings = () => {
	const { user } = useAuth();
	const { firstName, lastName, updateAccount, deleteAccount } = useAccount();

	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		password: "",
		confirm_password: ""
	});
	const [editField, setEditField] = useState(null);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (user) {
			setForm({
				first_name: firstName,
				last_name: lastName,
				password: "",
				confirm_password: ""
			});
		}
	}, [user, firstName, lastName]);

	const handleChange = e => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		// Password validation (only if editing password)
		if (editField === "password") {
			if (form.password.length < 6) {
				setMessage("❌ Password must be at least 6 characters long.");
				return;
			}
			if (form.password !== form.confirm_password) {
				setMessage("❌ Passwords do not match.");
				return;
			}
		}

		const { success, message } = await updateAccount(form);
		setMessage(success ? `✅ ${message}` : `❌ ${message}`);
		if (success) {
			setEditField(null);
			setForm(prev => ({
				...prev,
				password: "",
				confirm_password: ""
			}));
		}
	};

	const handleDelete = async () => {
		if (
			window.confirm("Are you sure you want to delete your account? This cannot be undone.")
		) {
			const { success, message } = await deleteAccount();
			if (!success) setMessage(`❌ ${message}`);
		}
	};

	return (
		<div className="p-4 max-w-md mx-auto">
			<Navbar />
			<h2 className="text-xl font-bold mb-6">Account Settings</h2>

			{/* First Name */}
			<div className="mb-4">
				<label className="block font-medium mb-1">First Name:</label>
				{editField === "first_name" ? (
					<div className="flex gap-2">
						<input
							type="text"
							name="first_name"
							value={form.first_name}
							onChange={handleChange}
							className="border p-2 rounded flex-1"
						/>
						<button
							onClick={() => {
								setForm(prev => ({
									...prev,
									first_name: firstName
								}));
								setEditField(null);
							}}
							className="text-gray-500">
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="text-blue-600 font-semibold">
							Confirm
						</button>
					</div>
				) : (
					<div className="flex justify-between items-center">
						<span>{form.first_name}</span>
						<button
							onClick={() => setEditField("first_name")}
							className="text-blue-600 cursor-pointer">
							Edit
						</button>
					</div>
				)}
			</div>

			{/* Last Name */}
			<div className="mb-4">
				<label className="block font-medium mb-1">Last Name:</label>
				{editField === "last_name" ? (
					<div className="flex gap-2">
						<input
							type="text"
							name="last_name"
							value={form.last_name}
							onChange={handleChange}
							className="border p-2 rounded flex-1"
						/>
						<button
							onClick={() => {
								setForm(prev => ({
									...prev,
									last_name: lastName
								}));
								setEditField(null);
							}}
							className="text-gray-500">
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="text-blue-600 font-semibold">
							Confirm
						</button>
					</div>
				) : (
					<div className="flex justify-between items-center">
						<span>{form.last_name}</span>
						<button
							onClick={() => setEditField("last_name")}
							className="text-blue-600 cursor-pointer">
							Edit
						</button>
					</div>
				)}
			</div>

			{/* Password */}
			<div className="mb-6">
				<label className="block font-medium mb-1">Password:</label>
				{editField === "password" ? (
					<div className="flex flex-col gap-2">
						<input
							type="password"
							name="password"
							value={form.password}
							onChange={handleChange}
							placeholder="New password"
							className="border p-2 rounded"
						/>
						<input
							type="password"
							name="confirm_password"
							value={form.confirm_password}
							onChange={handleChange}
							placeholder="Confirm password"
							className="border p-2 rounded"
						/>
						<div className="flex gap-2 mt-2">
							<button
								onClick={() => {
									setForm(prev => ({
										...prev,
										password: "",
										confirm_password: ""
									}));
									setEditField(null);
								}}
								className="text-gray-500">
								Cancel
							</button>
							<button
								onClick={handleSubmit}
								className="text-blue-600 font-semibold">
								Confirm
							</button>
						</div>
					</div>
				) : (
					<div className="flex justify-between items-center">
						<span>******</span>
						<button
							onClick={() => setEditField("password")}
							className="text-blue-600 cursor-pointer">
							Edit
						</button>
					</div>
				)}
			</div>

			<button
				onClick={handleDelete}
				className="mt-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded w-full cursor-pointer">
				Delete Account
			</button>

			{message && <p className="mt-4 text-sm text-center">{message}</p>}
		</div>
	);
};

export default AccountSettings;
