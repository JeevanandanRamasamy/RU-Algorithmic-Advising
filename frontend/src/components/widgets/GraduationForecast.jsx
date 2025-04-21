import { useState } from "react";
import Card, { CardContent } from "../generic/Card";

const GraduationForecastCard = ({ totalCredits, creditsEarned }) => {
    const earned = Number(creditsEarned);
    const total = Number(totalCredits);
    const [creditsPerSemester, setCreditsPerSemester] = useState(15);

    const handleCreditsChange = (e) => {
        const val = Number(e.target.value);
        if (val >= 6 && val <= 20.5) {
            setCreditsPerSemester(val);
        }
    };

    const progressRatio = earned / total;
    const semestersLeft = Math.ceil((total - earned) / creditsPerSemester);

    let progressMessage = null;
    if (earned === 0.0) {
        progressMessage = "Let’s get started! Begin enrolling in courses to make progress. 🚀";
    } else if (progressRatio >= 0.9) {
        progressMessage = "So close! You're almost at the finish line. 🏁";
    } else if (progressRatio >= 0.6 && semestersLeft <= 2) {
        progressMessage = "You’re on track! Keep up the momentum. 🎓";
    } else if (creditsPerSemester < 12 && semestersLeft > 4) {
        progressMessage = "Consider increasing your credits per semester to stay on track. ⏳";
    } else if (semestersLeft > 6) {
        progressMessage = "You might need to take more credits or stay longer to graduate on time. 🚨";
    } else {
        progressMessage = "You're making solid progress. Stay focused! 📚";
    }

    return (
        <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <p className="text-xl font-semibold mb-2">Graduation Forecast</p>

                <p className="text-sm text-gray-700 mb-1">You’re on track to graduate in</p>

                <p className="text-5xl font-bold text-primary leading-none tracking-tight my-2">
                    {semestersLeft}
                </p>

                <p className="text-sm font-medium text-gray-700">
                    semester{semestersLeft != 1 ? "s" : ""}
                </p>

                <div className="mt-3 text-sm text-gray-500">
                    Assuming you take{" "}
                    <input
                        type="number"
                        min="6"
                        max="20.5"
                        step="0.5"
                        value={creditsPerSemester}
                        onChange={handleCreditsChange}
                        className="mx-1 w-10 p-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />{" "}
                    credits/semester
                </div>

                {progressMessage && (
                    <p className="mt-3 text-sm font-medium text-blue-600">{progressMessage}</p>
                )}
            </CardContent>
        </Card>
    );
};

export default GraduationForecastCard;