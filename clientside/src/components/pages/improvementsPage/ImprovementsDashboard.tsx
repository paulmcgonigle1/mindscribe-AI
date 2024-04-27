import { useContext, useEffect, useState } from "react";
import ActionableTasks from "./ActionableTasksView";
import { ImprovementData, Task } from "../../../lib/types/types";
import {
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
          console.log("tasks", tasks);
        } catch (error) {
          console.error("Error fetching completed tasks:", error);
        }
      }
    };

    fetchCompletedTasks();
  }, [authTokens]); // Dependency array depends on your specific needs
  return (
    <div className="mx-10 my-5  ">
      <div className="flex flex-col md:flex-row  justify-center items-center w-full px-2">
        <ActionableTasks improvementData={improvementData} />
      </div>

      <CompletedTasksView tasks={completedTasks} />
    </div>
  );
}

export default ImprovementsDashboard;
