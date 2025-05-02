/**
 * RequirementTree.jsx
 *
 * This component renders a collapsible tree structure representing a degree program's
 * requirements for a given user. Each requirement group can contain subgroups or
 * individual courses. Progress bars and checkmarks visually represent completion status.
 *
 * Features:
 * - Fetches requirement tree data based on selected program and user.
 * - Renders a nested requirement tree with progress bars.
 * - Allows toggling (expand/collapse) of tree nodes.
 * - Provides "Expand All" and "Collapse All" functionality.
 */

import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

/**
 * RequirementTree component
 * @param {string} programId - The ID of the selected program.
 * @param {string} username - The current user's username.
 */
const RequirementTree = ({ programId, username }) => {
	const [treeData, setTreeData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [expandedNodes, setExpandedNodes] = useState(new Set());

	/**
	 * Fetches the requirement tree data when the programId changes.
	 */
	useEffect(() => {
		const fetchTree = async () => {
			try {
				const res = await fetch(
					`${backendUrl}/api/degree_navigator/programs/${programId}/requirement-tree-labeled?username=${username}`
				);

				if (!res.ok) {
					const errorText = await res.text();
					throw new Error(`HTTP ${res.status}: ${errorText}`);
				}

				const data = await res.json();
				setTreeData(data);
			} catch (err) {
				console.error("Failed to fetch requirement tree:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchTree();
	}, [programId]);

	/**
	 * Counts the number of completed courses or subgroups within a node.
	 * @param {object} node - A requirement node.
	 * @returns {number} - Number of completed items.
	 */
	const countCompleted = node => {
		if (node.courses?.length) {
			return node.courses.filter(course => course.taken).length;
		}
		if (node.children?.length) {
			return node.children.filter(child => {
				if (child.courses?.length) {
					return child.courses.every(course => course.taken);
				}
				return false;
			}).length;
		}
		return 0;
	};

	/**
	 * Toggles a requirement group node's expanded/collapsed state.
	 * @param {string} groupId - The ID of the group to toggle.
	 */
	const toggleNode = groupId => {
		setExpandedNodes(prev => {
			const updated = new Set(prev);
			if (updated.has(groupId)) {
				updated.delete(groupId);
			} else {
				updated.add(groupId);
			}
			return updated;
		});
	};

	/**
	 * Collects all group IDs from the tree to support bulk expanding/collapsing.
	 * @param {Array} nodes - The root-level tree data.
	 * @returns {Set} - Set of all group IDs.
	 */
	const collectAllGroupIds = nodes => {
		let ids = new Set();
		const traverse = nodeList => {
			nodeList.forEach(node => {
				ids.add(node.group_id);
				if (node.children?.length > 0) {
					traverse(node.children);
				}
			});
		};
		traverse(nodes);
		return ids;
	};

	/**
	 * Expands or collapses all requirement nodes.
	 * @param {string} action - Either "expand" or "collapse".
	 */
	const handleExpandCollapse = action => {
		if (action === "expand") {
			const allIds = collectAllGroupIds(treeData);
			setExpandedNodes(allIds);
		} else if (action === "collapse") {
			setExpandedNodes(new Set());
		}
	};

	/**
	 * Recursively renders the requirement tree with progress indicators.
	 * @param {object} node - A requirement group or leaf node.
	 * @param {number} depth - The current depth in the tree (for indentation).
	 * @param {string} parentLabel - The label prefix for hierarchical numbering.
	 * @returns {JSX.Element}
	 */

	const renderTree = (node, depth = 0, parentLabel = "") => {
		const isExpandable = node.children?.length > 0 || node.courses?.length > 0;
		const isExpanded = expandedNodes.has(node.group_id);
		const fullLabel = parentLabel ? `${parentLabel}.${node.label}` : node.label;

		const completed = countCompleted(node);
		const total =
			node.num_required === 0
				? node.children?.length || node.courses?.length || 0
				: node.num_required;

		const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
		const isComplete = progressPercent === 100;

		return (
			<div
				key={node.group_id}
				className="mb-4"
				style={{ marginLeft: `${depth * 1.25}rem` }} // 1.25rem = 20px
			>
				<div
					onClick={() => isExpandable && toggleNode(node.group_id)}
					className="font-bold cursor-pointer flex items-center gap-1">
					{isExpandable && <span className="mr-1">{isExpanded ? "▼" : "▶"}</span>}
					<span>
						{fullLabel}. {node.group_name} — Required: {completed}/{total}
						{node.num_required === 0 ? " (All)" : ""}
					</span>
					{isComplete && <span className="text-green-600 text-sm ml-1">✅</span>}
				</div>

				{/* ✅ Tailwind Progress Bar */}
				<div className="mt-1">
					<div className="w-full h-2 bg-gray-200 rounded">
						<div
							className={`h-2 rounded transition-all duration-300 ${
								isComplete ? "bg-green-500" : "bg-blue-500"
							}`}
							style={{ width: `${progressPercent}%` }}></div>
					</div>
					<div className="text-xs text-gray-600 mt-1">{progressPercent}% complete</div>
				</div>

				{isExpanded && (
					<>
						{node.courses?.length > 0 && (
							<ul className="mt-2 ml-4 list-disc">
								{node.courses.map(course => (
									<li
										key={course.course_id}
										className={`text-sm ${
											course.taken ? "text-green-700 font-semibold" : ""
										}`}>
										{course.course_id} - {course.course_name} -{" "}
										{course.course_credits} Credits
									</li>
								))}
							</ul>
						)}
						{node.children?.map(child => renderTree(child, depth + 1, fullLabel))}
					</>
				)}
			</div>
		);
	};

	if (loading) return <p>Loading...</p>;
	if (!treeData.length) return <p>No requirement data available.</p>;

	return (
		<div>
			<div className="mb-2 space-x-2">
				<button
					onClick={() => handleExpandCollapse("expand")}
					className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
					Expand All
				</button>
				<button
					onClick={() => handleExpandCollapse("collapse")}
					className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">
					Collapse All
				</button>
			</div>
			<h2 className="text-xl font-semibold mb-4">Requirement Tree</h2>
			{treeData.map(tree => renderTree(tree))}
		</div>
	);
};

export default RequirementTree;
