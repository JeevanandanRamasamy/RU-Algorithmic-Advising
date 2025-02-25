import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Create from "./pages/Create";

import "./css/index.css";

function App() {
  return (
    <div>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
