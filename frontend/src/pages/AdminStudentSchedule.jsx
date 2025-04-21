// frontend/src/pages/AdminStudentSchedule.jsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";

export default function AdminStudentSchedule() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/students/${studentId}/schedule`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(setSchedule)
      .catch(console.error);
  }, [studentId, token]);

  return (
    <div className="p-6">
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 border rounded"
      >
        ← Back
      </button>
      <h1 className="text-2xl mb-4">
        Schedule for {studentId}
      </h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 border">Course</th>
            <th className="px-2 py-1 border">Name</th>
            <th className="px-2 py-1 border">Term</th>
            <th className="px-2 py-1 border">Year</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((rec, idx) => (
            <tr key={idx}>
              <td className="px-2 py-1 border">{rec.course_id}</td>
              <td className="px-2 py-1 border">{rec.course_name}</td>
              <td className="px-2 py-1 border">{rec.term}</td>
              <td className="px-2 py-1 border">{rec.year}</td>
            </tr>
          ))}
          {schedule.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No courses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
