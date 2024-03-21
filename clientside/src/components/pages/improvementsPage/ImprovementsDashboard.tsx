import React, { useContext, useEffect, useState } from "react";
import ActionableTasks from "./ActionableTasksView";
import { ImprovementData, Task } from "../../../lib/types/types";
import {
  createImprovements,
  getCompletedTasks,
  getImprovements,
} from "../../../services/JournalService";
import Improvements_Message from "./Improvements_Message";
import AuthContext from "../../../context/AuthContext";
import CompletedTasksView from "./CompletedTasksView";

function ImprovementsDashboard() {
  const [improvementData, setImprovementData] = useState<ImprovementData>({
    message: "",
    tasks: [],
    createdAt: null,
  });
  const [tasksCreated, setTasksCreated] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]); // Assuming Task[] is the correct type

  const { authTokens } = useContext(AuthContext) ?? {};

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

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (authTokens?.access) {
        try {
          const tasks = await getCompletedTasks(authTokens); // Implement this function based on your API
          setCompletedTasks(tasks);
        } catch (error) {
          console.error("Error fetching completed tasks:", error);
        }
      }
    };

    fetchCompletedTasks();
  }, [authTokens]); // Dependency array depends on your specific needs
  return (
    <div className="m-4 space-y-2">
      <div className="flex  items-center justify-center">
        <div className=" bg-rich-green p-8 border  rounded-lg flex flex-col items-center justify-center ">
          <h1 className="text-3xl text-black mb-2 text-left ">Improvements </h1>
          <p className="text-lg text-white text-center ">
            Welcome to your personal improvements space. This is the page where
            you can find actionable tasks to improve your mental health. You can
            also track tasks, and find out more information if you need.
          </p>
        </div>
      </div>

      <Improvements_Message improvementData={improvementData} />

      <div className="flex flex-col md:flex-row gap-6  justify-center items-center w-full px-2 ">
        <ActionableTasks improvementData={improvementData} />
      </div>

      <CompletedTasksView tasks={completedTasks} />
    </div>
  );
}

export default ImprovementsDashboard;
