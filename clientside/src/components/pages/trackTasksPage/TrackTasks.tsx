import { useContext, useEffect, useState } from "react";
import { Task } from "../../../lib/types/types";
import { getTrackedTasks } from "../../../services/JournalService";
import { updateTaskCompletionStatus } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
import { saveTask } from "../../../services/JournalService";
import Load from "../../../assets/mindscribe2/svg/load.svg";

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
  const handleSaveTask = async (taskId: number, state: boolean) => {
    if (authTokens?.access) {
      const response = await saveTask(authTokens, taskId, state);
      console.log(response);
    }
  };
  const handleRemoveorCompleteTask = async (task: Task) => {
    if (!authTokens?.access) return;

    if (task.isCompleted) {
      // If the task is completed, we assume it should be removed from tracking
      // Call backend method to archive or mark it as no longer in progress
      await handleSaveTask(task.taskId, false);
    }

    // Update the inProgressTasks state to reflect changes
    setInProgressTasks((prevTasks) =>
      prevTasks.filter((t) => t.taskId !== task.taskId)
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-2xl">
      <div
        className="mb-6  p-6 rounded-lg"
        style={{ backgroundColor: "#f9a827" }}
      >
        <h1 className="text-2xl text-center font-semibold text-gray-800">
          Here are your tracked tasks
        </h1>
        <p className="text-md text-center text-gray-600 mt-2">
          Please complete your tasks if possible and mark as complete.
        </p>
        <p className="text-md text-center text-gray-600 mt-2">
          Alternatively, you can remove the task if you no longer want to do
          them.
        </p>
      </div>
      {inProgressTasks.length === 0 ? (
        <div className="text-center p-10">
          <img
            src={Load}
            alt="Descriptive Alt Text"
            className="h-[20vh] m-auto mt-6"
          />
          <p className="text-gray-500 mt-2">
            No tasks to display. Enjoy your day!
          </p>
        </div>
      ) : (
        inProgressTasks.map((task) => (
          <div
            key={task.taskId}
            className={`mb-4 p-4 rounded-lg flex justify-between items-center ${
              task.isCompleted ? "bg-green-200" : "bg-gray-50"
            }`}
          >
            <div>
              <p className="text-gray-700">{task.content}</p>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={(e) =>
                  handleTaskCompletionChange(task, e.target.checked)
                }
                className="form-checkbox h-5 w-5 text-green-500"
              />
              <p className="px-2 text-sm text-gray-700">Complete</p>
              <button
                onClick={() => handleRemoveorCompleteTask(task)}
                className="ml-2 p-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none"
              >
                X
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrackTasks;
