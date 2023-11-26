import React, { useEffect, useState } from "react";
import { Insight } from "../../../lib/types/types";
import { createMentalHealthPlan } from "../../../services/JournalService";
function Insights_Analysis() {
  const [mentalHealthPlan, setMentalHealthPlan] = useState("");
  const userId = 1;
  const handleCreatePlan = async () => {
    try {
      const plan = await createMentalHealthPlan(userId);
      setMentalHealthPlan(plan);
    } catch (error) {
      console.error("Error creating mental health plan:", error);
    }
  };

  const formatPlan = (plan: string) => {
    return plan.split("\n\n").filter((point) => point);
  };
  return (
    <div>
      <h1>Today's Insights</h1>
      <button
        onClick={handleCreatePlan}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Mental Health Plan
      </button>
      {mentalHealthPlan && (
        <div>
          <h2>Mental Health Plan</h2>
          <ul>
            {formatPlan(mentalHealthPlan).map((point, index) => (
              <li key={index} className="my-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Insights_Analysis;
