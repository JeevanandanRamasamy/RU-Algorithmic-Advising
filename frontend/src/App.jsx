import React from "react";
import { Routes, Route } from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";
import DragDrop from "./pages/DragDrop"

import "./css/index.css";

function App() {
  return (
    <div>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route 
            path="/dragdrop" 
            element={
              <DndProvider backend={HTML5Backend}>
                <DragDrop />
              </DndProvider>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
