import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RequirementTree = ({ programId, username }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    const fetchTree = async () => {
      try {
        console.log("Fetching labeled requirement tree...");
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

  const toggleNode = (groupId) => {
    setExpandedNodes((prev) => {
      const updated = new Set(prev);
      if (updated.has(groupId)) {
        updated.delete(groupId);
      } else {
        updated.add(groupId);
      }
      return updated;
    });
  };

  const renderTree = (node, depth = 0) => {
    const isExpandable = node.children?.length > 0 || node.courses?.length > 0;
    const isExpanded = expandedNodes.has(node.group_id);

    return (
      <div key={node.group_id} style={{ marginLeft: depth * 20 }}>
        <div
          onClick={() => isExpandable && toggleNode(node.group_id)}
          style={{
            cursor: isExpandable ? "pointer" : "default",
            fontWeight: "bold",
          }}
        >
          {isExpandable && (
            <span style={{ marginRight: 5 }}>{isExpanded ? "▼" : "▶"}</span>
          )}
          {node.label}. {node.group_name} — Required: {node.num_required}
        </div>

        {isExpanded && (
          <>
            {node.courses?.length > 0 && (
              <ul>
                {node.courses.map((course) => (
                  <li
                    key={course.course_id}
                    style={{
                      color: course.taken ? "green" : "black",
                      fontWeight: course.taken ? "bold" : "normal",
                    }}
                  >
                    {course.course_id} - {course.course_name} -{" "}
                    {course.course_credits} Credits
                  </li>
                ))}
              </ul>
            )}
            {node.children?.map((child) => renderTree(child, depth + 1))}
          </>
        )}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!treeData.length) return <p>No requirement data available.</p>;

  return (
    <div>
      <h2>Requirement Tree</h2>
      {treeData.map((tree) => renderTree(tree))}
    </div>
  );
};

export default RequirementTree;
