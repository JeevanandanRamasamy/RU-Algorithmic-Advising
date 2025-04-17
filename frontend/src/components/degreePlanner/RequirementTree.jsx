import React, { useEffect, useState } from "react";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const RequirementTree = ({ programId }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        console.log("Fetching requirement tree...");
        const res = await fetch(
          `${backendUrl}/api/degree_planner/programs/${programId}/requirement-tree`
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }

        const data = await res.json(); // body is only consumed here
        setTreeData(data);
      } catch (err) {
        console.error("Failed to fetch requirement tree:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, [programId]);

  if (loading) return <p>Loading...</p>;
  if (!treeData.length) return <p>No requirement data available.</p>;

  const renderTree = (node, depth = 0) => (
    <div key={node.group_id} style={{ marginLeft: depth * 20 }}>
      <strong>Group {node.group_id}</strong> — Required: {node.num_required}
      {node.lst?.length > 0 && (
        <ul>
          {node.lst.map((course) => (
            <li key={course}>{course}</li>
          ))}
        </ul>
      )}
      {node.prerequisites?.map((child) => renderTree(child, depth + 1))}
    </div>
  );

  return (
    <div>
      <h2>Requirement Tree</h2>
      {treeData.map((tree) => renderTree(tree))}
    </div>
  );
};

export default RequirementTree;
