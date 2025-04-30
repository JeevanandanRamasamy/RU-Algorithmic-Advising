import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/navbar/Navbar";
import DataTable from "../components/generic/DataTable";
import Card, { CardContent } from "../components/generic/Card";
import NotificationsButton from "../components/widgets/Notifications";
import Chatbot from "../components/widgets/Chatbot";
import { useNavigate } from "react-router-dom";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function AdminDashboard() {
  const { user, token, role } = useAuth();
  const navigate = useNavigate();

  // Redirect logic
  useEffect(() => {
    if (!user) navigate("/");
    else if (role === "student") navigate("/student/home");
  }, [user, role, navigate]);

  // SPN Requests
  const [spnApi] = useState(`${backendUrl}/api/admin/spn?pending=true`);
  const [spnUpdateApi] = useState(`${backendUrl}/api/admin/spn`);
  const spnColumns = [
    { header: "NetID", accessor: "student_id" },
    { header: "Course", accessor: "course_id" },
    { header: "Section", accessor: "section_num" },
    { header: "Term", accessor: "term" },
    { header: "Year", accessor: "year" },
    { header: "Reason", accessor: "reason" },
    { header: "Status", accessor: "status" }
  ];

  // Popularity state
  const [popular, setPopular] = useState({ most_popular: [], least_popular: [] });

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/courses/popular`, {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(setPopular)
      .catch(console.error);
  }, [token]);

  // Students list
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/api/admin/students?q=${query}`, {
      headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);
  }, [query, token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <NotificationsButton />
      <Chatbot />
      <div className="p-8 ml-[110px]">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Pending SPN Requests */}
          <Card>
            <CardContent className="p-6">
              <p className="text-xl font-semibold mb-4">Pending SPN Requests</p>
              <DataTable
                apiUrl={spnApi}
                updateApiUrl={spnUpdateApi}
                columns={spnColumns}
                noDataMessage="No pending SPN requests."
              />
            </CardContent>
          </Card>

          {/* Top 3 Most Popular */}
          <Card>
            <CardContent className="p-6">
              <p className="text-xl font-semibold mb-4">Top 3 Most Popular</p>
              <ul className="list-disc list-inside space-y-1">
                {popular.most_popular.map(c => (
                  <li key={c.course_id} className="text-gray-700">
                    {c.course_id} ({c.count} students)
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Top 3 Least Popular */}
          <Card>
            <CardContent className="p-6">
              <p className="text-xl font-semibold mb-4">Top 3 Least Popular</p>
              <ul className="list-disc list-inside space-y-1">
                {popular.least_popular.map(c => (
                  <li key={c.course_id} className="text-gray-700">
                    {c.course_id} ({c.count} students)
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Student Directory (full width) */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="p-6">
              <p className="text-xl font-semibold mb-4">Student Directory</p>
              <input
                type="text"
                placeholder="Search NetID…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <ul className="divide-y mt-4">
                {students.map(s => (
                  <li
                    key={s.username}
                    className="py-2 hover:underline cursor-pointer text-gray-800"
                    onClick={() => navigate(`/admin/student/${s.username}`)}
                  >
                    {s.username} — {s.first_name} {s.last_name}
                  </li>
                ))}
                {students.length === 0 && (
                  <li className="py-2 text-gray-600">No students found.</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
