import React, { useContext, useEffect, useState } from "react";
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
  const [tasksCreated, setTasksCreated] = useState(false);

  const { authTokens } = useContext(AuthContext) ?? {};
  const handleCreateImprovements = async () => {
    if (authTokens?.access) {
      try {
        const response = await createImprovements(authTokens);
        console.log("Created Improvements plan:", response);
        setTasksCreated(true);
      } catch (error) {
        console.error("Error creating mental health plan:", error);
      }
    }
  };

  //use effect runs when creating new tasks instead of returning the response from create
  useEffect(() => {
    if (tasksCreated) {
      const fetchImprovements = async () => {
        if (authTokens?.access) {
          try {
            const response = await getImprovements(authTokens);
            console.log("Updated improvements plan:", response);
            setImprovementData({
              message: response.message,
              tasks: response.tasks,
              createdAt: response.createdAt,
            });
          } catch (error) {
            console.error("Error fetching updated improvement plan:", error);
          }
        }
      };

      fetchImprovements();
      setTasksCreated(false); // Reset for further creations
    }
  }, [tasksCreated, authTokens]); // Runs whenever tasksCreated changes

  //gets most recent improvements
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
