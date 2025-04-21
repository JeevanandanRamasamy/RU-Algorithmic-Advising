import React from "react";
import clsx from "clsx";

export const Card = ({ children, className = "" }) => {
    return (
        <div
            className={clsx(
                "rounded-2xl border border-gray-200 bg-[#fcf8d7] shadow-md", // Updated background color for card
                "transition-all duration-300 ease-in-out hover:shadow-lg",
                className
            )}
        >
            {children}
        </div>
    );
};

export const CardContent = ({ children, className = "" }) => {
    return (
        <div className={clsx("p-4", className)}>
            <div className="text-[#cc0033]">
                {children}
            </div>
        </div>
    );
};

export default Card;