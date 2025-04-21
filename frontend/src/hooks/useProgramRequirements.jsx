import React, { useState, useEffect } from "react";

import { useAuth } from "../context/AuthContext";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const useProgramRequirements = () => {
    const { user, token } = useAuth();
    const [numTotalRequiredCourses, setNumTotalRequiredCourses] = useState(0);
    const [numTakenCourses, setNumTakenCourses] = useState(0);

    const fetchProgramRequirements = async (programId) => {
        try {
            const response = await fetch(
                `${backendUrl}/api/users/requirements/program?program_id=${programId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setNumTotalRequiredCourses(data.program_requirements);
            return data.program_requirements;
        } catch (error) {
            console.error("Error fetching program requirements", error);
        }
    }

    const fetchTakenCourses = async (programId) => {
        try {
            const response = await fetch(
                `${backendUrl}/api/users/requirements/program/taken-courses?program_id=${programId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            setNumTakenCourses(data.num_courses_taken);
            return data.num_courses_taken;
        } catch (error) {
            console.error("Error fetching needed courses", error);
        }
    }

    return {
        fetchProgramRequirements,
        fetchTakenCourses
    };
}

export default useProgramRequirements;