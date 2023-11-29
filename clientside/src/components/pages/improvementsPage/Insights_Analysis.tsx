import React, { useEffect, useState } from "react";
import { ImprovementData, Insight } from "../../../lib/types/types";
import {
  createMentalHealthPlan,
  getMentalHealthPlan,
} from "../../../services/JournalService";

function Insights_Analysis() {
  const [mentalHealthData, setMentalHealthData] = useState<ImprovementData>({
    plan: "",
    createdAt: null,
  });
  const userId = 1;
  //creates new mental health plan and sets that to the one
  const handleCreatePlan = async () => {
    try {
      const response = await createMentalHealthPlan(userId);
      console.log("Received mental health plan:", response);
      setMentalHealthData({
        plan: response.plan,
        createdAt: response.createdAt,
      });
    } catch (error) {
      console.error("Error creating mental health plan:", error);
    }
  };
  //gets most recent mental health plan
  useEffect(() => {
    const fetchMentalHealthPlan = async () => {
      try {
        const response = await getMentalHealthPlan(userId);
        console.log("Received mental health plan:", response);
        setMentalHealthData({
          plan: response.plan,
          createdAt: response.createdAt,
        });
      } catch (error) {
        console.error("Error fetching mental health plan:", error);
      }
    };
    fetchMentalHealthPlan();
  }, []);

  const formatPlan = (plan: string) => {
    return plan.split("\n\n").filter((point) => point);
  };
  return (
    <div className="relative border border-stone-400 bg-slate-200 px-4 w-full ">
      <h1 className="text-center text-lg	">Today's Improvements</h1>
      <div className="absolute bottom-0 right-0">
        <button
          onClick={handleCreatePlan}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Mental Health Plan
        </button>
      </div>

      {mentalHealthData.plan && (
        <div className="overflow-y-auto max-h-[400px] px-4">
          <h2 className="text-center text-sm">Mental Health Plan</h2>
          {mentalHealthData.createdAt && (
            <p className="text-center text-xs">
              Based on entry from :{" "}
              {new Date(mentalHealthData.createdAt).toLocaleString()}
            </p>
          )}
          <ul>
            {formatPlan(mentalHealthData.plan).map((point, index) => (
              <li key={index} className="my-2">
                <p>{point}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Insights_Analysis;
