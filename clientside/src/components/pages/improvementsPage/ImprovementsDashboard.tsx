import React, { useContext, useEffect, useState } from "react";
import Summary from "../mainPage/Summary";
import Improvements_Analysis from "./Improvements_Message";
import ActionableTasks from "./ActionableTasksView";
import { ImprovementData } from "../../../lib/types/types";
import {
  createImprovements,
  getImprovements,
} from "../../../services/JournalService";
import Improvements_Message from "./Improvements_Message";
import AuthContext from "../../../context/AuthContext";

function ImprovementsDashboard() {
  const [improvementData, setImprovementData] = useState<ImprovementData>({
    message: "",
    tasks: [],
    createdAt: null,
  });
  const { authTokens } = useContext(AuthContext) ?? {};
  const handleCreateImprovements = async () => {
    if (authTokens?.access) {
      try {
        const response = await createImprovements(authTokens);
        console.log("Received mental health plan:", response);
        setImprovementData({
          message: response.message,
          tasks: response.tasks,
          createdAt: response.createdAt,
        });
      } catch (error) {
        console.error("Error creating mental health plan:", error);
      }
    }
  };
  //gets most recent mental health plan
  useEffect(() => {
    const fetchImprovements = async () => {
      if (authTokens?.access) {
        try {
          const response = await getImprovements(authTokens);
          console.log("Most recent improvements plan:", response);
          setImprovementData({
            message: response.message,
            tasks: response.tasks,
            createdAt: response.createdAt,
          });
        } catch (error) {
          console.error("Error fetching improvement health plan:", error);
        }
      }
    };
    fetchImprovements();
  }, []);
  return (
    <div className="md:p-8">
      <button
        onClick={handleCreateImprovements}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Create Improvements
      </button>
      <div className=" m-2">
        <div className="flex flex-col sm:flex-row gap-4 w-full px-4">
          <div className="hidden xl:block sm:max-w-xs md:max-w-sm lg:max-w-md">
            <Improvements_Message improvementData={improvementData} />
          </div>
          <div className="flex-1">
            <ActionableTasks improvementData={improvementData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImprovementsDashboard;
