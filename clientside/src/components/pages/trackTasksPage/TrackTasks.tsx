import React, { useContext, useEffect, useState } from "react";
import TaskProgressBar from "./TaskProgressBar"; // This would be a new component for the progress bar
import { Task } from "../../../lib/types/types";
import { getTrackedTasks } from "../../../services/JournalService";
import { updateTaskCompletionStatus } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";

const TrackTasks = () => {
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const { authTokens } = useContext(AuthContext) ?? {};

  useEffect(() => {
    // Fetch in-progress tasks when the modal opens
    const loadInProgressTasks = async () => {
      if (authTokens?.access) {
        try {
          const tasks = await getTrackedTasks(authTokens);
          console.log("Tasks In Progress:", tasks);
          setInProgressTasks(tasks);
        } catch (error) {
          console.error("Error fetching tracked tasks plan:", error);
        }
      }
    };

    loadInProgressTasks();
  }, [authTokens]);

  const handleTaskCompletionChange = async (task: Task, isChecked: boolean) => {
    if (authTokens?.access) {
      await updateTaskCompletionStatus(authTokens, task.taskId);
    }

    // Update your inProgressTasks state here to reflect the change
    setInProgressTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.taskId === task.taskId ? { ...t, isCompleted: isChecked } : t
      )
    );
  };

  return (
    <div className="p-4">
      {/* Your popover content here */}

      {inProgressTasks.map((task) => (
        <div key={task.taskId} className="mb-4">
          <p>{task.content}</p>
          <TaskProgressBar percentage={calculateTaskProgress(task)} />
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={(e) => handleTaskCompletionChange(task, e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
      ))}
    </div>
  );
};

// Helper function to calculate progress percentage
const calculateTaskProgress = (task: Task) => {
  // Implement logic based on your requirements
  return task.isCompleted ? 100 : 0; // This is a placeholder
};

export default TrackTasks;
