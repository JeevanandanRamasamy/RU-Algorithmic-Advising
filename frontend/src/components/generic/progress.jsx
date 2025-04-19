import React from "react";

const Progress = ({ value, max = 100 }) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
                className="bg-blue-500 h-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default Progress;