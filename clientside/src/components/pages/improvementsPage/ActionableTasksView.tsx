import React, { useContext, useState } from "react";
import { ImprovementData, Task } from "../../../lib/types/types";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { saveTask } from "../../../services/JournalService";
import AuthContext from "../../../context/AuthContext";
interface ImprovementsMessageProps {
  improvementData: ImprovementData; // Define the type based on your actual type definitions
}
function ActionableTasksView({ improvementData }: ImprovementsMessageProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { authTokens } = useContext(AuthContext) ?? {};

  //handles clicking on read more button
  const handleReadMore = (task: Task) => {
    setSelectedTask(task);
  };
  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  //this is savin task (adding to InProgress)
  const handleSaveTask = async (taskId: number, state: boolean) => {
    if (authTokens?.access) {
      const response = await saveTask(authTokens, taskId, state);
      console.log(response);
    }
  };

  return (
    <div>
      <div className=" border-rich-green text-black p-4">
        <h3 className="text-xl font-semibold mb-2">
          Start with Your Actionable Tasks
        </h3>
        <p className="text-sm mb-1">
          <span className="font-semibold">To track a task:</span> Press{" "}
          <span className="font-semibold">'Save Task'</span>.
        </p>
        <p className="text-sm mb-1">
          <span className="font-semibold">To learn more:</span> Press{" "}
          <span className="font-semibold">'Read More'</span> for detailed
          insights.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {improvementData.tasks.map((task, index) => (
          <TaskCard
            key={task.taskId || index}
            task={task}
            onReadMore={handleReadMore}
            onSave={() => handleSaveTask(task.taskId, true)} // Pass taskId to handleSaveTask
            onUnsave={() => handleSaveTask(task.taskId, false)} // Assuming you have a handleUnsaveTask function
          />
        ))}
        <TaskModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}

export default ActionableTasksView;
