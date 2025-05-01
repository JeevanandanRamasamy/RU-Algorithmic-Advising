/**
 * NotificationsButton & NotificationsPanel Components
 *
 * This file defines a floating notification bell that opens a panel with user notifications.
 *
 * Features:
 * - Floating bell button using Framer Motion for hover/tap animations
 * - Animated notification panel that lists recent messages
 * - Each notification has a dismiss (X) button
 *
 * Notes:
 * - Notifications are hardcoded for demo purposes
 * - NotificationsPanel is rendered conditionally based on button toggle
 * - The component supports an `onToggle` callback to inform parent about visibility
 */

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { motion } from "framer-motion";

const NotificationsPanel = ({ notifications }) => (
	<div className="fixed top-26 right-8 z-50 w-80 bg-white rounded-xl shadow-lg border border-gray-200">
		<div className="p-4 max-h-[300px] overflow-y-auto">
			<p className="text-lg font-semibold mb-2">Notifications</p>
			{notifications.length === 0 ? (
				<p className="text-sm text-gray-500">You're all caught up!</p>
			) : (
				<div className="space-y-1">
					{notifications.map((note, i) => (
						<div
							key={i}
							className="flex justify-between items-center text-sm text-gray-700 bg-yellow-50 border border-yellow-200 p-3 rounded-md leading-none">
							<span className="pr-2">{note.message}</span>
							<span
								onClick={() => {
									const updated = [...notifications];
									updated.splice(i, 1);
									setNotifications(updated);
								}}
								className="cursor-pointer text-gray-400 hover:text-red-600">
								<X className="w-4 h-4" />
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	</div>
);

const NotificationsButton = ({ onToggle }) => {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (onToggle) onToggle(isOpen);
	}, [isOpen, onToggle]);

	const notifications = [
		{ message: "New assignment available in Math 101" },
		{ message: "Your project submission is due tomorrow" },
		{ message: "Don't forget to register for classes!" },
		{ message: "New grades posted for History 201" },
		{ message: "Reminder: Office hours on Friday at 3 PM" },
		{ message: "New course materials available for Chemistry 101" },
		{ message: "Your profile has been updated successfully" },
		{ message: "New event: Career Fair on March 15th" },
		{ message: "You have a new message from your advisor" },
		{ message: "Library books are due next week" }
	];

	return (
		<>
			<motion.button
				whileHover={{ scale: 1.05 }} // Slight scale up on hover
				whileTap={{ scale: 0.9 }} // Slight scale down on tap (press)
				onClick={() => setIsOpen(!isOpen)}
				className="fixed top-10 right-8 z-50 w-14 h-14 rounded-[1rem] cursor-pointer border border-gray-200 shadow-md bg-white group flex items-center justify-center transition-colors duration-200">
				<Bell className="w-6 h-6 text-[#cc0033] transition-colors duration-200 group-hover:text-[#fcf8d7]" />
				<div className="absolute inset-0 rounded-[1rem] bg-transparent group-hover:bg-[#cc0033] transition-colors duration-200 -z-10"></div>
			</motion.button>

			{isOpen && <NotificationsPanel notifications={notifications} />}
		</>
	);
};

export default NotificationsButton;
