import { useState, useEffect, useCallback } from "react";

const term = {
	SPRING: "spring",
	SUMMER: "summer",
	FALL: "fall",
	WINTER: "winter"
};
const useSemester = (backendUrl, token) => {
	const [year, setYear] = useState(new Date().getFullYear());
	const [term, setTerm] = useState("");
	return { year, setYear, term, setTerm };
};

export default useSemester;
