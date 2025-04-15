import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
	const { user, token, logout } = useAuth();
	const [form, setForm] = useState({
		first_name: "",
		last_name: "",
		password: "",
	});
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
		if (user) {
			setForm({ ...form, first_name: user.first_name, last_name: user.last_name });
		}
	}, [user]);

    const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

    const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.put("/api/account", form, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setMessage("✅ Updated successfully!");
		} catch (err) {
			setMessage("❌ Update failed");
		}
	};

    const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
			try {
				await axios.delete("/api/account", {
					headers: { Authorization: `Bearer ${token}` },
				});
				logout();
				navigate("/");
			} catch (err) {
				setMessage("❌ Account deletion failed");
			}
		}
	};

    return (
		<div className="p-4 max-w-md mx-auto">
			<h2 className="text-xl font-bold mb-4">Account Settings</h2>
			<form onSubmit={handleSubmit} className="flex flex-col gap-3">
				<input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="border p-2 rounded" />
				<input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="border p-2 rounded" />
				<input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New Password (leave blank to keep current)" className="border p-2 rounded" />
				<button type="submit" className="bg-blue-600 text-white p-2 rounded">Save Changes</button>
			</form>
			<button onClick={handleDelete} className="mt-4 bg-red-500 text-white p-2 rounded">Delete Account</button>
			{message && <p className="mt-2 text-sm">{message}</p>}
		</div>
	);
};

export default AccountSettings;