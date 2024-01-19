import React, { useEffect, useState } from "react";
import Summary from "../mainPage/Summary";
import Improvements_Analysis from "./Improvements_Message";
import ActionableTasks from "./ActionableTasksView";
import { ImprovementData } from "../../../lib/types/types";
import {
  createImprovements,
  getImprovements,
} from "../../../services/JournalService";
import Improvements_Message from "./Improvements_Message";

function ImprovementsDashboard() {
  const [improvementData, setImprovementData] = useState<ImprovementData>({
    message: "",
    tasks: [],
    createdAt: null,
  });
  const userId = 1;

  const handleCreateImprovements = async () => {
    try {
      const response = await createImprovements(userId);
      console.log("Received mental health plan:", response);
      setImprovementData({
        message: response.message,
        tasks: response.tasks,
        createdAt: response.createdAt,
      });
    } catch (error) {
      console.error("Error creating mental health plan:", error);
    }
  };
  //gets most recent mental health plan
  useEffect(() => {
    const fetchImprovements = async () => {
      try {
        const response = await getImprovements(userId);
        console.log("Most recent improvements plan:", response);
        setImprovementData({
          message: response.message,
          tasks: response.tasks,
          createdAt: response.createdAt,
        });
      } catch (error) {
        console.error("Error fetching improvement health plan:", error);
      }
    };
    fetchImprovements();
  }, []);
  return (
    <div className="flex-column gap-4 p-4 md:p-8">
      {/* <DashboardStatsGrid /> */}
      <button
        onClick={handleCreateImprovements}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Improvements
      </button>
      <div className="flex flex-row gap-4 w-full px-4">
        <Improvements_Message improvementData={improvementData} />
      </div>

      <div className="flex flex-row gap-4 w-full px-4">
        <div className="flex flex-1 min-w-0">
          <ActionableTasks improvementData={improvementData} />
        </div>
      </div>
    </div>
  );
}

export default ImprovementsDashboard;
