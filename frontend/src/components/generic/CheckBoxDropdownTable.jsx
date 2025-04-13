import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const CheckboxDropdownTable = ({ categories }) => {
	const [openCategories, setOpenCategories] = useState([]);
	const [selections, setSelections] = useState({});

	const toggleOpen = key => {
		setOpenCategories(prev =>
			prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
		);
	};

	const toggleCheckbox = (key, value) => {
		setSelections(prev => {
			const current = prev[key] || [];
			return {
				...prev,
				[key]: current.includes(value)
					? current.filter(v => v !== value)
					: [...current, value]
			};
		});
	};

	const toggleAllCheckboxes = (key, values) => {
		setSelections(prev => ({
			...prev,
			[key]: values
		}));
	};

	return (
		<div className="w-full max-w-md border rounded-xl shadow overflow-hidden">
			{categories.map(({ key, label, options }) => {
				const selectedValues = selections[key] || [];
				const allChecked = options.every(opt => selectedValues.includes(opt.value));
				const isOpen = openCategories.includes(key);

				return (
					<div
						key={key}
						className="border-b last:border-none">
						<button
							className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
							onClick={() => toggleOpen(key)}>
							<span className="font-medium">{label}</span>
							<span>{isOpen ? "▲" : "▼"}</span>
						</button>

						<AnimatePresence initial={false}>
							{isOpen && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.3 }}
									className="overflow-hidden px-4 py-2 bg-white">
									<div className="space-y-2">
										{/* Check All Row */}
										<div className="flex items-center justify-between px-3 py-2 border rounded bg-gray-50 hover:bg-gray-100">
											<label className="flex items-center space-x-3">
												<input
													type="checkbox"
													checked={allChecked}
													onChange={() =>
														toggleAllCheckboxes(
															key,
															allChecked
																? []
																: options.map(o => o.value)
														)
													}
													className="form-checkbox h-4 w-4 text-blue-600"
												/>
												<span className="font-medium">
													{allChecked ? "Uncheck all" : "Check all"}
												</span>
											</label>
										</div>

										{/* Individual Options */}
										{options.map(({ value, label }) => (
											<div
												key={value}
												className="flex items-center justify-between px-3 py-2 border rounded hover:bg-gray-50">
												<label className="flex items-center space-x-3">
													<input
														type="checkbox"
														checked={selectedValues.includes(value)}
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
				);
			})}
		</div>
	);
};

export default CheckboxDropdownTable;
