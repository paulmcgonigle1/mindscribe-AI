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
    <div className="m-4 space-y-2">
      <button
        onClick={handleCreateImprovements}
        className="bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 text-white font-bold py-2 px-4 rounded transition ease-in-out duration-150"
        aria-label="Create new improvements"
      >
        Create Actionable Tasks
      </button>

      <Improvements_Message improvementData={improvementData} />

      <div className="flex flex-col md:flex-row gap-6  justify-center items-center w-full px-2 ">
        <ActionableTasks improvementData={improvementData} />
      </div>
    </div>
  );
}

export default ImprovementsDashboard;
