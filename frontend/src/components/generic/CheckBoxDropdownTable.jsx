import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CheckboxDropdownTable = ({ categories }) => {
	const [openCategory, setOpenCategory] = useState(null);
	const [selections, setSelections] = useState({});

	const toggleOpen = key => {
		setOpenCategory(prev => (prev === key ? null : key));
	};

	const toggleCheckbox = (category, value) => {
		setSelections(prev => {
			const prevSelected = prev[category] || [];
			const updated = prevSelected.includes(value)
				? prevSelected.filter(v => v !== value)
				: [...prevSelected, value];
			return { ...prev, [category]: updated };
		});
	};

	return (
		<div className="w-full max-w-md border rounded-xl shadow overflow-hidden">
			{categories.map(({ key, label, options }) => (
				<div
					key={key}
					className="border-b last:border-none">
					<button
						className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
						onClick={() => toggleOpen(key)}>
						<span className="font-medium">{label}</span>
						<span>{openCategory === key ? "▲" : "▼"}</span>
					</button>

					<AnimatePresence initial={false}>
						{openCategory === key && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="overflow-hidden px-4 py-2 bg-white">
								<div className="space-y-2">
									{options.map(({ value, label }) => (
										<div
											key={value}
											className="flex items-center justify-between px-3 py-2 border rounded hover:bg-gray-50">
											<label className="flex items-center space-x-3">
												<input
													type="checkbox"
													checked={(selections[key] || []).includes(
														value
													)}
													onChange={() => toggleCheckbox(key, value)}
													className="form-checkbox h-4 w-4 text-blue-600"
												/>
												<span>{label}</span>
											</label>
										</div>
									))}
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			))}
		</div>
	);
};

export default CheckboxDropdownTable;
